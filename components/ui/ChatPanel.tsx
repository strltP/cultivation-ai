import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { NPC, PlayerState } from '../../types/character';
import type { ChatMessage } from '../../types/character';
import { FaTimes, FaHourglassHalf, FaVenusMars, FaUserTag, FaGift, FaGem } from 'react-icons/fa';
import { GiPaintBrush, GiScrollQuill, GiGalaxy, GiTwoCoins } from 'react-icons/gi';
import { getCultivationInfo } from '../../services/cultivationService';
import { useInteraction } from '../../hooks/useGameContext';
import { ALL_ITEMS } from '../../data/items/index';
import type { Item, InventorySlot } from '../../types/item';

interface GiftingUIProps {
    playerState: PlayerState;
    npc: NPC;
    onClose: () => void;
}

const GiftingUI: React.FC<GiftingUIProps> = ({ playerState, npc, onClose }) => {
    const { handleGiftItem, handleGiftLinhThach } = useInteraction();
    const [activeTab, setActiveTab] = useState<'items' | 'currency'>('items');
    const [selectedItem, setSelectedItem] = useState<{ item: Item, slot: InventorySlot, index: number } | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [linhThachAmount, setLinhThachAmount] = useState(10);
    
    const giftableItems = useMemo(() => {
        return playerState.inventory
            .map((slot, index) => ({ slot, index, def: ALL_ITEMS.find(i => i.id === slot.itemId) }))
            .filter(item => item.def && item.def.type !== 'quest');
    }, [playerState.inventory]);
    
    useEffect(() => {
        if (selectedItem) {
            setQuantity(1);
        }
    }, [selectedItem]);

    const handleConfirmGift = () => {
        if (activeTab === 'items' && selectedItem) {
            handleGiftItem(selectedItem.index, quantity);
            onClose();
        } else if (activeTab === 'currency' && linhThachAmount > 0) {
            handleGiftLinhThach(linhThachAmount);
            onClose();
        }
    };
    
    return (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20" onClick={onClose}>
            <div className="bg-gray-800 border-2 border-yellow-500/50 rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-4 border-b border-gray-600">
                    <h3 className="text-xl font-bold text-yellow-300">Tặng Quà cho {npc.name}</h3>
                    <button onClick={onClose}><FaTimes/></button>
                </header>
                <nav className="flex border-b border-gray-600">
                    <button onClick={() => setActiveTab('items')} className={`flex-1 py-2 text-center ${activeTab === 'items' ? 'bg-yellow-600/30 text-yellow-200' : 'hover:bg-gray-700/50'}`}>Vật Phẩm</button>
                    <button onClick={() => setActiveTab('currency')} className={`flex-1 py-2 text-center ${activeTab === 'currency' ? 'bg-yellow-600/30 text-yellow-200' : 'hover:bg-gray-700/50'}`}>Linh Thạch</button>
                </nav>
                <div className="p-4 overflow-y-auto flex-grow">
                    {activeTab === 'items' && (
                        <div className="grid grid-cols-6 gap-2">
                             {giftableItems.map(({ slot, index, def }) => {
                                if (!def) return null;
                                const isSelected = selectedItem?.index === index;
                                return (
                                    <button key={index} onClick={() => setSelectedItem({item: def, slot, index})} className={`relative aspect-square bg-gray-900/50 rounded-md border-2 ${isSelected ? 'border-yellow-400 scale-105' : 'border-gray-700'} hover:bg-gray-700/70`}>
                                        <div className="flex items-center justify-center h-full text-3xl">{def.icon}</div>
                                        <span className="absolute bottom-1 right-1 text-xs font-bold text-white bg-gray-800/80 px-1.5 py-0.5 rounded">{slot.quantity}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                    {activeTab === 'currency' && (
                        <div className="flex flex-col items-center gap-4 p-8">
                            <p className="text-lg">Bạn có: <span className="font-bold text-yellow-300">{playerState.linhThach.toLocaleString()}</span> Linh Thạch</p>
                            <input 
                                type="number"
                                value={linhThachAmount}
                                onChange={e => setLinhThachAmount(Math.max(0, Math.min(playerState.linhThach, parseInt(e.target.value) || 0)))}
                                className="w-48 text-center bg-gray-700 border border-gray-600 rounded p-2 text-xl"
                            />
                             <div className="flex gap-2">
                                <button onClick={() => setLinhThachAmount(p => Math.min(playerState.linhThach, p + 10))} className="py-1 px-3 bg-gray-600 rounded">+10</button>
                                <button onClick={() => setLinhThachAmount(p => Math.min(playerState.linhThach, p + 100))} className="py-1 px-3 bg-gray-600 rounded">+100</button>
                                <button onClick={() => setLinhThachAmount(playerState.linhThach)} className="py-1 px-3 bg-gray-600 rounded">Tất cả</button>
                            </div>
                        </div>
                    )}
                </div>
                {selectedItem && activeTab === 'items' && (
                    <div className="p-4 border-t border-gray-600 flex items-center justify-between">
                         <p>Tặng {selectedItem.item.name}:</p>
                         <div className="flex items-center gap-2">
                             <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="px-3 py-1 bg-gray-700 rounded">-</button>
                             <input type="number" value={quantity} onChange={e => setQuantity(Math.max(1, Math.min(selectedItem.slot.quantity, parseInt(e.target.value) || 1)))} className="w-16 text-center bg-gray-800 border border-gray-600 rounded p-1"/>
                             <button onClick={() => setQuantity(q => Math.min(selectedItem.slot.quantity, q+1))} className="px-3 py-1 bg-gray-700 rounded">+</button>
                             <button onClick={() => setQuantity(selectedItem.slot.quantity)} className="py-1 px-3 bg-gray-600 rounded">Tất cả</button>
                         </div>
                    </div>
                )}
                 <footer className="p-4 border-t border-gray-600">
                    <button 
                        onClick={handleConfirmGift} 
                        disabled={ (activeTab === 'items' && !selectedItem) || (activeTab === 'currency' && (linhThachAmount <= 0 || linhThachAmount > playerState.linhThach)) }
                        className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                       Xác nhận Tặng
                    </button>
                </footer>
            </div>
        </div>
    )
}

interface ChatPanelProps {
    npc: NPC;
    history: ChatMessage[];
    onSendMessage: (message: string) => void;
    onClose: () => void;
    isLoading: boolean;
    playerState: PlayerState;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ npc, history, onSendMessage, onClose, isLoading, playerState }) => {
    const [input, setInput] = useState('');
    const [isGifting, setIsGifting] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const cultivationInfo = getCultivationInfo(npc.cultivation!);
    const age = playerState.time.year - npc.birthTime.year;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [history, isLoading]);

    const handleSend = () => {
        if (input.trim() && !isLoading) {
            onSendMessage(input.trim());
            setInput('');
        }
    };
    
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-40 animate-fade-in p-4" onClick={onClose}>
            {isGifting && <GiftingUI playerState={playerState} npc={npc} onClose={() => setIsGifting(false)} />}
            <div 
                className="bg-gradient-to-b from-[#4a3f35] to-[#3a3028] border-4 border-amber-700/60 rounded-lg shadow-2xl shadow-black/50 w-full max-w-4xl h-[95vh] flex flex-col" 
                onClick={(e) => e.stopPropagation()}
            >
                <header className="relative p-4 text-center flex-shrink-0">
                    <button onClick={onClose} className="absolute top-4 right-4 text-amber-300/70 hover:text-white transition-colors z-10" aria-label="Đóng">
                        <FaTimes className="h-7 w-7" />
                    </button>
                    
                    <h2 className="text-3xl font-bold text-amber-200 font-charm tracking-wider">{npc.name}</h2>
                    {npc.title && <p className="text-lg text-cyan-300 italic">« {npc.title} »</p>}
                    
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-sm text-amber-300/90 max-w-2xl mx-auto">
                        <div className="flex items-center justify-center gap-2 p-1 bg-black/20 rounded" title="Giới Tính">
                            <FaVenusMars className="text-lg" />
                            <span>{npc.gender}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 p-1 bg-black/20 rounded" title="Tuổi Tác">
                            <FaHourglassHalf className="text-lg" />
                            <span>{age} Tuổi</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 p-1 bg-black/20 rounded" title={cultivationInfo.name}>
                            <GiGalaxy className="text-lg" />
                            <span className="truncate">{cultivationInfo.realmName}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 p-1 bg-black/20 rounded" title="Chức Vụ">
                            <FaUserTag className="text-lg" />
                            <span className="truncate">{npc.role}</span>
                        </div>
                    </div>
                </header>
                 <hr className="border-t-2 border-amber-600/50 mx-6" />

                <main className="flex-grow p-4 overflow-y-auto space-y-4 chat-history scrollbar-thin">
                    {history.map((msg, index) => {
                        if (msg.role === 'system') {
                            return (
                                <div key={index} className="text-center my-2">
                                    <span className="text-sm text-yellow-400/80 italic bg-black/20 px-3 py-1 rounded-full">{msg.text}</span>
                                </div>
                            );
                        }
                        return (
                            <div key={index} className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'model' && 
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-amber-700 border-2 border-yellow-600 flex-shrink-0 flex items-center justify-center text-xl text-amber-900 shadow-inner" title={npc.name}>
                                        <GiScrollQuill />
                                    </div>
                                }
                                <div className={`max-w-[75%] p-3 border shadow-md ${msg.role === 'user' 
                                    ? 'bg-emerald-900/40 border-emerald-700/50 text-white rounded-tl-xl rounded-b-xl' 
                                    : 'bg-[#fdf6e3]/10 border-amber-200/20 text-gray-200 rounded-tr-xl rounded-b-xl'}`
                                }>
                                    <p className="text-base whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        )
                    })}
                    {isLoading && (
                        <div className="flex items-end gap-3 justify-start">
                             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-amber-700 border-2 border-yellow-600 flex-shrink-0 flex items-center justify-center text-xl text-amber-900 shadow-inner" title={npc.name}>
                                    <GiScrollQuill />
                            </div>
                            <div className="max-w-[75%] p-3 rounded-lg bg-[#fdf6e3]/10 border border-amber-200/20">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </main>

                 <hr className="border-t-2 border-amber-600/50 mx-6" />
                <footer className="p-4 flex-shrink-0">
                    <div className="flex items-center gap-3">
                         <button 
                            onClick={() => setIsGifting(true)}
                            disabled={isLoading} 
                            className="bg-yellow-600 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 hover:bg-yellow-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-110"
                            aria-label="Tặng quà"
                            title="Tặng quà"
                        >
                            <FaGift size={22}/>
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Viết lời của bạn..."
                            disabled={isLoading}
                            className="flex-grow bg-transparent border-0 border-b-2 border-amber-800/70 py-2 px-4 text-white placeholder-gray-400/70 focus:border-amber-500 focus:ring-0 transition-colors"
                        />
                        <button 
                            onClick={handleSend} 
                            disabled={isLoading || !input.trim()} 
                            className="bg-amber-600 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 hover:bg-amber-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-110"
                            aria-label="Gửi"
                        >
                            <GiPaintBrush size={24}/>
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ChatPanel;