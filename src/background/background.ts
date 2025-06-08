import type { MockRule, Message } from '../types';

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Mock API Extension installed');
  initializeStorage();
});

// Initialize storage with default data
async function initializeStorage() {
  const result = await chrome.storage.sync.get(['mockRules']);
  if (!result.mockRules) {
    await chrome.storage.sync.set({
      mockRules: []
    });
  }
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
  handleMessage(message).then(sendResponse);
  return true; // Keep message channel open for async response
});

async function handleMessage(message: Message) {
  switch (message.type) {
    case 'GET_RULES':
      return await getRules();
    case 'ADD_RULE':
      return await addRule(message.payload as Omit<MockRule, 'id'>);
    case 'UPDATE_RULE':
      return await updateRule(message.payload as MockRule);
    case 'DELETE_RULE':
      return await deleteRule(message.payload as string);
    case 'TOGGLE_RULE':
      return await toggleRule(message.payload as string);
    default:
      throw new Error('Unknown message type');
  }
}

async function getRules(): Promise<MockRule[]> {
  const result = await chrome.storage.sync.get(['mockRules']);
  return result.mockRules || [];
}

async function addRule(rule: Omit<MockRule, 'id'>): Promise<MockRule[]> {
  const rules = await getRules();
  const newRule: MockRule = {
    ...rule,
    id: generateId()
  };
  rules.push(newRule);
  await chrome.storage.sync.set({ mockRules: rules });
  await updateNetworkRules(rules);
  return rules;
}

async function updateRule(updatedRule: MockRule): Promise<MockRule[]> {
  const rules = await getRules();
  const index = rules.findIndex(rule => rule.id === updatedRule.id);
  if (index !== -1) {
    rules[index] = updatedRule;
    await chrome.storage.sync.set({ mockRules: rules });
    await updateNetworkRules(rules);
  }
  return rules;
}

async function deleteRule(ruleId: string): Promise<MockRule[]> {
  const rules = await getRules();
  const filteredRules = rules.filter(rule => rule.id !== ruleId);
  await chrome.storage.sync.set({ mockRules: filteredRules });
  await updateNetworkRules(filteredRules);
  return filteredRules;
}

async function toggleRule(ruleId: string): Promise<MockRule[]> {
  const rules = await getRules();
  const rule = rules.find(r => r.id === ruleId);
  if (rule) {
    rule.enabled = !rule.enabled;
    await chrome.storage.sync.set({ mockRules: rules });
    await updateNetworkRules(rules);
  }
  return rules;
}

// Update Chrome's declarativeNetRequest rules
async function updateNetworkRules(mockRules: MockRule[]) {
  // Clear existing rules
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const ruleIds = existingRules.map(rule => rule.id);
  
  if (ruleIds.length > 0) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ruleIds
    });
  }

  // Add new rules for enabled mock rules
  const enabledRules = mockRules.filter(rule => rule.enabled);
  const newRules = enabledRules.map((rule, index) => ({
    id: index + 1,
    priority: 1,
    action: {
      type: 'redirect' as const,
      redirect: {
        url: `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(rule.responseData))}`
      }
    },
    condition: {
      urlFilter: rule.url,
      requestMethods: [rule.method.toLowerCase() as 'get' | 'post' | 'put' | 'delete' | 'patch']
    }
  }));

  if (newRules.length > 0) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: newRules
    });
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Listen for storage changes and update rules accordingly
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.mockRules) {
    updateNetworkRules(changes.mockRules.newValue || []);
  }
}); 