import React from 'react';
import type { PlayerState, JournalEntry } from '../../types/character';
import { FaTimes } from 'react-icons/fa';

interface JournalPanelProps {
  playerState: PlayerState;
  onClose: () => void;
}

const JournalPanel: React.FC<JournalPanelProps> = ({ playerState, onClose }) => {
    const groupedJournal = (playerState.journal || []).reduce((acc, entry) => {
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
                <main className="flex-grow p-4 overflow-y-auto scrollbar-thin chat-history">
                    {sortedGroupKeys.length > 0 ? (
                        <div className="space-y-6">
                            {sortedGroupKeys.map(groupKey => (
                                <div key={groupKey}>
                                    <h3 className="text-2xl font-semibold text-amber-300 border-b border-amber-500/50 pb-2 mb-3">{groupKey}</h3>
                                    <ul className="space-y-2">
                                        {groupedJournal[groupKey]
                                            .sort((a,b) => a.time.day - b.time.day)
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
                    )}
                </main>
            </div>
        </div>
    );
};

export default JournalPanel;
