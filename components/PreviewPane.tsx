import React from 'react';
import { StyleConfig, SelectedElement } from '../types';
import { toCssColor, toCssFont } from '../services/configParser';
import { 
    CheckIcon, PlusIcon, SettingsIcon, CameraIcon, EyeIcon, ListIcon, XIcon,
    FolderIcon, FolderOpenIcon, GenericFileIcon, SpeakerIcon, GearIcon, LockIcon,
    LeftArrowIcon, RightArrowIcon, UpArrowIcon, RewindIcon, PlayIcon, FastForwardIcon, ImageIcon
} from './icons';

interface PreviewPaneProps {
  config: StyleConfig;
  onSelectElement: (element: SelectedElement) => void;
  selectedElementKeys: string[];
  onShowTooltip: (content: string, e: React.MouseEvent) => void;
  onHideTooltip: () => void;
}

const getElementClasses = (key: string, selectedElementKeys: string[]) => {
    return `editable-element transition-all duration-100 ${selectedElementKeys.includes(key) ? 'selected-element' : ''}`;
};

const Panel: React.FC<{ title: React.ReactNode; friendlyTitle: string; config: StyleConfig; children: React.ReactNode; className?: string; onSelectElement: (element: SelectedElement) => void; selectedElementKeys: string[]; panelKey: string; headerKeys: string[]; noBorder?: boolean; onShowTooltip: (content: string, e: React.MouseEvent) => void; onHideTooltip: () => void; }> = 
({ title, friendlyTitle, config, children, className, onSelectElement, selectedElementKeys, panelKey, headerKeys, noBorder, onShowTooltip, onHideTooltip }) => (
  <div className={`flex flex-col h-full ${className}`} style={{ backgroundColor: toCssColor(config.Color.Background), color: toCssColor(config.Color.Text) }}>
    <div
      className={`p-1 px-2 text-sm flex-shrink-0 flex items-center ${getElementClasses(panelKey + '-header', selectedElementKeys)}`}
      style={{
        backgroundColor: toCssColor(config.Color.TitleHeader),
        height: `${config.Layout.TitleHeaderHeight}px`,
        ...toCssFont(config.Font.Control),
      }}
      onClick={(e) => { e.stopPropagation(); onSelectElement({ key: panelKey + '-header', name: `${friendlyTitle}ヘッダー`, keys: headerKeys })}}
      onMouseEnter={(e) => onShowTooltip(`${friendlyTitle}ヘッダー`, e)}
      onMouseLeave={onHideTooltip}
    >
      {title}
    </div>
    <div className={`flex-grow overflow-auto ${noBorder ? '' : 'border-t'}`} style={{ borderColor: toCssColor(config.Color.WindowBorder) }}>
      {children}
    </div>
  </div>
);

