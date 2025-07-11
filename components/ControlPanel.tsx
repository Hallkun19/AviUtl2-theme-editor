
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleConfig, SelectedElement } from '../types';
import { KEY_METADATA } from './controlPanelConfig';
import { CopyIcon, PaintBrushIcon, RulerIcon, FontIcon } from './icons';

interface PropertiesInspectorProps {
  id: number;
  element: SelectedElement;
  position: { x: number; y: number };
  onClose: (id: number) => void;
  onMove: (id: number, position: { x: number; y: number }) => void;
  config: StyleConfig;
  onConfigChange: (newConfig: StyleConfig) => void;
}

const getSectionAndKey = (fullKey: string): [keyof StyleConfig, string] | [null, null] => {
    const parts = fullKey.split('.');
    if (parts.length === 2) {
        return [parts[0] as keyof StyleConfig, parts[1]];
    }
    return [null, null];
}

const ControlWrapper: React.FC<{ label: string; icon: React.ReactNode; children: React.ReactNode; onCopy: () => void; }> = ({ label, icon, children, onCopy }) => (
    <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
              {icon}
              <label className="text-sm text-gray-300 block truncate" title={label}>{label}</label>
            </div>
            <button onClick={onCopy} className="text-gray-500 hover:text-white transition-colors p-1 rounded-md">
                <CopyIcon className="w-4 h-4" />
            </button>
        </div>
        {children}
    </div>
);

const ColorControl: React.FC<{ value: string; onChange: (newValue: string) => void; }> = ({ value, onChange }) => {
  const colorParts = value.split(',').map(s => s.trim()).filter(Boolean);
  const isGradient = colorParts.length === 2;

  const handleColorChange = (index: number, newColor: string) => {
    const newHex = newColor.substring(1);
    const newParts = [...colorParts];
    
    // Ensure array has enough elements
    while (newParts.length <= index) {
        newParts.push('');
    }

    newParts[index] = newHex;
    onChange(newParts.join(','));
  };
  
  const handleSingleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value.substring(1));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {isGradient ? (
          <>
            <input
              type="color"
              value={`#${colorParts[0].slice(0, 6)}`}
              onChange={(e) => handleColorChange(0, e.target.value)}
              className="w-8 h-8 p-0 border-none rounded-md cursor-pointer flex-shrink-0 appearance-none"
              style={{ backgroundColor: `#${colorParts[0].slice(0, 6)}` }}
            />
            <span className="text-gray-500 font-mono">→</span>
            <input
              type="color"
              value={`#${colorParts[1].slice(0, 6)}`}
              onChange={(e) => handleColorChange(1, e.target.value)}
              className="w-8 h-8 p-0 border-none rounded-md cursor-pointer flex-shrink-0 appearance-none"
              style={{ backgroundColor: `#${colorParts[1].slice(0, 6)}` }}
            />
          </>
        ) : (
          <input
            type="color"
            value={`#${value.slice(0, 6)}`}
            onChange={handleSingleColorChange}
            className="w-8 h-8 p-0 border-none rounded-md cursor-pointer flex-shrink-0 appearance-none"
            style={{ backgroundColor: `#${value.slice(0, 6)}` }}
          />
        )}
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-2 text-sm bg-[#1e1e1e] border border-gray-600 rounded font-mono focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
        />
      </div>
    </div>
  );
};

const TextControl: React.FC<{ value: string; onChange: (newValue: string) => void; }> = ({ value, onChange }) => (
  <input
    type="text"
    value={value}
    onChange={e => onChange(e.target.value)}
    className="w-full p-2 text-sm bg-[#1e1e1e] border border-gray-600 rounded focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
  />
);

const NumberControl: React.FC<{ label: string; value: string; onChange: (newValue: string) => void; }> = ({ label, value, onChange }) => {
    const numValue = parseInt(value, 10) || 0;
    
    let max = 100;
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('width') || lowerLabel.includes('height') || lowerLabel.includes('幅') || lowerLabel.includes('高さ')) {
        max = 500;
    } else if (lowerLabel.includes('size') || lowerLabel.includes('サイズ')) {
         max = 48;
    } else if (lowerLabel.includes('font') && !lowerLabel.includes('family') || lowerLabel.includes('フォント')) {
        max = 72;
    } else if (lowerLabel.includes('num')){ // ExplorerWindowNum
        max = 10;
    }

    return (
        <div className="flex items-center gap-2">
            <input
                type="number"
                value={numValue}
                onChange={e => onChange(e.target.value)}
                className="w-20 p-2 text-sm bg-[#1e1e1e] border border-gray-600 rounded focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
            />
            <input
                type="range"
                min="0"
                max={max}
                value={numValue}
                onChange={e => onChange(e.target.value)}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
        </div>
    );
};


