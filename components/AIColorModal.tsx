import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface AIColorModalProps {
  onClose: () => void;
  onThemeUpdate: (newColors: Record<string, string>) => void;
}

const colorKeysToGenerate = {
    type: Type.OBJECT,
    properties: {
        'Background': { type: Type.STRING, description: 'Main background color for the entire app.' },
        'WindowSeparator': { type: Type.STRING, description: 'Color for the space between panels.' },
        'Footer': { type: Type.STRING, description: 'Footer background color. Usually a bit darker or different from the main background.' },
        'TitleHeader': { type: Type.STRING, description: 'Header background color for all panels. Should contrast with the main background.' },
        'Text': { type: Type.STRING, description: 'Primary text color. Should be light for a dark theme.' },
        'TextSelect': { type: Type.STRING, description: 'Selected text color, high contrast against selection backgrounds.' },
        'ButtonBodySelect': { type: Type.STRING, description: 'Selected button background color. This should be a primary accent color.' },
        'Layer': { type: Type.STRING, description: 'Timeline layer background color. Often similar to the main background.' },
        'ObjectVideo': { type: Type.STRING, description: 'Color for video clips on the timeline. A prominent, primary accent color.' },
        'ObjectAudio': { type: Type.STRING, description: 'Color for audio clips on the timeline. A secondary accent color that pairs well with the video color.' },
        'ObjectControl': { type: Type.STRING, description: 'Color for control/effect clips. A tertiary accent color.' },
        'PlayerCursor': { type: Type.STRING, description: 'Color of the timeline playhead. Should be very visible and bright.' },
    }
};

export const AIColorModal: React.FC<AIColorModalProps> = ({ onClose, onThemeUpdate }) => {
  const [prompt, setPrompt] = useState('Cyberpunk city at night, with neon blues, purples, and pinks against a deep dark background.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt) {
      setError('説明を入力してください。');
      return;
    }
    setLoading(true);
    setError('');

    try {
      if (!process.env.API_KEY) {
          throw new Error("APIキーが設定されていません。");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const fullPrompt = `You are a creative UI theme designer. Create a color palette for a dark-themed video editing application based on this concept: "${prompt}". Provide colors as hex codes (e.g., #1a2b3c). Ensure good contrast and a professional feel.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: colorKeysToGenerate,
        }
      });

      const jsonText = response.text.trim();
      const newColors = JSON.parse(jsonText);
      onThemeUpdate(newColors);

    } catch (e) {
      console.error('AI theme generation failed:', e);
      if (e instanceof Error) {
        setError(`生成に失敗しました: ${e.message}`);
      } else {
        setError('不明なエラーが発生しました。');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-[#2a2a2a] rounded-lg shadow-xl w-full max-w-lg relative p-8">
        <button onClick={onClose} className="absolute top-3 right-3 text-white text-3xl hover:text-gray-400">&times;</button>
        <h2 className="text-2xl font-bold mb-4">AIカラーテーマ生成</h2>
        <p className="text-gray-400 mb-6">テーマのコンセプトやイメージを自由に入力してください。AIが配色を提案します。</p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="例: サイバーパンクな夜の街、雨上がりの静かな森"
          className="w-full h-24 p-3 bg-[#1e1e1e] border border-gray-600 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3 px-6 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              生成中...
            </>
          ) : 'テーマを生成'}
        </button>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
};
