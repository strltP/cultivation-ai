import React, { useState, useRef, useEffect } from 'react';
import type { NPC } from '../../types/character';
import type { ChatMessage } from '../../types/character';
import { FaTimes, FaHourglassHalf, FaVenusMars, FaUserTag } from 'react-icons/fa';
import { GiPaintBrush, GiScrollQuill, GiGalaxy } from 'react-icons/gi';
import { getCultivationInfo } from '../../services/cultivationService';

interface ChatPanelProps {
    npc: NPC;
    history: ChatMessage[];
    onSendMessage: (message: string) => void;
    onClose: () => void;
    isLoading: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ npc, history, onSendMessage, onClose, isLoading }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const cultivationInfo = getCultivationInfo(npc.cultivation!);

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
                            <span>{npc.age} Tuổi</span>
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
                    {history.map((msg, index) => (
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
                    ))}
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