export const PropertiesInspector: React.FC<PropertiesInspectorProps> = ({ id, element, position, onClose, onMove, config, onConfigChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!windowRef.current || (e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    const rect = windowRef.current.getBoundingClientRect();
    dragStartPos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !windowRef.current) return;
    let newX = e.clientX - dragStartPos.current.x;
    let newY = e.clientY - dragStartPos.current.y;

    // Constrain to viewport
    newX = Math.max(0, Math.min(newX, window.innerWidth - windowRef.current.offsetWidth));
    newY = Math.max(0, Math.min(newY, window.innerHeight - windowRef.current.offsetHeight));

    onMove(id, { x: newX, y: newY });
  }, [isDragging, id, onMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);
  
  const handleChange = (fullKey: string, newValue: string) => {
    const [section, key] = getSectionAndKey(fullKey);
    if (!section || !key) return;

    const newConfig = JSON.parse(JSON.stringify(config));
    newConfig[section][key] = newValue;
    onConfigChange(newConfig);
  };
  
  const renderControl = (fullKey: string) => {
      const [section, key] = getSectionAndKey(fullKey);
      if (!section || !key) return null;
      
      const value = config[section][key];
      if (value === undefined) return null;

      const metadata = KEY_METADATA[fullKey] || { label: fullKey, category: 'その他' };
      
      let control, icon;
      if (section === 'Color') {
          control = <ColorControl value={value} onChange={newValue => handleChange(fullKey, newValue)} />;
          icon = <PaintBrushIcon className="w-5 h-5 text-pink-400" />
      } else if (section === 'Layout' || (section === 'Font' && !key.includes('Family'))) {
           if (!isNaN(parseInt(value, 10))) {
              control = <NumberControl label={metadata.label} value={value} onChange={newValue => handleChange(fullKey, newValue)} />;
              icon = <RulerIcon className="w-5 h-5 text-sky-400" />;
           } else {
              control = <TextControl value={value} onChange={newValue => handleChange(fullKey, newValue)} />;
              icon = <FontIcon className="w-5 h-5 text-green-400" />;
           }
      } else {
          control = <TextControl value={value} onChange={newValue => handleChange(fullKey, newValue)} />;
          icon = <FontIcon className="w-5 h-5 text-green-400" />;
      }
      
      return (
        <ControlWrapper 
            key={fullKey} 
            label={metadata.label}
            icon={icon}
            onCopy={() => navigator.clipboard.writeText(value)}
        >
            {control}
        </ControlWrapper>
      );
  };
  
  if (!element) {
    return null;
  }
  
  const groupedKeys = element.keys.reduce((acc, key) => {
      const category = KEY_METADATA[key]?.category || 'その他';
      if (!acc[category]) {
          acc[category] = [];
      }
      acc[category].push(key);
      return acc;
  }, {} as Record<string, string[]>);

  const categoryOrder = ['外観', 'サイズと間隔', 'フォント', 'その他'];
  const sortedCategories = Object.keys(groupedKeys).sort((a, b) => {
      return (categoryOrder.indexOf(a) === -1 ? 99 : categoryOrder.indexOf(a)) - (categoryOrder.indexOf(b) === -1 ? 99 : categoryOrder.indexOf(b));
  });

  return (
    <div 
        ref={windowRef}
        className="fixed w-[380px] bg-[#1e1e2e]/90 backdrop-blur-md border border-[#585b70] shadow-2xl rounded-lg z-30 flex flex-col"
        style={{ top: position.y, left: position.x }}
    >
        <div 
            className="flex items-center justify-between p-2 pl-4 border-b border-[#585b70] cursor-grab active:cursor-grabbing flex-shrink-0"
            onMouseDown={handleMouseDown}
        >
            <h2 className="text-sm font-bold text-white truncate">{element.name || 'プロパティ'}</h2>
            <button onClick={() => onClose(id)} className="text-gray-400 hover:text-white text-xl p-1 rounded-md hover:bg-white/10 flex-shrink-0 z-10">&times;</button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-grow max-h-[70vh]">
            {sortedCategories.map(category => (
              <div key={category} className="mb-4">
                  <h3 className="text-xs font-bold uppercase text-gray-500 pb-2 mb-2 border-b border-gray-700">{category}</h3>
                  {groupedKeys[category].map(renderControl)}
              </div>
            ))}
        </div>
    </div>
  );
};
