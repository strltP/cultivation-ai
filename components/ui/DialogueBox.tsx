

import React from 'react';
import type { Dialogue } from '../../types/interaction';

interface DialogueBoxProps {
  dialogue: Dialogue;
  onClose: () => void;
}

const DialogueBox: React.FC<DialogueBoxProps> = ({ dialogue, onClose }) => {
  return (
    <div 
      className="absolute bottom-28 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl bg-gray-900/80 border-2 border-yellow-400/50 rounded-lg shadow-2xl shadow-yellow-500/10 p-6 backdrop-blur-sm animate-fade-in z-30"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-xl font-bold text-yellow-300 mb-2">{dialogue.title}</h3>
      <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{dialogue.text}</p>
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
        aria-label="Đóng hội thoại"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default DialogueBox;