import { callable } from '@steambrew/client';
import { log, logError } from './logger';

interface SteamPlayerResponse {
  response: {
    player_count: number;
    result: number;
  };
}

export interface PlayerCountResult {
  success: boolean;
  count: number;
  formatted: string;
}

const FetchPlayerCountRpc = callable<[{ app_id: string }], string>('fetch_player_count');

export async function fetchPlayerCount(appId: number): Promise<PlayerCountResult> {
  try {
    const responseText = await FetchPlayerCountRpc({ app_id: String(appId) });
    const data: SteamPlayerResponse = JSON.parse(responseText);

    if (data.response.result === 1) {
      const count = data.response.player_count;
      return {
        success: true,
        count,
        formatted: count.toLocaleString('en-US'),
      };
    }

    return { success: false, count: 0, formatted: 'No data' };
  } catch (e) {
    logError('Failed to fetch player count:', e);
    return { success: false, count: 0, formatted: 'Error' };
  }
}
