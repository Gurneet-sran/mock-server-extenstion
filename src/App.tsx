import { useState } from 'react';
import { AddRuleForm } from './components/AddRuleForm';
import { EditRuleForm } from './components/EditRuleForm';
import { RulesList } from './components/RulesList';
import { ThemeSwitch } from './components/ThemeSwitch';
import { FullscreenButton } from './components/FullscreenButton';
import { useRules } from './hooks/useRules';
import { useFormPersistence } from './hooks/useFormPersistence';
import type { MockRule } from './types';
import './App.css';

function App() {
  const { rules, loading, error, addRule, updateRule, toggleRule, deleteRule } = useRules();
  const { formState, saveFormState, clearFormState, setFormState } = useFormPersistence();
  const [editingRule, setEditingRule] = useState<MockRule | null>(null);

  // Check if we're in fullscreen mode
  const urlParams = new URLSearchParams(window.location.search);
  const isFullscreen = urlParams.get('mode') === 'fullscreen';

  const handleFormStateChange = (newState: typeof formState) => {
    setFormState(newState);
    saveFormState(newState);
  };

  const handleAddRule = async (rule: Parameters<typeof addRule>[0]) => {
    await addRule(rule);
  };

  const handleUpdateRule = async (rule: MockRule) => {
    await updateRule(rule);
    setEditingRule(null);
  };

  const handleEditRule = (rule: MockRule) => {
    setEditingRule(rule);
  };

  const handleCancelEdit = () => {
    setEditingRule(null);
  };

  const handleClearForm = () => {
    clearFormState();
  };

  return (
    <div className="container">
      <header>
        <h1>Mock API Extension</h1>
        <div className="header-controls">
          {!isFullscreen && <FullscreenButton />}
          <ThemeSwitch />
        </div>
      </header>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {editingRule ? (
        <EditRuleForm
          rule={editingRule}
          onSubmit={handleUpdateRule}
          onCancel={handleCancelEdit}
        />
      ) : (
        <AddRuleForm
          formState={formState}
          onFormStateChange={handleFormStateChange}
          onSubmit={handleAddRule}
          onClearForm={handleClearForm}
        />
      )}

      <RulesList
        rules={rules}
        loading={loading}
        onToggle={toggleRule}
        onDelete={deleteRule}
        onEdit={handleEditRule}
      />
    </div>
  );
}

export default App;