const FileExplorer: React.FC<{ config: StyleConfig; onSelectElement: (element: SelectedElement) => void; selectedElementKeys: string[]; onShowTooltip: (content: string, e: React.MouseEvent) => void; onHideTooltip: () => void; }> = ({ config, onSelectElement, selectedElementKeys, onShowTooltip, onHideTooltip }) => {
    const files = [
        { name: 'Project Files', icon: <FolderOpenIcon className="w-5 h-5" style={{color: '#e2b34a'}}/>, indent: 0},
        { name: 'Assets', icon: <FolderIcon className="w-5 h-5" style={{color: '#e2b34a'}}/>, indent: 1 },
        { name: 'Video Footage', icon: <FolderIcon className="w-5 h-5" style={{color: '#e2b34a'}}/>, indent: 1 },
        { name: 'Audio Clips', icon: <FolderIcon className="w-5 h-5" style={{color: '#e2b34a'}}/>, indent: 1 },
        { name: 'Images', icon: <FolderIcon className="w-5 h-5" style={{color: '#e2b34a'}}/>, indent: 1 },
        { name: 'Renders', icon: <FolderIcon className="w-5 h-5" style={{color: '#e2b34a'}}/>, indent: 0 },
        { name: 'Archived Projects', icon: <FolderIcon className="w-5 h-5" style={{color: '#e2b34a'}}/>, indent: 0 },
    ];

    return (
      <Panel title="ファイル" friendlyTitle="ファイルエクスプローラー" config={config} onSelectElement={onSelectElement} selectedElementKeys={selectedElementKeys} panelKey="file-explorer" headerKeys={['Color.TitleHeader', 'Layout.TitleHeaderHeight', 'Font.Control', 'Color.Text', 'Color.WindowBorder']} onShowTooltip={onShowTooltip} onHideTooltip={onHideTooltip}>
         <div 
            className={`p-1 space-y-0.5 ${getElementClasses('file-explorer-list', selectedElementKeys)}`} 
            onClick={(e) => { e.stopPropagation(); onSelectElement({ key: 'file-explorer-list', name: 'ファイルリスト', keys: ['Color.Grouping', 'Font.LayerObject', 'Color.Text'] }) }}
            onMouseEnter={(e) => onShowTooltip('ファイルリスト', e)}
            onMouseLeave={onHideTooltip}
        >
            <div className="flex justify-between items-center text-xs px-2 py-0.5" style={{...toCssFont(config.Font.Control)}}>
              <span>名前</span>
              <span>サイズ</span>
            </div>
            {files.map((file, i) => (
                <div key={i} className="flex items-center gap-2 px-2 py-0.5 rounded-sm" style={{...toCssFont(config.Font.LayerObject), paddingLeft: `${8 + file.indent * 16}px`}}>
                    {file.icon}<span>{file.name}</span>
                </div>
            ))}
        </div>
      </Panel>
    )
}

const SceneList: React.FC<{ config: StyleConfig; onSelectElement: (element: SelectedElement) => void; selectedElementKeys: string[]; onShowTooltip: (content: string, e: React.MouseEvent) => void; onHideTooltip: () => void; }> = ({ config, onSelectElement, selectedElementKeys, onShowTooltip, onHideTooltip }) => (
    <Panel title="シーンリスト" friendlyTitle="シーンリスト" config={config} onSelectElement={onSelectElement} selectedElementKeys={selectedElementKeys} panelKey="scene-list" headerKeys={['Color.TitleHeader', 'Layout.TitleHeaderHeight', 'Font.Control', 'Color.Text', 'Color.WindowBorder']} onShowTooltip={onShowTooltip} onHideTooltip={onHideTooltip}>
      <div 
        className={`p-1 h-full ${getElementClasses('scene-list-content', selectedElementKeys)}`}
        onClick={(e) => { onSelectElement({ key: 'scene-list-content', name: 'シーンリストの背景', keys: ['Color.Layer', 'Color.LayerHover', 'Layout.ListItemHeight'] })}}
        onMouseEnter={(e) => onShowTooltip('シーンリストの背景', e)}
        onMouseLeave={onHideTooltip}
      >
          <div 
              className={`p-1 px-2 rounded-sm cursor-pointer ${getElementClasses('scene-list-item-root', selectedElementKeys)}`}
              style={{ 
                  background: toCssColor(config.Color.GroupingSelect),
                  border: `1px solid ${toCssColor(config.Color.BorderSelect)}`,
                  ...toCssFont(config.Font.LayerObject),
                  color: toCssColor(config.Color.TextSelect),
              }}
              onClick={(e) => { e.stopPropagation(); onSelectElement({key: 'scene-list-item-root', name: 'シーンリストのアイテム (選択中)', keys:['Color.GroupingSelect', 'Color.BorderSelect', 'Font.LayerObject', 'Color.TextSelect']})}}
              onMouseEnter={(e) => onShowTooltip('選択中のシーン', e)}
              onMouseLeave={onHideTooltip}
          >
              Root
          </div>
      </div>
    </Panel>
);

