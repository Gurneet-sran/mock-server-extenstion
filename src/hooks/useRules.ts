import { useState, useEffect } from 'react';
import type { MockRule } from '../types';
import { ChromeService } from '../services/chrome';

export const useRules = () => {
  const [rules, setRules] = useState<MockRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRules = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedRules = await ChromeService.sendMessage({ type: 'GET_RULES' });
      setRules(fetchedRules);
    } catch (err) {
      setError('Failed to load rules');
      console.error('Failed to load rules:', err);
    } finally {
      setLoading(false);
    }
  };

  const addRule = async (rule: Omit<MockRule, 'id'>) => {
    try {
      setError(null);
      await ChromeService.sendMessage({ type: 'ADD_RULE', payload: rule });
      await loadRules();
    } catch (err) {
      setError('Failed to add rule');
      console.error('Failed to add rule:', err);
      throw err;
    }
  };

  const toggleRule = async (ruleId: string) => {
    try {
      setError(null);
      await ChromeService.sendMessage({ type: 'TOGGLE_RULE', payload: ruleId });
      await loadRules();
    } catch (err) {
      setError('Failed to toggle rule');
      console.error('Failed to toggle rule:', err);
    }
  };

  const deleteRule = async (ruleId: string) => {
    try {
      setError(null);
      await ChromeService.sendMessage({ type: 'DELETE_RULE', payload: ruleId });
      await loadRules();
    } catch (err) {
      setError('Failed to delete rule');
      console.error('Failed to delete rule:', err);
    }
  };

  const updateRule = async (rule: MockRule) => {
    try {
      setError(null);
      await ChromeService.sendMessage({ type: 'UPDATE_RULE', payload: rule });
      await loadRules();
    } catch (err) {
      setError('Failed to update rule');
      console.error('Failed to update rule:', err);
      throw err;
    }
  };

  useEffect(() => {
    loadRules();
  }, []);

  return {
    rules,
    loading,
    error,
    loadRules,
    addRule,
    updateRule,
    toggleRule,
    deleteRule,
  };
}; 