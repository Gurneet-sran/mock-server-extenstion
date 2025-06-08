import type { MockRule, FormState } from '../types';
import { JsonEditor } from './JsonEditor';

interface AddRuleFormProps {
  formState: FormState;
  onFormStateChange: (state: FormState) => void;
  onSubmit: (rule: Omit<MockRule, 'id'>) => Promise<void>;
  onClearForm: () => void;
}

export const AddRuleForm: React.FC<AddRuleFormProps> = ({
  formState,
  onFormStateChange,
  onSubmit,
  onClearForm,
}) => {
  const handleInputChange = (
    field: keyof FormState,
    value: string
  ) => {
    const newState = { ...formState, [field]: value };
    onFormStateChange(newState);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const responseData = JSON.parse(formState.responseData);
      
      const newRule: Omit<MockRule, 'id'> = {
        url: formState.url,
        method: formState.method,
        statusCode: parseInt(formState.statusCode),
        description: formState.description || undefined,
        responseData,
        enabled: true
      };

      await onSubmit(newRule);
      
      // Clear form after successful submission
      onClearForm();
      
    } catch {
      alert('Invalid JSON format in response data. Please check your JSON syntax.');
    }
  };

  return (
    <div className="add-rule-section">
      <h2>Add New Rule</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="url">URL Pattern</label>
          <input
            type="text"
            id="url"
            value={formState.url}
            onChange={(e) => handleInputChange('url', e.target.value)}
            placeholder="https://api.example.com/users"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="method">HTTP Method</label>
          <select
            id="method"
            value={formState.method}
            onChange={(e) => handleInputChange('method', e.target.value as FormState['method'])}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="statusCode">Status Code</label>
          <input
            type="number"
            id="statusCode"
            value={formState.statusCode}
            onChange={(e) => handleInputChange('statusCode', e.target.value)}
            min="100"
            max="599"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (Optional)</label>
          <input
            type="text"
            id="description"
            value={formState.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Brief description of this mock rule"
          />
        </div>

        <div className="form-group">
          <label htmlFor="responseData">Response Data (JSON)</label>
          <JsonEditor
            value={formState.responseData}
            onChange={(value) => handleInputChange('responseData', value)}
            height="200px"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Add Rule
        </button>
      </form>
    </div>
  );
}; 