const VideoPreview: React.FC<{ config: StyleConfig; onSelectElement: (element: SelectedElement) => void; selectedElementKeys: string[]; onShowTooltip: (content: string, e: React.MouseEvent) => void; onHideTooltip: () => void; }> = ({ config, onSelectElement, selectedElementKeys, onShowTooltip, onHideTooltip }) => {
    return (
        <div className={`relative flex-grow flex flex-col items-center justify-center h-full ${getElementClasses('video-preview-bg', selectedElementKeys)}`} style={{ backgroundColor: toCssColor(config.Color.OutsideDisplay) }} onClick={(e) => { e.stopPropagation(); onSelectElement({key: 'video-preview-bg', name: 'プレビュー背景', keys: ['Color.OutsideDisplay']})}} onMouseEnter={(e) => onShowTooltip('プレビュー背景', e)} onMouseLeave={onHideTooltip}>
            <div className="w-full h-full flex items-center justify-center p-4">
                <div className="w-full max-h-full aspect-video bg-black flex flex-col items-center justify-center relative">
                     <div 
                        className={`relative border p-2 ${getElementClasses('video-text-selection', selectedElementKeys)}`} 
                        style={{borderColor: toCssColor(config.Color.Anchor)}} 
                        onClick={(e) => { e.stopPropagation(); onSelectElement({key: 'video-text-selection', name: 'プレビューの選択範囲', keys: ['Color.Anchor', 'Color.AnchorHover', 'Color.AnchorEdge']})}}
                        onMouseEnter={(e) => onShowTooltip('選択オブジェクトのボックス', e)}
                        onMouseLeave={onHideTooltip}
                    >
                        <p className={`text-4xl`} style={{
                            fontFamily: "'Caveat', cursive",
                            color: '#ffffff',
                         }}
                         >Aviutl2 theme editor</p>
                        <div className="absolute -top-1 -left-1 w-2 h-2 border bg-white" style={{borderColor: toCssColor(config.Color.AnchorEdge)}}></div>
                        <div className="absolute -top-1 right-1/2 w-2 h-2 border bg-white" style={{borderColor: toCssColor(config.Color.AnchorEdge)}}></div>
                        <div className="absolute -top-1 -right-1 w-2 h-2 border bg-white" style={{borderColor: toCssColor(config.Color.AnchorEdge)}}></div>
                        <div className="absolute top-1/2 -left-1 w-2 h-2 border bg-white" style={{borderColor: toCssColor(config.Color.AnchorEdge)}}></div>
                        <div className="absolute top-1/2 -right-1 w-2 h-2 border bg-white" style={{borderColor: toCssColor(config.Color.AnchorEdge)}}></div>
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 border bg-white" style={{borderColor: toCssColor(config.Color.AnchorEdge)}}></div>
                        <div className="absolute -bottom-1 right-1/2 w-2 h-2 border bg-white" style={{borderColor: toCssColor(config.Color.AnchorEdge)}}></div>
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 border bg-white" style={{borderColor: toCssColor(config.Color.AnchorEdge)}}></div>
                     </div>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center px-2" style={{height: '40px', background: toCssColor(config.Color.LayerHeader), ...toCssFont(config.Font.PreviewTime)}}>
                <span>00:00:02.66</span>
                <div className="flex items-center gap-4">
                    <RewindIcon className="w-5 h-5" />
                    <PlayIcon className="w-7 h-7" />
                    <FastForwardIcon className="w-5 h-5" />
                </div>
                <span>/ 00:05.33</span>
            </div>
        </div>
    );
};

