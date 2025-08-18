import React, { useState, useMemo } from 'react';
import type { PlayerState, JournalEntry } from '../../types/character';
import { FaTimes, FaBookOpen } from 'react-icons/fa';
import { GiScrollQuill } from 'react-icons/gi';

interface JournalPanelProps {
  playerState: PlayerState;
  onClose: () => void;
}

const JournalPanel: React.FC<JournalPanelProps> = ({ playerState, onClose }) => {
    const [activeTab, setActiveTab] = useState<'player' | 'world'>('player');

    const tabs: { id: 'player' | 'world'; label: string; icon: React.ReactNode }[] = [
        { id: 'player', label: 'Nhật Ký Người Chơi', icon: <GiScrollQuill /> },
        { id: 'world', label: 'Nhật Ký Thế Giới', icon: <FaBookOpen /> },
    ];

    const filteredJournal = useMemo(() => {
        return (playerState.journal || []).filter(entry => (entry.type || 'player') === activeTab);
    }, [playerState.journal, activeTab]);

    const groupedJournal = filteredJournal.reduce((acc, entry) => {
        const key = `Tháng ${entry.time.month}, Năm ${entry.time.year}`;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(entry);
        return acc;
    }, {} as Record<string, JournalEntry[]>);

    const sortedGroupKeys = Object.keys(groupedJournal).sort((a, b) => {
        const [, monthA, , yearA] = a.split(' ');
        const [, monthB, , yearB] = b.split(' ');
        if (parseInt(yearA) !== parseInt(yearB)) {
            return parseInt(yearB) - parseInt(yearA); // Sort years descending
        }
        return parseInt(monthB) - parseInt(monthA); // Sort months descending
    });

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
                    {sortedGroupKeys.length > 0 ? (
                        <div className="space-y-6">
                            {sortedGroupKeys.map(groupKey => (
                                <div key={groupKey}>
                                    <h3 className="text-2xl font-semibold text-amber-300 border-b border-amber-500/50 pb-2 mb-3">{groupKey}</h3>
                                    <ul className="space-y-2">
                                        {groupedJournal[groupKey]
                                            .sort((a,b) => b.time.day - a.time.day) // Sort days descending within a month
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
                            <p>
                                {activeTab === 'player'
                                ? 'Nhật ký của bạn vẫn còn trống. Hãy bắt đầu hành trình của mình!'
                                : 'Thế giới vẫn còn yên tĩnh. Chưa có sự kiện lớn nào xảy ra.'}
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default JournalPanel;