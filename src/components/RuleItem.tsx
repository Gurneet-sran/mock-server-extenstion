import type { MockRule } from '../types';

interface RuleItemProps {
  rule: MockRule;
  onToggle: (ruleId: string) => void;
  onDelete: (ruleId: string) => void;
  onEdit: (rule: MockRule) => void;
}

export const RuleItem: React.FC<RuleItemProps> = ({ rule, onToggle, onDelete, onEdit }) => {
  const responseText = JSON.stringify(rule.responseData, null, 2);
  const truncatedResponse = responseText.length > 200 
    ? responseText.substring(0, 200) + '...' 
    : responseText;

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      onDelete(rule.id);
    }
  };

  const handleEdit = () => {
    onEdit(rule);
  };

  return (
    <div className="rule-item">
      <div className="rule-header">
        <div className="rule-url">{rule.url}</div>
        <span className={`rule-method ${rule.method}`}>{rule.method}</span>
      </div>
      
      {rule.description && (
        <div className="rule-description">{rule.description}</div>
      )}
      
      <div className="rule-response">
        <strong>Status:</strong> {rule.statusCode}<br />
        <strong>Response:</strong><br />
        <pre>{truncatedResponse}</pre>
      </div>
      
      <div className="rule-actions">
        <span className={`status-indicator ${rule.enabled ? 'status-enabled' : 'status-disabled'}`}></span>
        
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={rule.enabled}
            onChange={() => onToggle(rule.id)}
          />
          <span className="slider"></span>
        </label>
        
        <button
          onClick={handleEdit}
          className="btn btn-secondary btn-small"
        >
          Edit
        </button>
        
        <button
          onClick={handleDelete}
          className="btn btn-danger btn-small"
        >
          Delete
        </button>
      </div>
    </div>
  );
}; 