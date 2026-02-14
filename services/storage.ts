import { HistoryItem } from '../types';

const STORAGE_KEY = 'scamguard_history';

export const getHistory = (): HistoryItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load history", error);
    return [];
  }
};

export const saveHistoryItem = (item: HistoryItem): void => {
  try {
    const current = getHistory();
    // Limit to last 50 items to prevent storage bloat
    const updated = [item, ...current].slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save history", error);
  }
};

export const clearHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};