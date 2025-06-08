import { useState } from 'react';
import type { MockRule } from '../types';
import { JsonEditor } from './JsonEditor';

interface EditRuleFormProps {
  rule: MockRule;
  onSubmit: (rule: MockRule) => Promise<void>;
  onCancel: () => void;
}

export const EditRuleForm: React.FC<EditRuleFormProps> = ({
  rule,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    url: rule.url,
    method: rule.method,
    statusCode: rule.statusCode.toString(),
    description: rule.description || '',
    responseData: JSON.stringify(rule.responseData, null, 2),
  });

  const handleInputChange = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const responseData = JSON.parse(formData.responseData);
      
      const updatedRule: MockRule = {
        ...rule,
        url: formData.url,
        method: formData.method as MockRule['method'],
        statusCode: parseInt(formData.statusCode),
        description: formData.description || undefined,
        responseData,
      };

      await onSubmit(updatedRule);
      
    } catch {
      alert('Invalid JSON format in response data. Please check your JSON syntax.');
    }
  };

  return (
    <div className="edit-rule-section">
      <h3>Edit Rule</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="edit-url">URL Pattern</label>
          <input
            type="text"
            id="edit-url"
            value={formData.url}
            onChange={(e) => handleInputChange('url', e.target.value)}
            placeholder="https://api.example.com/users"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="edit-method">HTTP Method</label>
          <select
            id="edit-method"
            value={formData.method}
            onChange={(e) => handleInputChange('method', e.target.value)}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="edit-statusCode">Status Code</label>
          <input
            type="number"
            id="edit-statusCode"
            value={formData.statusCode}
            onChange={(e) => handleInputChange('statusCode', e.target.value)}
            min="100"
            max="599"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="edit-description">Description (Optional)</label>
          <input
            type="text"
            id="edit-description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Brief description of this mock rule"
          />
        </div>

        <div className="form-group">
          <label htmlFor="edit-responseData">Response Data (JSON)</label>
          <JsonEditor
            value={formData.responseData}
            onChange={(value) => handleInputChange('responseData', value)}
            height="200px"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Update Rule
          </button>
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}; 