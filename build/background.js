chrome.runtime.onInstalled.addListener(() => {
  console.log("Mock API Extension installed");
  initializeStorage();
});
async function initializeStorage() {
  const result = await chrome.storage.sync.get(["mockRules"]);
  if (!result.mockRules) {
    await chrome.storage.sync.set({
      mockRules: []
    });
  }
}
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  handleMessage(message).then(sendResponse);
  return true;
});
async function handleMessage(message) {
  switch (message.type) {
    case "GET_RULES":
      return await getRules();
    case "ADD_RULE":
      return await addRule(message.payload);
    case "UPDATE_RULE":
      return await updateRule(message.payload);
    case "DELETE_RULE":
      return await deleteRule(message.payload);
    case "TOGGLE_RULE":
      return await toggleRule(message.payload);
    default:
      throw new Error("Unknown message type");
  }
}
async function getRules() {
  const result = await chrome.storage.sync.get(["mockRules"]);
  return result.mockRules || [];
}
async function addRule(rule) {
  const rules = await getRules();
  const newRule = {
    ...rule,
    id: generateId()
  };
  rules.push(newRule);
  await chrome.storage.sync.set({ mockRules: rules });
  await updateNetworkRules(rules);
  return rules;
}
async function updateRule(updatedRule) {
  const rules = await getRules();
  const index = rules.findIndex((rule) => rule.id === updatedRule.id);
  if (index !== -1) {
    rules[index] = updatedRule;
    await chrome.storage.sync.set({ mockRules: rules });
    await updateNetworkRules(rules);
  }
  return rules;
}
async function deleteRule(ruleId) {
  const rules = await getRules();
  const filteredRules = rules.filter((rule) => rule.id !== ruleId);
  await chrome.storage.sync.set({ mockRules: filteredRules });
  await updateNetworkRules(filteredRules);
  return filteredRules;
}
async function toggleRule(ruleId) {
  const rules = await getRules();
  const rule = rules.find((r) => r.id === ruleId);
  if (rule) {
    rule.enabled = !rule.enabled;
    await chrome.storage.sync.set({ mockRules: rules });
    await updateNetworkRules(rules);
  }
  return rules;
}
async function updateNetworkRules(mockRules) {
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const ruleIds = existingRules.map((rule) => rule.id);
  if (ruleIds.length > 0) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ruleIds
    });
  }
  const enabledRules = mockRules.filter((rule) => rule.enabled);
  const newRules = enabledRules.map((rule, index) => ({
    id: index + 1,
    priority: 1,
    action: {
      type: "redirect",
      redirect: {
        url: `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(rule.responseData))}`
      }
    },
    condition: {
      urlFilter: rule.url,
      requestMethods: [rule.method.toLowerCase()]
    }
  }));
  if (newRules.length > 0) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: newRules
    });
  }
}
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync" && changes.mockRules) {
    updateNetworkRules(changes.mockRules.newValue || []);
  }
});
