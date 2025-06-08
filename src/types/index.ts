export interface MockRule {
  id: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  responseData: Record<string, unknown>;
  statusCode: number;
  enabled: boolean;
  description?: string;
}

export interface StorageData {
  mockRules: MockRule[];
}

export interface Message {
  type: 'GET_RULES' | 'ADD_RULE' | 'UPDATE_RULE' | 'DELETE_RULE' | 'TOGGLE_RULE';
  payload?: unknown;
}

export interface FormState {
  url: string;
  method: MockRule['method'];
  statusCode: string;
  description: string;
  responseData: string;
} 