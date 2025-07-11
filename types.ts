
export interface FontSettings {
  [key: string]: string;
}

export interface ColorSettings {
  [key: string]: string;
}

export interface LayoutSettings {
  [key: string]: string;
}

export interface FormatSettings {
  [key: string]: string;
}

export interface StyleConfig {
  Font: FontSettings;
  Color: ColorSettings;
  Layout: LayoutSettings;
  Format: FormatSettings;
}

export interface SelectedElement {
  key: string;
  name: string;
  keys: string[];
}

export interface InspectorWindowState {
  id: number;
  element: SelectedElement;
  position: { x: number; y: number };
}
