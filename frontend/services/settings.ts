import { log } from './logger';

export interface PluginSettings {
  showBadge: boolean;
  alignRight: boolean;
  horizontalOffset: number;
  verticalOffset: number;
}

const DEFAULT_SETTINGS: PluginSettings = {
  showBadge: true,
  alignRight: true,
  horizontalOffset: 0,
  verticalOffset: 0,
};

const STORAGE_KEY = 'playcount-settings';

let cachedSettings: PluginSettings = { ...DEFAULT_SETTINGS };

export function initSettings(): void {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      cachedSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      log('Settings loaded');
    }
  } catch (e) {
    log('Using default settings');
  }
}

export function getSettings(): PluginSettings {
  return cachedSettings;
}

export function saveSettings(settings: PluginSettings): void {
  cachedSettings = settings;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    log('Failed to save settings');
  }
}
