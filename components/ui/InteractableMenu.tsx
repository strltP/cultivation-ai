
import React from 'react';
import type { Interactable } from '../../types/interaction';
import { FaEye, FaHandPaper } from 'react-icons/fa';
import { GiStoneAxe } from 'react-icons/gi';

interface InteractableMenuProps {
    interactable: Interactable;
    position: { top: number; left: number };
    onGather: () => void;
    onViewInfo: () => void;
    onDestroy: () => void;
    onClose: () => void;
}

const InteractableMenu: React.FC<InteractableMenuProps> = ({ interactable, position, onGather, onViewInfo, onDestroy, onClose }) => {
    
    const handleMenuClick = (e: React.MouseEvent) => e.stopPropagation();

    const createHandler = (action: () => void) => (e: React.MouseEvent) => {
        e.stopPropagation();
        action();
    };

    return (
        <div
            style={{ top: position.top, left: position.left }}
            className="absolute flex flex-col gap-1 bg-gray-900/80 border border-yellow-400/50 rounded-md shadow-lg p-2 backdrop-blur-sm z-30 animate-fade-in transform -translate-x-1/2 -translate-y-[calc(100%+20px)]"
            onClick={handleMenuClick}
            aria-modal="true"
            role="dialog"
        >
            <div className="text-center text-white font-bold border-b border-gray-600 pb-1 mb-1 px-4">{interactable.name}</div>
            <button
                onClick={createHandler(onGather)}
                className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-gray-200 hover:bg-green-600/50 transition-colors"
            >
                <FaHandPaper className="text-green-300" />
                <span>Thu thập</span>
            </button>
            <button
                onClick={createHandler(onViewInfo)}
                className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-gray-200 hover:bg-blue-600/50 transition-colors"
            >
                <FaEye className="text-blue-300" />
                <span>Xem thông tin</span>
            </button>
            <button
                onClick={createHandler(onDestroy)}
                className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-gray-200 hover:bg-red-600/50 transition-colors"
            >
                <GiStoneAxe className="text-red-400" />
                <span>Phá hoại</span>
            </button>
        </div>
    );
};

export default InteractableMenu;