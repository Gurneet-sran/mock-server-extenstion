import type { MockRule, Message } from '../types';

export class ChromeService {
  static async sendMessage(message: Message): Promise<MockRule[]> {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.sendMessage(message, resolve);
      } else {
        // Fallback for development/testing
        resolve([]);
      }
    });
  }

  static async saveFormState(formState: Record<string, string>): Promise<void> {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        await chrome.storage.local.set({ formState });
      }
    } catch (error) {
      console.error('Failed to save form state:', error);
    }
  }

  static async getFormState(): Promise<Record<string, string> | null> {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        const result = await chrome.storage.local.get(['formState']);
        return result.formState || null;
      }
      return null;
    } catch (error) {
      console.error('Failed to get form state:', error);
      return null;
    }
  }

  static async clearFormState(): Promise<void> {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        await chrome.storage.local.remove(['formState']);
      }
    } catch (error) {
      console.error('Failed to clear form state:', error);
    }
  }
} 