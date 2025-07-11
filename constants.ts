
import { SelectedElement } from './types';

export const INITIAL_CONF = `; 外観の設定
; UTF-8で記述する
; ProgramData\\aviutl2\\style.confで設定を上書き出来る

[Font]
; 標準のフォント名
DefaultFamily=BIZ UDGothic
; 標準のコントロールのフォント
Control=13
; エディットコントロールのフォント ※等幅フォント推奨
EditControl=13,Consolas
; プレビュー時間表示のフォント
PreviewTime=16
; レイヤー・オブジェクト編集部分のフォント
LayerObject=12
; フレーム時間ゲージのフォント
TimeGauge=13
; フッターのフォント
Footer=14
; テキスト編集のフォント ※等幅フォント推奨
TextEdit=16,Consolas
; ログのフォント ※等幅フォント推奨
Log=12,Consolas

[Color]
; デフォルトの背景色 
Background=24273a
; ウィンドウの枠線色 
WindowBorder=6e738d
; ウィンドウ間の背景色
WindowSeparator=181926
; フッターの背景色
Footer=1e2030
; フッターの進捗色
FooterProgress=ff69b4,ff1493
Grouping=1e2030
GroupingHover=1e2030
GroupingSelect=1e2030
; タイトルヘッダーの背景色 
TitleHeader=363a4f
BorderSelect=454545
Border=1e2030
BorderFocus=2e2f2f
Text=cad3f5
TextDisable=6e738d
TextSelect=ffffff
; ボタンの背景色
ButtonBody=363a4f
ButtonBodyHover=24273a
ButtonBodyPress=24273a
ButtonBodyDisable=24273a
ButtonBodySelect=7287fd
SliderCursor=daa520
TrackBarRange=1e2030
ZoomGauge=00bfff
ZoomGaugeHover=87cefa
ZoomGaugeOff=5f9ea0
ZoomGaugeOffHover=4682b4
FrameCursor=ff000080
FrameCursorWide=8b000080
PlayerCursor=ffff0080
GuideLine=ffa50080
; レイヤーの背景色
Layer=181926
LayerHeader=1e2030
LayerHover=545454
LayerDisable=1e2030
LayerRange=8b451380
LayerRangeFrame=8b4513c8
; 映像オブジェクトの色
ObjectVideo=1e66f5,1e66f5
ObjectAudio=d20f39,d20f39
ObjectControl=179299,179299
ObjectVideoFilter=40a02b,40a02b
ObjectAudioFilter=df8e1d,df8e1d
ObjectHover=00ffffa0
ObjectFocus=00ff00
ObjectSection=d3d3d3
; クリッピングオブジェクトの色(下部)
ClippingObject=00ffff
; クリッピングオブジェクトの視覚化時の色
ClippingObjectMask=00ffff40
; アンカー枠色
Anchor=f5f5f5
; アンカー線色
AnchorLine=ffdead80
; アンカー枠色(開始)
AnchorIn=adff2f
; アンカー枠色(終了)
AnchorOut=ff4500
; アンカー枠色(マウスが乗った時)
AnchorHover=fffacd80
; アンカー枠色(選択時)
AnchorSelect=eee8aa
; アンカー枠の縁色
AnchorEdge=19197080
; 中心点の色(グループ)
CenterGroup=00ff7f
HandleX=ff0000
HandleY=00ff00
HandleZ=0000ff
HandleXHover=ff69b4
HandleYHover=98fb98
HandleZHover=87ceeb
; 表示領域外の色
OutsideDisplay=1e2030

[Layout]
; ウィンドウ間のサイズ
WindowSeparatorSize=7
; スクロールバーのサイズ
ScrollBarSize=20
; フッターの高さ
FooterHeight=24
; タイトルヘッダーのサイズ
TitleHeaderHeight=18
; タイムゲージの高さ
TimeGaugeHeight=32
; レイヤーの高さ(レイヤー編集) 
LayerHeight=26
; レイヤー名の幅(レイヤー編集) 
LayerHeaderWidth=96
SettingItemHeaderWidth=96
SettingItemHeight=22
SettingItemMarginWidth=6
; 設定のヘッダーの高さ
SettingHeaderHeight=48
; プレイヤーコントローラーの高さ
PlayerControlHeight=46
; メディアエクスプローラーヘッダーの高さ
ExplorerHeaderHeight=28
; メディアエクスプローラーの数
ExplorerWindowNum=4
; リスト選択項目の高さ
ListItemHeight=26

[Format]
; フッターの表示フォーマット
; {ProjectName}  : プロジェクト名
; {SceneName}    : シーン名
; {Resolution}   : シーンの解像度
; {FrameRate}    : シーンのフレームレート
; {SamplingRate} : シーンのサンプリングレート
; {CurrentTime}  : 現在の時間
; {TotalTime}    : 総時間
; {CurrentFrame} : 現在のフレーム番号
; {TotalFrame}   : 総フレーム数
FooterLeft={CurrentTime} / {TotalTime}  |  {CurrentFrame} / {TotalFrame}
FooterRight={SceneName}  |  {Resolution}  |  {FrameRate}  |  {SamplingRate}
`;

export const OTHER_SETTINGS_ELEMENT: SelectedElement = {
    key: 'other-settings',
    name: 'その他の設定',
    keys: [
        'Layout.ScrollBarSize',
        'Layout.SettingItemMarginWidth',
        'Layout.ExplorerWindowNum',
        'Format.FooterLeft',
        'Format.FooterRight',
        'Color.GuideLine',
        'Color.FrameCursor',
        'Color.FrameCursorWide',
        'Color.ClippingObject',
        'Color.ClippingObjectMask',
        'Color.AnchorIn',
        'Color.AnchorOut',
        'Color.AnchorLine',
        'Color.CenterGroup',
        'Color.HandleX',
        'Color.HandleY',
        'Color.HandleZ',
        'Color.HandleXHover',
        'Color.HandleYHover',
        'Color.HandleZHover',
        'Color.SliderCursor',
        'Color.ZoomGauge',
        'Color.ZoomGaugeHover',
        'Color.ZoomGaugeOff',
        'Color.ZoomGaugeOffHover',
    ],
};
