
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PreviewPane } from './components/PreviewPane';
import { PropertiesInspector } from './components/ControlPanel';
import { ConfOutput } from './components/ConfOutput';
import { AIColorModal } from './components/AIColorModal';
import { parseConfig, serializeConfig } from './services/configParser';
import { StyleConfig, SelectedElement, InspectorWindowState } from './types';
import { INITIAL_CONF, OTHER_SETTINGS_ELEMENT } from './constants';
import { ResetIcon, HelpIcon, FileIcon, SettingsIcon, UploadIcon } from './components/icons';

interface Tooltip {
  visible: boolean;
  content: string;
  x: number;
  y: number;
}

const HeaderButton: React.FC<{ onClick: () => void, tooltip: string, children: React.ReactNode }> = ({ onClick, tooltip, children }) => (
  <div className="relative group">
    <button 
      onClick={onClick}
      className="bg-gray-700/80 hover:bg-gray-600/80 backdrop-blur-sm text-white p-2 rounded-full shadow-lg transition-colors">
      {children}
    </button>
    <div className="absolute top-full mt-2 right-1/2 translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
      {tooltip}
    </div>
  </div>
);

const App: React.FC = () => {
  const [rawConf, setRawConf] = useState<string>(INITIAL_CONF);
  const [config, setConfig] = useState<StyleConfig | null>(null);
  const [error, setError] = useState<string>('');
  
  const [inspectorWindows, setInspectorWindows] = useState<InspectorWindowState[]>([]);

  const [isConfModalOpen, setConfModalOpen] = useState(false);
  const [isHelpModalOpen, setHelpModalOpen] = useState(false);
  const [isResetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [isAiColorModalOpen, setIsAiColorModalOpen] = useState(false);

  const [tooltip, setTooltip] = useState<Tooltip>({ visible: false, content: '', x: 0, y: 0 });
  const [secretCode, setSecretCode] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const parsed = parseConfig(rawConf);
      setConfig(parsed);
      setError('');
    } catch (e) {
      if (e instanceof Error) {
        setError(`設定の解析エラー: ${e.message}`);
      } else {
        setError('不明な解析エラーが発生しました。');
      }
      setConfig(null);
    }
  }, [rawConf]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        const newSecretCode = (secretCode + e.key).slice(-7); // AICOLOR is 7 chars
        setSecretCode(newSecretCode);
        if (newSecretCode.toUpperCase() === 'AICOLOR') {
            setIsAiColorModalOpen(true);
            setSecretCode(''); // Reset code after activation
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [secretCode]);


  const handleConfigChange = useCallback((newConfig: StyleConfig) => {
    setConfig(newConfig);
    const newRawConf = serializeConfig(newConfig);
    setRawConf(newRawConf);
  }, []);

  const openInspector = useCallback((element: SelectedElement) => {
    if (inspectorWindows.some(win => win.element.key === element.key)) {
      // Find the window and bring it to the front
      const win = inspectorWindows.find(w => w.element.key === element.key);
      if(win) {
         setInspectorWindows(prev => [ ...prev.filter(w => w.id !== win.id), win]);
      }
      return;
    }
    const newWindow: InspectorWindowState = {
      id: Date.now(),
      element: element,
      position: {
        x: Math.max(10, window.innerWidth - 420 - (inspectorWindows.length % 5 * 30)),
        y: 60 + (inspectorWindows.length % 5 * 30),
      },
    };
    setInspectorWindows(prev => [...prev, newWindow]);
  }, [inspectorWindows]);

  const closeInspector = useCallback((id: number) => {
    setInspectorWindows(prev => prev.filter(win => win.id !== id));
  }, []);

  const moveInspector = useCallback((id: number, newPosition: { x: number; y: number }) => {
    setInspectorWindows(prev => 
      prev.map(win => (win.id === id ? { ...win, position: newPosition } : win))
    );
  }, []);
  
  const handleResetClick = () => {
    setResetConfirmOpen(true);
  };
  
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result;
            if (typeof text === 'string') {
                setRawConf(text);
                setInspectorWindows([]); // Close all inspectors on new import
            }
        };
        reader.readAsText(file);
    }
    // Reset file input value to allow re-uploading the same file
    event.target.value = '';
  };

  const confirmReset = () => {
    setRawConf(INITIAL_CONF);
    setInspectorWindows([]);
    setResetConfirmOpen(false);
  };
  
  const handleAiThemeUpdate = (newColors: Record<string, string>) => {
    if (!config) return;

    const newConfig = JSON.parse(JSON.stringify(config));
    
    for (const key in newColors) {
        if (newConfig.Color.hasOwnProperty(key)) {
            let colorValue = newColors[key].replace('#', '');
            
            // Handle specific keys that are gradients
            const gradientKeys = [
              'ObjectVideo', 'ObjectAudio', 'ObjectControl', 
              'ObjectVideoFilter', 'ObjectAudioFilter', 'FooterProgress'
            ];
            
            if (gradientKeys.includes(key)) {
                newConfig.Color[key] = `${colorValue},${colorValue}`;
            } else {
                newConfig.Color[key] = colorValue;
            }
        }
    }
    
    setConfig(newConfig);
    setRawConf(serializeConfig(newConfig));
    setIsAiColorModalOpen(false);
  };

  const showTooltip = useCallback((content: string, e: React.MouseEvent) => {
    setTooltip({ visible: true, content, x: e.clientX, y: e.clientY });
  }, []);

  const hideTooltip = useCallback(() => {
    setTooltip(prev => ({ ...prev, visible: false }));
  }, []);

  return (
    <main className="relative h-screen bg-[#111] text-white font-sans overflow-hidden">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".conf,.txt" className="hidden" />
      <div className="absolute top-4 right-4 z-40 flex gap-3">
        <HeaderButton onClick={() => setHelpModalOpen(true)} tooltip="ヘルプ">
          <HelpIcon className="w-6 h-6" />
        </HeaderButton>
        <HeaderButton onClick={handleImportClick} tooltip="インポート">
            <UploadIcon className="w-6 h-6" />
        </HeaderButton>
        <HeaderButton onClick={() => openInspector(OTHER_SETTINGS_ELEMENT)} tooltip="その他の設定">
           <SettingsIcon className="w-6 h-6" />
        </HeaderButton>
        <HeaderButton onClick={handleResetClick} tooltip="初期設定にリセット">
          <ResetIcon className="w-6 h-6" />
        </HeaderButton>
        <HeaderButton onClick={() => setConfModalOpen(true)} tooltip="style.conf を表示">
          <FileIcon className="w-6 h-6" />
        </HeaderButton>
      </div>

      <div className="w-full h-full flex items-center justify-center p-8">
        {config ? (
          <div className="w-full h-full max-w-full max-h-full aspect-video drop-shadow-2xl">
             <PreviewPane 
                config={config} 
                onSelectElement={openInspector}
                selectedElementKeys={inspectorWindows.map(win => win.element.key)}
                onShowTooltip={showTooltip}
                onHideTooltip={hideTooltip}
             />
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl">プレビューを読み込み中...</h2>
            <p className="text-red-500 mt-2">{error || '設定を読み込めませんでした。'}</p>
          </div>
        )}
      </div>

      {config && inspectorWindows.map(win => (
        <PropertiesInspector 
          key={win.id}
          id={win.id}
          element={win.element}
          position={win.position}
          onClose={closeInspector}
          onMove={moveInspector}
          config={config}
          onConfigChange={handleConfigChange}
        />
      ))}

      {tooltip.visible && (
        <div className="custom-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
          {tooltip.content}
        </div>
      )}
      
      {isConfModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-[#2a2a2a] rounded-lg shadow-xl w-full max-w-2xl relative">
            <button onClick={() => setConfModalOpen(false)} className="absolute top-2 right-2 text-white text-2xl hover:text-gray-400">&times;</button>
            <ConfOutput rawConf={rawConf} />
          </div>
        </div>
      )}

      {isAiColorModalOpen && (
        <AIColorModal 
          onClose={() => setIsAiColorModalOpen(false)}
          onThemeUpdate={handleAiThemeUpdate}
        />
      )}

      {isHelpModalOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-[#2a2a2a] rounded-lg shadow-xl w-full max-w-md relative p-8 text-center">
            <button onClick={() => setHelpModalOpen(false)} className="absolute top-2 right-2 text-white text-2xl hover:text-gray-400">&times;</button>
            <HelpIcon className="w-16 h-16 mx-auto text-blue-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">使い方</h2>
            <p className="text-gray-300">
              プレビュー内の要素にカーソルを合わせると、その要素の名前が表示されます。
              <br/>
              <strong className="text-blue-400">要素をクリック</strong>するとプロパティインスペクタが開き、リアルタイムでスタイルを編集できます。
            </p>
          </div>
        </div>
      )}

      {isResetConfirmOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-[#2a2a2a] rounded-lg shadow-xl w-full max-w-md relative p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">設定をリセット</h2>
            <p className="text-gray-300 mb-6">
              すべての変更を破棄して、初期設定に戻しますか？
              <br/>
              この操作は取り消せません。
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setResetConfirmOpen(false)} className="px-6 py-2 rounded-md bg-gray-600 hover:bg-gray-500 text-white font-semibold transition-colors">
                いいえ
              </button>
              <button onClick={confirmReset} className="px-6 py-2 rounded-md bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors">
                はい、リセットします
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default App;
