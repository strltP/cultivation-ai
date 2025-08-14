import React, { useState, useRef, useEffect } from 'react';
import type { NPC } from '../../types/character';
import type { ChatMessage } from '../../types/character';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';

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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 animate-fade-in" onClick={onClose}>
            <div className="bg-gray-900/80 border-2 border-yellow-400/50 rounded-lg shadow-2xl shadow-yellow-500/20 w-full max-w-2xl h-[75vh] flex flex-col backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
                <header className="flex justify-between items-center border-b-2 border-yellow-400/30 p-4 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-yellow-300">Trò chuyện với {npc.name}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Đóng"><FaTimes className="h-7 w-7" /></button>
                </header>

                <main className="flex-grow p-4 overflow-y-auto space-y-4">
                    {history.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-yellow-500 flex-shrink-0"></div>}
                            <div className={`max-w-[75%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                <p className="text-base whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-end gap-2 justify-start">
                            <div className="w-8 h-8 rounded-full bg-yellow-500 flex-shrink-0"></div>
                            <div className="max-w-[75%] p-3 rounded-lg bg-gray-700 text-gray-200">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </main>

                <footer className="p-4 border-t-2 border-yellow-400/30 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Nhập lời của bạn..."
                            disabled={isLoading}
                            className="flex-grow bg-gray-800/50 border-2 border-gray-600 rounded-full py-2 px-4 text-white focus:border-yellow-400 focus:ring-yellow-400 focus:outline-none transition-colors"
                        />
                        <button onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-yellow-500 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 hover:bg-yellow-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                            <FaPaperPlane />
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ChatPanel;