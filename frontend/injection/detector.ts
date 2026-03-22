import { log } from '../services/logger';

// Same container selector that HLTB uses for the game header area
const CONTAINER_SELECTOR = '.NZMJ6g2iVnFsOOp-lDmIP';

export interface GamePageInfo {
  appId: number;
  container: HTMLElement;
}

export function detectGamePage(doc: Document): GamePageInfo | null {
  const mgr = (window as any).MainWindowBrowserManager;
  if (!mgr?.m_lastLocation?.pathname) return null;

  const match = mgr.m_lastLocation.pathname.match(/\/app\/(\d+)/);
  if (!match) return null;

  const appId = parseInt(match[1], 10);

  // Filter out invalid/non-game app IDs (internal Steam IDs can be billions)
  if (isNaN(appId) || appId <= 0 || appId > 10000000) return null;

  const container = doc.querySelector(CONTAINER_SELECTOR) as HTMLElement | null;
  if (!container) return null;

  return { appId, container };
}
