
import React, { useState } from 'react';

interface ConfOutputProps {
  rawConf: string;
}

export const ConfOutput: React.FC<ConfOutputProps> = ({ rawConf }) => {
  const [buttonText, setButtonText] = useState('クリップボードにコピー');

  const handleCopy = () => {
    navigator.clipboard.writeText(rawConf);
    setButtonText('コピーしました！');
    setTimeout(() => setButtonText('クリップボードにコピー'), 2000);
  };
  
  return (
    <div className="p-6 bg-[#2a2a2a] rounded-lg">
      <div className="flex justify-between items-center mb-4">
         <h2 className="text-xl font-semibold text-white">生成された style.conf</h2>
         <button
            onClick={handleCopy}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-semibold transition-all w-48"
         >
           {buttonText}
         </button>
      </div>
      <textarea
        readOnly
        value={rawConf}
        className="w-full h-96 p-4 bg-[#1e1e1e] text-gray-300 font-mono text-xs border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};