const PropertiesPanel: React.FC<{ config: StyleConfig; onSelectElement: (element: SelectedElement) => void; selectedElementKeys: string[]; onShowTooltip: (content: string, e: React.MouseEvent) => void; onHideTooltip: () => void; }> = ({ config, onSelectElement, selectedElementKeys, onShowTooltip, onHideTooltip }) => {
    const properties = [
        { label: '拡大率', value: '100.000' }, { label: '縦横比', value: '0.000' },
        { label: '透明度', value: '0.000' },
        { label: '合成モード', value: '通常', type: 'select' },
        { label: 'サイズ', value: '176.00' }, { label: '字間', value: '0.00' }, { label: '行間', value: '0.00' },
        { label: '表示速度', value: '0.00' },
        { label: 'フォント', value: '851手書き雑フォント', type: 'select' },
    ];
    
    const headerContent = (
      <div className="flex items-center justify-between w-full">
        <span>テキスト [標準描画]</span>
        <div className="flex items-center gap-1.5" style={{color: toCssColor(config.Color.Text)}}>
          <SettingsIcon className="w-4 h-4" />
          <CameraIcon className="w-4 h-4" />
          <EyeIcon className="w-4 h-4" />
          <CheckIcon className="w-4 h-4" />
        </div>
      </div>
    );
    return (
        <Panel title={headerContent} friendlyTitle="プロパティパネル" config={config} onSelectElement={onSelectElement} selectedElementKeys={selectedElementKeys} panelKey="properties-panel" headerKeys={['Color.LayerHeader', 'Layout.SettingHeaderHeight', 'Font.Control', 'Color.Text']} noBorder={true} onShowTooltip={onShowTooltip} onHideTooltip={onHideTooltip}>
            <div className={`flex-grow p-1 space-y-0.5 overflow-y-auto ${getElementClasses('properties-panel-content', selectedElementKeys)}`} onClick={(e) => { e.stopPropagation(); onSelectElement({key: 'properties-panel-content', name: 'プロパティ設定項目', keys:['Color.ButtonBody', 'Color.Border', 'Layout.SettingItemHeight', 'Layout.SettingItemHeaderWidth', 'Font.Control', 'Font.EditControl', 'Color.Text', 'Color.TextDisable', 'Color.TrackBarRange']})}} onMouseEnter={(e) => onShowTooltip('プロパティ設定項目', e)} onMouseLeave={onHideTooltip}>
                {properties.map(({ label, value }, i) => (
                    <div key={i} className="flex items-center" style={{ height: `${config.Layout.SettingItemHeight}px` }}>
                        <div className="text-xs px-1" style={{ width: `${config.Layout.SettingItemHeaderWidth}px`, ...toCssFont(config.Font.Control) }}>{label}</div>
                        <div className="flex-grow flex items-center mr-2">
                           <input type="text" value={value} readOnly className="w-full p-0.5 text-xs rounded-sm" style={{ backgroundColor: toCssColor(config.Color.Background), border: `1px solid ${toCssColor(config.Color.Border)}`, ...toCssFont(config.Font.EditControl) }} />
                        </div>
                    </div>
                ))}
                {/* Custom color controls */}
                <div className="flex items-center" style={{ height: `${config.Layout.SettingItemHeight}px` }}>
                    <div className="text-xs px-1" style={{ width: `${config.Layout.SettingItemHeaderWidth}px`, ...toCssFont(config.Font.Control) }}>文字色</div>
                    <div className="flex-grow flex items-center gap-1 mr-2">
                      <div className="w-8 h-full rounded-sm" style={{backgroundColor: '#ffffff'}}></div>
                      <input readOnly value="255,255,255" className="w-full p-0.5 text-xs rounded-sm" style={{ backgroundColor: toCssColor(config.Color.Background), border: `1px solid ${toCssColor(config.Color.Border)}`, ...toCssFont(config.Font.EditControl) }} />
                    </div>
                </div>
                <div className="flex items-center" style={{ height: `${config.Layout.SettingItemHeight}px` }}>
                    <div className="text-xs px-1" style={{ width: `${config.Layout.SettingItemHeaderWidth}px`, ...toCssFont(config.Font.Control) }}>影・縁色</div>
                     <div className="flex-grow flex items-center gap-1 mr-2">
                      <div className="w-8 h-full rounded-sm" style={{backgroundColor: '#000000'}}></div>
                      <input readOnly value="0,0,0" className="w-full p-0.5 text-xs rounded-sm" style={{ backgroundColor: toCssColor(config.Color.Background), border: `1px solid ${toCssColor(config.Color.Border)}`, ...toCssFont(config.Font.EditControl) }} />
                    </div>
                </div>
                {/* Standard text */}
                <div className="flex items-center" style={{ height: `${config.Layout.SettingItemHeight}px` }}>
                    <div className="text-xs px-1" style={{ width: `${config.Layout.SettingItemHeaderWidth}px`, ...toCssFont(config.Font.Control) }}>標準文字</div>
                    <div className="flex-grow flex items-center justify-between mr-2">
                      <input readOnly value="Aviutl2 theme editor" className="w-2/3 p-0.5 text-xs rounded-sm" style={{ backgroundColor: toCssColor(config.Color.Background), border: `1px solid ${toCssColor(config.Color.Border)}`, ...toCssFont(config.Font.EditControl) }} />
                      <div className="p-1 px-2 rounded-sm" style={{backgroundColor: toCssColor(config.Color.GroupingSelect)}}>中央揃え[中]</div>
                      <div className="flex">
                         <div className="p-1" style={{border: `1px solid ${toCssColor(config.Color.Border)}`}}>B</div>
                         <div className="p-1" style={{border: `1px solid ${toCssColor(config.Color.Border)}`}}>I</div>
                      </div>
                    </div>
                </div>
                 <div className="pt-2 space-y-1">
                    <div className="flex items-center gap-2"><input type="checkbox"/><span>文字毎に個別オブジェクト</span></div>
                    <div className="flex items-center gap-2"><input type="checkbox"/><span>オブジェクトの長さを自動調節</span></div>
                </div>
            </div>
        </Panel>
    );
};

