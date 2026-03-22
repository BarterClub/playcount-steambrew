import type { PlayerCountResult } from '../services/api';
import type { PluginSettings } from '../services/settings';

const CONTAINER_ID = 'playcount-badge';

function getDotClass(count: number): string {
  if (count > 50000) return 'high';
  if (count > 10000) return 'medium';
  if (count > 5000) return 'low';
  if (count > 0) return 'default';
  return 'inactive';
}

/**
 * Creates the player count badge element.
 * - `undefined` data → Loading state
 * - data present → Show count
 */
export function createBadge(
  doc: Document,
  settings: PluginSettings,
  appId: number,
  data?: PlayerCountResult,
): HTMLElement {
  const container = doc.createElement('div');
  container.id = CONTAINER_ID;

  // Position based on settings
  if (settings.alignRight) {
    container.style.right = `${settings.horizontalOffset}px`;
    container.style.left = 'auto';
  } else {
    container.style.left = `${settings.horizontalOffset}px`;
    container.style.right = 'auto';
  }
  container.style.top = `${settings.verticalOffset}px`;
  container.style.bottom = 'auto';

  if (data === undefined) {
    // Loading state
    container.innerHTML = `
      <div class="playcount-box">
        <span class="playcount-loading">Loading player count...</span>
      </div>
    `;
  } else if (!data.success) {
    // No data / error
    container.innerHTML = `
      <div class="playcount-box">
        <div class="playcount-dot inactive"></div>
        <span class="playcount-label">${data.formatted}</span>
      </div>
    `;
  } else {
    // Success — show count
    const dotClass = getDotClass(data.count);
    container.innerHTML = `
      <div class="playcount-box">
        <div class="playcount-dot ${dotClass}"></div>
        <span class="playcount-count">${data.formatted}</span>
        <span class="playcount-label">Online</span>
      </div>
    `;
  }

  // Click opens SteamCharts
  container.addEventListener('click', () => {
    window.open(`steam://openurl_external/https://steamcharts.com/app/${appId}`);
  });

  return container;
}

export function getExistingBadge(doc: Document): HTMLElement | null {
  return doc.getElementById(CONTAINER_ID);
}

export function removeExistingBadge(doc: Document): void {
  doc.getElementById(CONTAINER_ID)?.remove();
}
