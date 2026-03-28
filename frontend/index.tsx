import { useState, useEffect } from 'react';
import { definePlugin, Millennium, IconsModule, ToggleField, SliderField } from '@steambrew/client';
import { log } from './services/logger';
import { initSettings, getSettings, saveSettings } from './services/settings';
import { setupObserver, disconnectObserver, cleanupAll, refreshDisplay } from './injection/observer';
import { removeExistingBadge } from './display/badge';
import { removeStyles } from './display/styles';

let currentDocument: Document | undefined;

const SettingsContent = () => {
  const [showBadge, setShowBadge] = useState(true);
  const [alignRight, setAlignRight] = useState(true);
  const [horizontalOffset, setHorizontalOffset] = useState(0);
  const [verticalOffset, setVerticalOffset] = useState(0);

  useEffect(() => {
    const settings = getSettings();
    setShowBadge(settings.showBadge);
    setAlignRight(settings.alignRight);
    setHorizontalOffset(settings.horizontalOffset);
    setVerticalOffset(settings.verticalOffset);
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

  const onHorizontalOffsetChange = (value: number) => {
    setHorizontalOffset(value);
    saveSettings({ ...getSettings(), horizontalOffset: value });
    if (currentDocument) refreshDisplay(currentDocument);
  };

  const onVerticalOffsetChange = (value: number) => {
    setVerticalOffset(value);
    saveSettings({ ...getSettings(), verticalOffset: value });
    if (currentDocument) refreshDisplay(currentDocument);
  };

  return (
    <>
      <ToggleField
        label="Show Player Count"
        description="Display live player count on game pages"
        checked={showBadge}
        onChange={onShowBadgeChange}
        bottomSeparator="standard"
      />
      <ToggleField
        label="Align to Right"
        description="Position badge on the right side"
        checked={alignRight}
        onChange={onAlignRightChange}
        bottomSeparator="standard"
      />
      <SliderField
        label="Horizontal Offset (px)"
        description="Distance from edge"
        value={horizontalOffset}
        min={-100}
        max={200}
        step={1}
        onChange={onHorizontalOffsetChange}
        showValue={true}
        bottomSeparator="standard"
      />
      <SliderField
        label="Vertical Offset (px)"
        description="Distance from top"
        value={verticalOffset}
        min={-100}
        max={200}
        step={1}
        onChange={onVerticalOffsetChange}
        showValue={true}
        bottomSeparator="standard"
      />
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