const ObjectList: React.FC<{ config: StyleConfig; onSelectElement: (element: SelectedElement) => void; selectedElementKeys: string[]; onShowTooltip: (content: string, e: React.MouseEvent) => void; onHideTooltip: () => void; }> = ({ config, onSelectElement, selectedElementKeys, onShowTooltip, onHideTooltip }) => {
    const items = [
        { icon: <ImageIcon className="w-5 h-5" />, name: '動画ファイル' },
        { icon: <SpeakerIcon className="w-5 h-5" />, name: '音声ファイル' },
        { icon: <GearIcon className="w-5 h-5" />, name: '部分フィルタ' },
        { icon: <SettingsIcon className="w-5 h-5" />, name: '色調補正', selected: false },
        { icon: <GearIcon className="w-5 h-5" />, name: '音量フェード', selected: false },
    ];
    return (
        <Panel title="オブジェクトリスト" friendlyTitle="オブジェクトリスト" config={config} onSelectElement={onSelectElement} selectedElementKeys={selectedElementKeys} panelKey="object-list" headerKeys={['Color.TitleHeader', 'Layout.TitleHeaderHeight', 'Font.Control', 'Color.Text', 'Color.WindowBorder']} onShowTooltip={onShowTooltip} onHideTooltip={onHideTooltip}>
            <div 
                className={`p-1 space-y-0.5 ${getElementClasses('object-list-wrapper', selectedElementKeys)}`} 
                onClick={(e) => { e.stopPropagation(); onSelectElement({key: 'object-list-wrapper', name: 'オブジェクトリスト', keys:['Color.Grouping', 'Color.GroupingSelect', 'Color.BorderSelect', 'Font.LayerObject', 'Color.Text', 'Color.ButtonBody']})}}
                onMouseEnter={(e) => onShowTooltip('オブジェクトリスト', e)}
                onMouseLeave={onHideTooltip}
            >
                {items.map((item, i) => (
                    <div key={i} style={{ 
                        ...toCssFont(config.Font.LayerObject) 
                        }} className="p-1 rounded-sm flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-5 text-center">{item.icon}</span>
                            <span>{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <LockIcon className="w-4 h-4" />
                            <CheckIcon className="w-4 h-4" />
                        </div>
                    </div>
                ))}
            </div>
        </Panel>
    )
};

const Timeline: React.FC<{ config: StyleConfig; onSelectElement: (element: SelectedElement) => void; selectedElementKeys: string[]; onShowTooltip: (content: string, e: React.MouseEvent) => void; onHideTooltip: () => void; }> = ({ config, onSelectElement, selectedElementKeys, onShowTooltip, onHideTooltip }) => {
    const layerHeight = parseInt(config.Layout.LayerHeight, 10);
    const layerHeaderWidth = parseInt(config.Layout.LayerHeaderWidth, 10);
    const layers = Array.from({ length: 28 }, (_, i) => `Layer${i + 1}`);

    const timelineObjects = [
      { key: 'timeline-obj-video', name: 'タイムラインオブジェクト (映像)', top: 1, left: '10%', width: '40%', text: '動画ファイル', colorKey: 'ObjectVideo', selectColorKey: 'BorderFocus', fontKeys: ['Font.LayerObject'] },
      { key: 'timeline-obj-audio', name: 'タイムラインオブジェクト (音声)', top: 2, left: '10%', width: '40%', text: '音声ファイル', colorKey: 'ObjectAudio', selectColorKey: 'BorderFocus', fontKeys: ['Font.LayerObject'] },
      { key: 'timeline-obj-vfilter', name: 'タイムラインオブジェクト (映像フィルタ)', top: 3, left: '10%', width: '40%', text: '部分フィルタ', colorKey: 'ObjectVideoFilter', selectColorKey: 'BorderFocus', fontKeys: ['Font.LayerObject'] },
      { key: 'timeline-obj-control', name: 'タイムラインオブジェクト (制御)', top: 4, left: '10%', width: '40%', text: '色調補正', colorKey: 'ObjectControl', selectColorKey: 'BorderFocus', fontKeys: ['Font.LayerObject'] },
      { key: 'timeline-obj-afilter', name: 'タイムラインオブジェクト (音声フィルタ)', top: 5, left: '10%', width: '40%', text: '音量フェード', colorKey: 'ObjectAudioFilter', selectColorKey: 'BorderFocus', fontKeys: ['Font.LayerObject'] },
      { key: 'timeline-obj-text', name: 'タイムラインオブジェクト (テキスト)', top: 6, left: '10%', width: '40%', text: 'Aviutl2 theme editor', colorKey: 'ObjectVideo', selectColorKey: 'BorderFocus', fontKeys: ['Font.LayerObject'] },
    ];

    return (
        <Panel title="Root" friendlyTitle="タイムライン" config={config} onSelectElement={onSelectElement} selectedElementKeys={selectedElementKeys} panelKey="timeline" headerKeys={['Color.TitleHeader', 'Layout.TitleHeaderHeight', 'Font.Control', 'Color.Text', 'Color.WindowBorder']} onShowTooltip={onShowTooltip} onHideTooltip={onHideTooltip}>
            <div className="flex flex-col h-full text-sm">
                <div className={`flex-shrink-0 flex items-center ${getElementClasses('timeline-header', selectedElementKeys)}`} style={{ height: `${config.Layout.TimeGaugeHeight}px`, background: toCssColor(config.Color.LayerHeader) }} onClick={(e) => { e.stopPropagation(); onSelectElement({key: 'timeline-header', name: 'タイムラインヘッダー', keys:['Color.LayerHeader', 'Layout.TimeGaugeHeight', 'Font.TimeGauge', 'Color.PlayerCursor', 'Color.Text']})}} onMouseEnter={(e) => onShowTooltip('タイムラインヘッダー', e)} onMouseLeave={onHideTooltip}>
                    <div className="flex-shrink-0" style={{ width: `${layerHeaderWidth}px` }}></div>
                    <div className="flex-grow relative h-full">
                        <div className="absolute inset-0 w-full flex justify-between items-end pointer-events-none" style={{...toCssFont(config.Font.TimeGauge)}}>
                            {Array.from({length: 8}).map((_, i) => (
                               <div key={i} className="flex flex-col items-center">
                                   <span>00:00:0{i}.00</span>
                                   <div className="h-2 border-l" style={{borderColor: toCssColor(config.Color.TextDisable)}}></div>
                               </div>
                            ))}
                        </div>
                        <div className="playhead-pulse absolute h-full top-0" style={{ left: '50%', borderLeft: `2px solid ${toCssColor(config.Color.PlayerCursor)}` }}></div>
                    </div>
                </div>
                <div className={`flex-grow flex overflow-y-scroll ${getElementClasses('timeline-body', selectedElementKeys)}`} onClick={(e) => { e.stopPropagation(); onSelectElement({key: 'timeline-body', name: 'タイムラインレイヤー', keys:['Color.Layer', 'Color.LayerHover', 'Layout.LayerHeight', 'Color.WindowBorder', 'Layout.LayerHeaderWidth', 'Color.Text']})}} onMouseEnter={(e) => onShowTooltip('タイムラインレイヤー', e)} onMouseLeave={onHideTooltip}>
                    <div className="flex-shrink-0" style={{ width: `${layerHeaderWidth}px`, backgroundColor: toCssColor(config.Color.Layer) }}>
                        {layers.map((name, i) => (
                            <div key={i} className="flex items-center px-2" style={{
                                height: `${layerHeight}px`,
                                borderBottom: `1px solid ${toCssColor(config.Color.WindowBorder)}`,
                                ...toCssFont(config.Font.LayerObject)
                            }}>{name}</div>
                        ))}
                    </div>
                    <div className="flex-grow relative" style={{ backgroundColor: toCssColor(config.Color.Layer) }}>
                        <div className="absolute inset-0 pointer-events-none">
                           {layers.map((_, i) => ( <div key={i} className="w-full" style={{ height: `${layerHeight}px`, borderBottom: `1px solid ${toCssColor(config.Color.WindowBorder)}` }}></div>))}
                        </div>
                        {timelineObjects.map(obj => {
                            const isSelected = selectedElementKeys.includes(obj.key);
                            const color = config.Color[obj.colorKey as keyof typeof config.Color];
                            const selectColor = config.Color[obj.selectColorKey as keyof typeof config.Color];
                            return (
                                <div key={obj.key} className={`absolute flex items-center px-2 rounded-sm text-xs truncate ${getElementClasses(obj.key, selectedElementKeys)}`} style={{
                                    top: `${obj.top * layerHeight}px`, left: obj.left, width: obj.width, height: `${layerHeight}px`,
                                    background: toCssColor(color),
                                    border: `1px solid ${isSelected ? toCssColor(selectColor) : toCssColor(config.Color.ObjectFocus)}`, 
                                    ...toCssFont(config.Font.LayerObject),
                                    color: toCssColor(config.Color.TextSelect)
                                }} onClick={(e) => { e.stopPropagation(); onSelectElement({key: obj.key, name: obj.name, keys:[`Color.${obj.colorKey}`, `Color.ObjectVideoSelect`, 'Color.ObjectFocus', 'Color.ObjectHover', ...obj.fontKeys]})}}
                                   onMouseEnter={(e) => onShowTooltip(obj.name, e)}
                                   onMouseLeave={onHideTooltip}
                                >
                                    {obj.text}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Panel>
    );
};

const Footer: React.FC<{ config: StyleConfig; onSelectElement: (element: SelectedElement) => void; selectedElementKeys: string[]; onShowTooltip: (content: string, e: React.MouseEvent) => void; onHideTooltip: () => void; }> = ({ config, onSelectElement, selectedElementKeys, onShowTooltip, onHideTooltip }) => (
    <div className={`flex-shrink-0 flex justify-between items-center px-2 ${getElementClasses('app-footer', selectedElementKeys)}`} style={{
        height: `${config.Layout.FooterHeight}px`,
        background: toCssColor(config.Color.Footer),
        ...toCssFont(config.Font.Footer),
        color: toCssColor(config.Color.Text)
    }} onClick={(e) => { e.stopPropagation(); onSelectElement({key: 'app-footer', name: 'フッター', keys:['Layout.FooterHeight', 'Color.Footer', 'Font.Footer', 'Color.Text', 'Color.FooterProgress']})}}
       onMouseEnter={(e) => onShowTooltip('フッター', e)}
       onMouseLeave={onHideTooltip}
    >
      <span>00:00:02.66 / 00:00:02.66 | 81 / 81</span>
      <span>Root | 1920x1080 | 30fps | 48khz</span>
    </div>
);

export const PreviewPane: React.FC<PreviewPaneProps> = ({ config, onSelectElement, selectedElementKeys, onShowTooltip, onHideTooltip }) => {
  const separatorSize = `${config.Layout.WindowSeparatorSize}px`;

  return (
    <div className={`w-full h-full flex flex-col ${getElementClasses('window-separator', selectedElementKeys)}`} style={{ backgroundColor: toCssColor(config.Color.WindowSeparator) }} onClick={() => onSelectElement({key: 'window-separator', name: 'ウィンドウ区切り', keys: ['Color.WindowSeparator', 'Layout.WindowSeparatorSize']})} onMouseEnter={(e) => onShowTooltip('ウィンドウ区切り', e)} onMouseLeave={onHideTooltip}>
        <div className="flex-grow flex overflow-hidden" style={{ gap: separatorSize }}>
            {/* Column 1: File Explorer & Scene List */}
            <div className="w-[300px] flex-shrink-0 flex flex-col" style={{ gap: separatorSize }}>
              <div className="h-3/5 min-h-0">
                  <FileExplorer config={config} onSelectElement={onSelectElement} selectedElementKeys={selectedElementKeys} onShowTooltip={onShowTooltip} onHideTooltip={onHideTooltip} />
              </div>
              <div className="h-2/5 min-h-0">
                <SceneList config={config} onSelectElement={onSelectElement} selectedElementKeys={selectedElementKeys} onShowTooltip={onShowTooltip} onHideTooltip={onHideTooltip} />
              </div>
            </div>
            
            {/* Column 2: Video Preview & Timeline */}
            <div className="flex-grow flex flex-col" style={{ gap: separatorSize }}>
                <div className="h-3/5 min-h-0">
                  <VideoPreview config={config} onSelectElement={onSelectElement} selectedElementKeys={selectedElementKeys} onShowTooltip={onShowTooltip} onHideTooltip={onHideTooltip} />
                </div>
                <div className="h-2/5 min-h-0">
                  <Timeline config={config} onSelectElement={onSelectElement} selectedElementKeys={selectedElementKeys} onShowTooltip={onShowTooltip} onHideTooltip={onHideTooltip} />
                </div>
            </div>

            {/* Column 3: Object List & Properties */}
            <div className="w-[450px] flex-shrink-0 flex flex-col" style={{ gap: separatorSize }}>
               <div className="h-1/3 min-h-0">
                   <ObjectList config={config} onSelectElement={onSelectElement} selectedElementKeys={selectedElementKeys} onShowTooltip={onShowTooltip} onHideTooltip={onHideTooltip} />
               </div>
               <div className="h-2/3 min-h-0">
                  <PropertiesPanel config={config} onSelectElement={onSelectElement} selectedElementKeys={selectedElementKeys} onShowTooltip={onShowTooltip} onHideTooltip={onHideTooltip} />
               </div>
            </div>
        </div>
        <Footer config={config} onSelectElement={onSelectElement} selectedElementKeys={selectedElementKeys} onShowTooltip={onShowTooltip} onHideTooltip={onHideTooltip} />
    </div>
  );
};
