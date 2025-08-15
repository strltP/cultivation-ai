import React, { useState } from 'react';
import type { PlayerState } from '../../types/character';
import { FaBook, FaCog } from 'react-icons/fa';
import { GiBackpack, GiDiamondHard, GiGalaxy } from 'react-icons/gi';
import SkillsTab from './info-panel/SkillsTab';
import ItemsTab from './info-panel/ItemsTab';
import EquipmentTab from './info-panel/EquipmentTab';
import SystemTab from './info-panel/SystemTab';
import LinhCanTab from './info-panel/LinhCanTab';

interface InfoPanelProps {
  playerState: PlayerState;
  setPlayerState: (updater: (prevState: PlayerState) => PlayerState) => void;
  onClose: () => void;
  onLevelUpSkill: (skillId: string) => void;
  onUseItem: (itemIndex: number) => void;
}

type ActiveTab = 'skills' | 'items' | 'equipment' | 'linhCan' | 'system';

const InfoPanel: React.FC<InfoPanelProps> = ({ playerState, setPlayerState, onClose, onLevelUpSkill, onUseItem }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('skills');

    const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
        { id: 'skills', label: 'Công Pháp - Tâm Pháp', icon: <FaBook /> },
        { id: 'equipment', label: 'Trang Bị', icon: <GiDiamondHard /> },
        { id: 'linhCan', label: 'Linh Căn', icon: <GiGalaxy /> },
        { id: 'items', label: 'Vật Phẩm', icon: <GiBackpack /> },
        { id: 'system', label: 'Hệ Thống', icon: <FaCog /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'skills':
                return <SkillsTab playerState={playerState} onLevelUpSkill={onLevelUpSkill} />;
            case 'items':
                return <ItemsTab playerState={playerState} setPlayerState={setPlayerState} onUseItem={onUseItem} />;
            case 'equipment':
                return <EquipmentTab playerState={playerState} setPlayerState={setPlayerState} />;
            case 'linhCan':
                return <LinhCanTab playerState={playerState} />;
            case 'system':
                return <SystemTab playerState={playerState} setPlayerState={setPlayerState} />;
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
                    <h2 className="text-3xl font-bold text-yellow-300">Thông Tin Nhân Vật</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                        aria-label="Đóng"
                    >
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

                <main className="flex-grow p-4 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default InfoPanel;