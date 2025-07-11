
import { StyleConfig } from '../types';

export const parseConfig = (text: string): StyleConfig => {
  const lines = text.split(/[\r\n]+/);
  const config: StyleConfig = {
    Font: {},
    Color: {},
    Layout: {},
    Format: {},
  };

  let currentSection: keyof StyleConfig | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith(';') || !trimmedLine) {
      continue;
    }

    if (trimmedLine.startsWith('[') && trimmedLine.endsWith(']')) {
      const sectionName = trimmedLine.substring(1, trimmedLine.length - 1);
      if (sectionName in config) {
        currentSection = sectionName as keyof StyleConfig;
      } else {
        currentSection = null;
      }
      continue;
    }

    if (currentSection) {
      const parts = trimmedLine.split('=');
      if (parts.length === 2) {
        const key = parts[0].trim();
        const value = parts[1].trim();
        config[currentSection][key] = value;
      }
    }
  }

  return config;
};

export const serializeConfig = (config: StyleConfig): string => {
  let output = '';
  // This is a simplified serializer; it doesn't preserve comments or original order.
  for (const sectionName in config) {
    output += `[${sectionName}]\n`;
    const section = config[sectionName as keyof StyleConfig];
    for (const key in section) {
      output += `${key}=${section[key]}\n`;
    }
    output += '\n';
  }
  return output.trim();
};

export const toCssColor = (hex?: string): string => {
  if (!hex) return 'transparent';
  
  const parts = hex.split(',');
  if (parts.length > 1) {
    const from = `#${parts[0].slice(0, 6)}`;
    const to = `#${parts[1].slice(0, 6)}`;
    return `linear-gradient(to right, ${from}, ${to})`;
  }
  
  const singleHex = parts[0];
  if (singleHex.length === 8) { // RRGGBBAA
    const r = parseInt(singleHex.substring(0, 2), 16);
    const g = parseInt(singleHex.substring(2, 4), 16);
    const b = parseInt(singleHex.substring(4, 6), 16);
    const a = parseInt(singleHex.substring(6, 8), 16) / 255;
    return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
  }
  
  return `#${singleHex}`;
};

export const toCssFont = (fontStr?: string): React.CSSProperties => {
    if (!fontStr) return {};
    const parts = fontStr.split(',');
    const size = parts[0];
    const family = parts.length > 1 ? parts.slice(1).join(',') : 'inherit';
    return {
        fontSize: `${size}px`,
        fontFamily: family
    };
};
