import { useState, useEffect } from 'react';
import type { FormState } from '../types';
import { ChromeService } from '../services/chrome';

export const useFormPersistence = () => {
  const [formState, setFormState] = useState<FormState>({
    url: '',
    method: 'GET',
    statusCode: '200',
    description: '',
    responseData: '',
  });

  const saveFormState = async (state: FormState) => {
    const stateAsStrings = {
      url: state.url,
      method: state.method,
      statusCode: state.statusCode,
      description: state.description,
      responseData: state.responseData,
    };
    await ChromeService.saveFormState(stateAsStrings);
    setFormState(state);
  };

  const clearFormState = async () => {
    await ChromeService.clearFormState();
    setFormState({
      url: '',
      method: 'GET',
      statusCode: '200',
      description: '',
      responseData: '',
    });
  };

  const restoreFormState = async () => {
    const savedState = await ChromeService.getFormState();
    if (savedState) {
      setFormState({
        url: savedState.url || '',
        method: (savedState.method as FormState['method']) || 'GET',
        statusCode: savedState.statusCode || '200',
        description: savedState.description || '',
        responseData: savedState.responseData || '',
      });
    }
  };

  useEffect(() => {
    restoreFormState();
  }, []);

  return {
    formState,
    saveFormState,
    clearFormState,
    setFormState,
  };
}; 