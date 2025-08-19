import React, { useState, useMemo } from 'react';
import type { PlayerState, JournalEntry } from '../../types/character';
import { FaTimes, FaBookOpen, FaChevronDown } from 'react-icons/fa';
import { GiScrollQuill } from 'react-icons/gi';

interface JournalPanelProps {
  playerState: PlayerState;
  onClose: () => void;
}

const getEntryCategory = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('bế quan') || lowerMessage.includes('đột phá') || lowerMessage.includes('lĩnh ngộ')) {
        return 'Tu Luyện & Bế Quan';
    }
    if (lowerMessage.includes('thu thập')) {
        return 'Thu Thập Tài Nguyên';
    }
    if (lowerMessage.includes('săn yêu thú')) {
        return 'Săn Bắn Yêu Thú';
    }
    if (lowerMessage.includes('giao thương') || lowerMessage.includes('kiếm được')) {
        return 'Giao Thương & Buôn Bán';
    }
    if (lowerMessage.includes('di chuyển') || lowerMessage.includes('đã đến') || lowerMessage.includes('trở về') || lowerMessage.includes('hành trình')) {
        return 'Di Chuyển & Thám Hiểm';
    }
    return 'Sự Kiện Khác';
};

const JournalPanel: React.FC<JournalPanelProps> = ({ playerState, onClose }) => {
    const [activeTab, setActiveTab] = useState<'player' | 'world'>('player');
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

    const tabs: { id: 'player' | 'world'; label: string; icon: React.ReactNode }[] = [
        { id: 'player', label: 'Nhật Ký Người Chơi', icon: <GiScrollQuill /> },
        { id: 'world', label: 'Nhật Ký Thế Giới', icon: <FaBookOpen /> },
    ];
    
    const toggleCategory = (category: string) => {
        setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
    };

    const playerJournal = useMemo(() => {
        if (activeTab !== 'player') return {};
        const entries = (playerState.journal || []).filter(entry => (entry.type || 'player') === 'player');
        
        const grouped = entries.reduce((acc, entry) => {
            const key = `Tháng ${entry.time.month}, Năm ${entry.time.year}`;
            if (!acc[key]) acc[key] = [];
            acc[key].push(entry);
            return acc;
        }, {} as Record<string, JournalEntry[]>);

        return grouped;
    }, [playerState.journal, activeTab]);

    const worldJournal = useMemo(() => {
        if (activeTab !== 'world') return {};
        const entries = (playerState.journal || []).filter(entry => entry.type === 'world');

        const groupedByCategory = entries.reduce((acc, entry) => {
            const category = getEntryCategory(entry.message);
            if (!acc[category]) acc[category] = [];
            acc[category].push(entry);
            return acc;
        }, {} as Record<string, JournalEntry[]>);

        const finalGrouped: Record<string, Record<string, JournalEntry[]>> = {};
        for (const category in groupedByCategory) {
            finalGrouped[category] = groupedByCategory[category].reduce((acc, entry) => {
                const key = `Tháng ${entry.time.month}, Năm ${entry.time.year}`;
                if (!acc[key]) acc[key] = [];
                acc[key].push(entry);
                return acc;
            }, {} as Record<string, JournalEntry[]>);
        }
        return finalGrouped;
    }, [playerState.journal, activeTab]);

    const sortedPlayerJournalKeys = Object.keys(playerJournal).sort((a, b) => {
        const [, monthA, , yearA] = a.split(' ');
        const [, monthB, , yearB] = b.split(' ');
        if (parseInt(yearA) !== parseInt(yearB)) return parseInt(yearB) - parseInt(yearA);
        return parseInt(monthB) - parseInt(monthA);
    });
    
    const sortedWorldCategoryKeys = Object.keys(worldJournal);

    const sortDateKeys = (dateKeys: string[]) => {
        return dateKeys.sort((a, b) => {
            const [, monthA, , yearA] = a.split(' ');
            const [, monthB, , yearB] = b.split(' ');
            if (parseInt(yearA) !== parseInt(yearB)) return parseInt(yearB) - parseInt(yearA);
            return parseInt(monthB) - parseInt(monthA);
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 animate-fade-in" onClick={onClose}>
            <div
                className="bg-gray-900/80 border-2 border-yellow-400/50 rounded-lg shadow-2xl shadow-yellow-500/20 w-full max-w-4xl h-[80vh] flex flex-col backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex justify-between items-center border-b-2 border-yellow-400/30 p-4 flex-shrink-0">
                    <h2 className="text-3xl font-bold text-yellow-300">Nhật Ký Tu Luyện</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Đóng">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>
                 <nav className="flex-shrink-0 flex border-b-2 border-gray-700 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 md:px-6 py-3 text-base md:text-lg font-semibold transition-colors duration-200 border-b-4 flex-shrink-0 ${
                                activeTab === tab.id
                                    ? 'text-yellow-300 border-yellow-400 bg-yellow-600/30'
                                    : 'text-gray-400 border-transparent hover:bg-gray-700/50 hover:text-white'
                            }`}
                        >
                            {tab.icon}
                            <span className="whitespace-nowrap">{tab.label}</span>
                        </button>
                    ))}
                </nav>
                <main className="flex-grow p-4 overflow-y-auto scrollbar-thin chat-history">
                    {activeTab === 'player' && (
                         sortedPlayerJournalKeys.length > 0 ? (
                            <div className="space-y-6">
                                {sortedPlayerJournalKeys.map(groupKey => (
                                    <div key={groupKey}>
                                        <h3 className="text-2xl font-semibold text-amber-300 border-b border-amber-500/50 pb-2 mb-3">{groupKey}</h3>
                                        <ul className="space-y-2">
                                            {playerJournal[groupKey]
                                                .sort((a,b) => b.time.day - a.time.day)
                                                .map((entry, index) => (
                                                <li key={index} className="text-gray-300">
                                                    <span className="text-gray-500 font-mono text-sm mr-3">
                                                        [Ngày {entry.time.day}]
                                                    </span>
                                                    {entry.message}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <p>Nhật ký của bạn vẫn còn trống. Hãy bắt đầu hành trình của mình!</p>
                            </div>
                        )
                    )}
                    {activeTab === 'world' && (
                        sortedWorldCategoryKeys.length > 0 ? (
                             <div className="space-y-4">
                                {sortedWorldCategoryKeys.map(category => (
                                    <div key={category} className="bg-black/20 rounded-lg border border-gray-700">
                                        <button onClick={() => toggleCategory(category)} className="w-full flex justify-between items-center p-3 text-left hover:bg-gray-700/50 transition-colors">
                                            <h3 className="text-xl font-semibold text-amber-300">{category}</h3>
                                            <FaChevronDown className={`transition-transform duration-300 ${openCategories[category] ? 'rotate-180' : ''}`} />
                                        </button>
                                        {openCategories[category] && (
                                            <div className="p-4 border-t border-gray-600 space-y-4">
                                                {sortDateKeys(Object.keys(worldJournal[category])).map(dateKey => (
                                                    <div key={dateKey}>
                                                         <h4 className="text-lg font-semibold text-amber-200 border-b border-amber-500/30 pb-1 mb-2">{dateKey}</h4>
                                                          <ul className="space-y-2 pl-2">
                                                            {worldJournal[category][dateKey]
                                                                .sort((a,b) => b.time.day - a.time.day)
                                                                .map((entry, index) => (
                                                                    <li key={index} className="text-gray-300">
                                                                        <span className="text-gray-500 font-mono text-sm mr-3">
                                                                            [Ngày {entry.time.day}]
                                                                        </span>
                                                                        {entry.message}
                                                                    </li>
                                                                ))
                                                            }
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <p>Thế giới vẫn còn yên tĩnh. Chưa có sự kiện lớn nào xảy ra.</p>
                            </div>
                        )
                    )}
                </main>
            </div>
        </div>
    );
};

export default JournalPanel;
