import React from 'react';
import type { NPC } from '../../types/character';
import { FaCommentDots, FaInfoCircle } from 'react-icons/fa';
import { GiCrossedSwords, GiTwoCoins } from 'react-icons/gi';

interface InteractionMenuProps {
    npc: NPC;
    position: { top: number; left: number };
    onStartChat: () => void;
    onChallenge: () => void;
    onViewInfo: () => void;
    onTrade: () => void;
    onClose: () => void;
}

const InteractionMenu: React.FC<InteractionMenuProps> = ({ npc, position, onStartChat, onChallenge, onViewInfo, onTrade, onClose }) => {
    // Stop propagation to prevent world click from closing the menu immediately
    const handleMenuClick = (e: React.MouseEvent) => e.stopPropagation();

    const createHandler = (action: () => void) => (e: React.MouseEvent) => {
        e.stopPropagation();
        action();
    };

    const hasTradeOption = npc.forSale && npc.forSale.length > 0;

    return (
        <div
            style={{ top: position.top, left: position.left }}
            className="absolute flex flex-col gap-1 bg-gray-900/80 border border-yellow-400/50 rounded-md shadow-lg p-2 backdrop-blur-sm z-30 animate-fade-in transform -translate-x-1/2 -translate-y-[calc(100%+20px)]"
            onClick={handleMenuClick}
            aria-modal="true"
            role="dialog"
        >
            <div className="text-center text-white font-bold border-b border-gray-600 pb-1 mb-1 px-4">{npc.name}</div>
            <button
                onClick={createHandler(onStartChat)}
                className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-gray-200 hover:bg-yellow-600/50 transition-colors"
            >
                <FaCommentDots className="text-yellow-300" />
                <span>Trò chuyện</span>
            </button>
             {hasTradeOption && (
                 <button
                    onClick={createHandler(onTrade)}
                    className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-gray-200 hover:bg-green-600/50 transition-colors"
                >
                    <GiTwoCoins className="text-green-300" />
                    <span>Giao dịch</span>
                </button>
            )}
            <button
                onClick={createHandler(onViewInfo)}
                className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-gray-200 hover:bg-blue-600/50 transition-colors"
            >
                <FaInfoCircle className="text-blue-300" />
                <span>Xem thông tin</span>
            </button>
            <button
                onClick={createHandler(onChallenge)}
                className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-gray-200 hover:bg-red-600/50 transition-colors"
            >
                <GiCrossedSwords className="text-red-400" />
                <span>Khiêu chiến</span>
            </button>
        </div>
    );
};

export default InteractionMenu;