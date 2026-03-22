import { log } from '../services/logger';
import { fetchPlayerCount, PlayerCountResult } from '../services/api';
import { getSettings } from '../services/settings';
import { detectGamePage } from './detector';
import { createBadge, getExistingBadge, removeExistingBadge } from '../display/badge';
import { injectStyles, removeStyles } from '../display/styles';

let currentAppId: number | null = null;
let currentData: PlayerCountResult | null = null;
let processingAppId: number | null = null;
let observer: MutationObserver | null = null;
let refreshInterval: ReturnType<typeof setInterval> | null = null;

const REFRESH_INTERVAL_MS = 60000; // Refresh every 60s

export function resetState(): void {
  currentAppId = null;
  currentData = null;
  processingAppId = null;
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}

export function refreshDisplay(doc: Document): void {
  if (!currentAppId || !currentData) return;

  const settings = getSettings();
  const existing = getExistingBadge(doc);

  if (existing) {
    existing.replaceWith(createBadge(doc, settings, currentAppId, currentData));
    return;
  }

  // Display was removed but we still have data — re-detect and inject
  const gamePage = detectGamePage(doc);
  if (gamePage && gamePage.appId === currentAppId) {
    gamePage.container.style.position = 'relative';
    gamePage.container.appendChild(createBadge(doc, settings, currentAppId, currentData));
  }
}

async function handleGamePage(doc: Document): Promise<void> {
  const settings = getSettings();
  if (!settings.showBadge) {
    removeExistingBadge(doc);
    return;
  }

  const gamePage = detectGamePage(doc);
  if (!gamePage) return;

  const { appId, container } = gamePage;

  // Already processing this app — prevent MutationObserver re-entry
  if (appId === processingAppId) return;

  // Badge already exists and has content for this app
  const existingBadge = getExistingBadge(doc);
  if (appId === currentAppId && existingBadge && existingBadge.children.length > 0) {
    return;
  }

  processingAppId = appId;
  currentAppId = appId;
  log('Detected game page for appId:', appId);

  try {
    removeExistingBadge(doc);

    // Show loading state
    container.style.position = 'relative';
    container.appendChild(createBadge(doc, settings, appId)); // undefined = loading

    // Fetch player count from backend
    const result = await fetchPlayerCount(appId);

    // If game changed during fetch, bail
    if (currentAppId !== appId) {
      log('Game changed during fetch, skipping update');
      return;
    }

    currentData = result;
    const existing = getExistingBadge(doc);
    if (existing) {
      existing.replaceWith(createBadge(doc, settings, appId, result));
    }

    log('Player count:', result.formatted, result.success ? '' : '(failed)');

    // Set up periodic refresh
    if (refreshInterval) clearInterval(refreshInterval);
    refreshInterval = setInterval(async () => {
      if (currentAppId !== appId) return;
      const updated = await fetchPlayerCount(appId);
      if (currentAppId !== appId) return;
      currentData = updated;
      refreshDisplay(doc);
    }, REFRESH_INTERVAL_MS);

  } catch (e) {
    log('Error fetching player count:', e);
  } finally {
    if (processingAppId === appId) {
      processingAppId = null;
    }
  }
}

export function setupObserver(doc: Document): void {
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  resetState();
  log('Setting up observer');
  injectStyles(doc);

  observer = new MutationObserver(() => {
    handleGamePage(doc);
  });

  observer.observe(doc.body, {
    childList: true,
    subtree: true,
  });

  log('MutationObserver active');

  // Initial check
  handleGamePage(doc);
}

export function disconnectObserver(): void {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}

export function cleanupAll(doc: Document): void {
  disconnectObserver();
  resetState();
  removeExistingBadge(doc);
  removeStyles(doc);
}
