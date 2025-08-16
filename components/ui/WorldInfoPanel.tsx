
import React, { useState } from 'react';
import { FaBookDead, FaBook, FaBoxOpen } from 'react-icons/fa';
import { GiDiamondHard, GiGalaxy } from 'react-icons/gi';
import CongPhapTab from './world-info-panel/CongPhapTab';
import TamPhapTab from './world-info-panel/TamPhapTab';
import VatPhamTab from './world-info-panel/VatPhamTab';
import TrangBiTab from './world-info-panel/TrangBiTab';
import LinhCanWorldInfoTab from './world-info-panel/LinhCanTab';

interface WorldInfoPanelProps {
  onClose: () => void;
}

type ActiveTab = 'congphap' | 'tamphap' | 'linhcan' | 'vatpham' | 'trangbi';

const WorldInfoPanel: React.FC<WorldInfoPanelProps> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('congphap');

    const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
        { id: 'congphap', label: 'Công Pháp', icon: <FaBookDead /> },
        { id: 'tamphap', label: 'Tâm Pháp', icon: <FaBook /> },
        { id: 'linhcan', label: 'Linh Căn', icon: <GiGalaxy /> },
        { id: 'vatpham', label: 'Vật Phẩm', icon: <FaBoxOpen /> },
        { id: 'trangbi', label: 'Trang Bị', icon: <GiDiamondHard /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'congphap':
                return <CongPhapTab />;
            case 'tamphap':
                return <TamPhapTab />;
            case 'linhcan':
                return <LinhCanWorldInfoTab />;
            case 'vatpham':
                return <VatPhamTab />;
            case 'trangbi':
                return <TrangBiTab />;
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
                className="bg-gray-900/80 border-2 border-yellow-400/50 rounded-lg shadow-2xl shadow-yellow-500/20 w-full max-w-6xl h-[85vh] flex flex-col backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex justify-between items-center border-b-2 border-yellow-400/30 p-4 flex-shrink-0">
                    <h2 className="text-3xl font-bold text-yellow-300">Sách Tri Thức</h2>
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

                <main className="flex-grow p-4 overflow-y-auto bg-black/10">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default WorldInfoPanel;
