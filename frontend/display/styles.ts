const PLAYCOUNT_STYLES = `
#playcount-badge {
  position: absolute;
  z-index: 100;
  width: fit-content;
}

.playcount-box {
  background: rgba(14, 20, 27, 0.85);
  padding: 6px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
  border-radius: 4px;
}

.playcount-box:hover {
  background: rgba(14, 20, 27, 0.95);
}

.playcount-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4CAF50;
  box-shadow: 0 0 4px rgba(76, 175, 80, 0.6);
  flex-shrink: 0;
}

.playcount-dot.high    { background: #e80e0e; box-shadow: 0 0 4px rgba(232, 14, 14, 0.6); }
.playcount-dot.medium  { background: #CFB53B; box-shadow: 0 0 4px rgba(207, 181, 59, 0.6); }
.playcount-dot.low     { background: #A6A6A6; box-shadow: 0 0 4px rgba(166, 166, 166, 0.4); }
.playcount-dot.default { background: #4B9EEA; box-shadow: 0 0 4px rgba(75, 158, 234, 0.6); }
.playcount-dot.inactive { background: #686868; box-shadow: none; }

.playcount-count {
  color: #ffffff;
  font-size: 13px;
  font-weight: bold;
  margin: 0;
}

.playcount-label {
  color: #ffffff;
  font-size: 10px;
  text-transform: uppercase;
  opacity: 0.7;
  margin: 0;
}

.playcount-loading {
  color: #8f98a0;
  font-size: 11px;
  margin: 0;
}
`;

const STYLE_ID = 'playcount-styles';

export function injectStyles(doc: Document): void {
  if (doc.getElementById(STYLE_ID)) return;

  const style = doc.createElement('style');
  style.id = STYLE_ID;
  style.textContent = PLAYCOUNT_STYLES;
  doc.head.appendChild(style);
}

export function removeStyles(doc: Document): void {
  doc.getElementById(STYLE_ID)?.remove();
}
