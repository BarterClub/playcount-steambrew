import { useState, useEffect } from 'react';
import { definePlugin, Millennium, IconsModule, Field, DialogButton } from '@steambrew/client';
import { log } from './services/logger';
import { initSettings, getSettings, saveSettings } from './services/settings';
import { setupObserver, disconnectObserver, cleanupAll, refreshDisplay } from './injection/observer';
import { removeExistingBadge } from './display/badge';
import { removeStyles } from './display/styles';

let currentDocument: Document | undefined;

const SettingsContent = () => {
  const [showBadge, setShowBadge] = useState(true);
  const [alignRight, setAlignRight] = useState(true);
  const [horizontalOffset, setHorizontalOffset] = useState('0');
  const [verticalOffset, setVerticalOffset] = useState('0');

  useEffect(() => {
    const settings = getSettings();
    setShowBadge(settings.showBadge);
    setAlignRight(settings.alignRight);
    setHorizontalOffset(String(settings.horizontalOffset));
    setVerticalOffset(String(settings.verticalOffset));
  }, []);

  const onShowBadgeChange = (checked: boolean) => {
    setShowBadge(checked);
    saveSettings({ ...getSettings(), showBadge: checked });
    if (currentDocument) refreshDisplay(currentDocument);
  };

  const onAlignRightChange = (checked: boolean) => {
    setAlignRight(checked);
    saveSettings({ ...getSettings(), alignRight: checked });
    if (currentDocument) refreshDisplay(currentDocument);
  };

  const onHorizontalOffsetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHorizontalOffset(value);
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      saveSettings({ ...getSettings(), horizontalOffset: num });
      if (currentDocument) refreshDisplay(currentDocument);
    }
  };

  const onVerticalOffsetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setVerticalOffset(value);
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      saveSettings({ ...getSettings(), verticalOffset: num });
      if (currentDocument) refreshDisplay(currentDocument);
    }
  };

  return (
    <>
      <Field label="Show Player Count" description="Display live player count on game pages" bottomSeparator="standard">
        <input
          type="checkbox"
          checked={showBadge}
          onChange={(e) => onShowBadgeChange(e.target.checked)}
          style={{ width: '20px', height: '20px' }}
        />
      </Field>
      <Field label="Align to Right" description="Position badge on the right side" bottomSeparator="standard">
        <input
          type="checkbox"
          checked={alignRight}
          onChange={(e) => onAlignRightChange(e.target.checked)}
          style={{ width: '20px', height: '20px' }}
        />
      </Field>
      <Field label="Horizontal Offset (px)" description="Distance from edge" bottomSeparator="standard">
        <input
          type="number"
          value={horizontalOffset}
          onChange={onHorizontalOffsetChange}
          style={{ width: '60px', padding: '4px 8px' }}
        />
      </Field>
      <Field label="Vertical Offset (px)" description="Distance from top" bottomSeparator="standard">
        <input
          type="number"
          value={verticalOffset}
          onChange={onVerticalOffsetChange}
          style={{ width: '60px', padding: '4px 8px' }}
        />
      </Field>
      <div style={{ fontSize: '11px', color: '#8f98a0', padding: '8px 0' }}>
        Click the badge to open SteamCharts for that game.
      </div>
    </>
  );
};

export default definePlugin(() => {
  log('Player Count plugin loading...');

  initSettings();

  Millennium.AddWindowCreateHook?.((context: any) => {
    if (!context.m_strName?.startsWith('SP ')) return;

    const doc = context.m_popup?.document;
    if (!doc?.body) return;

    log('Window created:', context.m_strName);

    // Clean up previous document if switching
    if (currentDocument && currentDocument !== doc) {
      cleanupAll(currentDocument);
    }

    currentDocument = doc;
    setupObserver(doc);
  });

  return {
    title: 'Player Count',
    icon: <IconsModule.Settings />,
    content: <SettingsContent />,
  };
});
