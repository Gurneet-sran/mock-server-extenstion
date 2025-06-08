import type { MockRule } from '../types';
import { RuleItem } from './RuleItem';

interface RulesListProps {
  rules: MockRule[];
  loading: boolean;
  onToggle: (ruleId: string) => void;
  onDelete: (ruleId: string) => void;
  onEdit: (rule: MockRule) => void;
}

export const RulesList: React.FC<RulesListProps> = ({ 
  rules, 
  loading, 
  onToggle, 
  onDelete,
  onEdit
}) => {
  if (loading) {
    return (
      <div className="rules-section">
        <h2>Mock Rules</h2>
        <div className="loading-state">
          <div>Loading rules...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rules-section">
      <h2>Mock Rules</h2>
      <div className="rules-list">
        {rules.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🚫</div>
            <div className="empty-state-text">No mock rules configured yet</div>
          </div>
        ) : (
          rules.map(rule => (
            <RuleItem
              key={rule.id}
              rule={rule}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </div>
  );
}; 