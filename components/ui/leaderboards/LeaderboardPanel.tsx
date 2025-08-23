import React, { useState } from 'react';
import type { PlayerState } from '../../../types/character';
import { FaTimes, FaTrophy } from 'react-icons/fa';
import { GiGalaxy } from 'react-icons/gi';
import PowerLeaderboardTab from './PowerLeaderboardTab';
import YoungStarsLeaderboardTab from './YoungStarsLeaderboardTab';

interface LeaderboardPanelProps {
  playerState: PlayerState;
  onClose: () => void;
}

type ActiveTab = 'power' | 'youngStars';

const LeaderboardPanel: React.FC<LeaderboardPanelProps> = ({ playerState, onClose }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('power');

    const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
        { id: 'power', label: 'Thập Đại Cường Giả', icon: <FaTrophy /> },
        { id: 'youngStars', label: 'Thiên Nam Thập Nhị Tinh Tú', icon: <GiGalaxy /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'power':
                return <PowerLeaderboardTab playerState={playerState} />;
            case 'youngStars':
                return <YoungStarsLeaderboardTab playerState={playerState} />;
            default:
                return null;
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-40 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-gray-900/80 border-2 border-yellow-400/50 rounded-lg shadow-2xl shadow-yellow-500/20 w-full max-w-5xl h-[80vh] flex flex-col backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex justify-between items-center border-b-2 border-yellow-400/30 p-4 flex-shrink-0">
                    <h2 className="text-3xl font-bold text-yellow-300">Bảng Xếp Hạng</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                        aria-label="Đóng"
                    >
                        <FaTimes className="h-8 w-8" />
                    </button>
                </header>

                <nav className="flex-shrink-0 flex border-b-2 border-gray-700 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 text-lg font-semibold transition-colors duration-200 border-b-4 flex-shrink-0 ${
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
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default LeaderboardPanel;