import React, { useState } from 'react';
import CongPhapTab from './CongPhapTab';
import TamPhapTab from './TamPhapTab';
import { FaBookDead, FaBook } from 'react-icons/fa';

type ActiveSubTab = 'congphap' | 'tamphap';

const PhatQuyetTab: React.FC = () => {
    const [activeSubTab, setActiveSubTab] = useState<ActiveSubTab>('congphap');

    return (
        <div className="flex flex-col h-full -m-4">
            <nav className="flex-shrink-0 flex border-b-2 border-gray-700 bg-black/20 px-4">
                <button
                    onClick={() => setActiveSubTab('congphap')}
                    className={`flex items-center gap-2 px-6 py-3 text-lg font-semibold transition-colors duration-200 border-b-4 ${
                        activeSubTab === 'congphap'
                            ? 'text-yellow-300 border-yellow-400'
                            : 'text-gray-400 border-transparent hover:text-white'
                    }`}
                >
                    <FaBookDead /> Công Pháp
                </button>
                <button
                    onClick={() => setActiveSubTab('tamphap')}
                    className={`flex items-center gap-2 px-6 py-3 text-lg font-semibold transition-colors duration-200 border-b-4 ${
                        activeSubTab === 'tamphap'
                            ? 'text-yellow-300 border-yellow-400'
                            : 'text-gray-400 border-transparent hover:text-white'
                    }`}
                >
                    <FaBook /> Tâm Pháp
                </button>
            </nav>
            <div className="flex-grow overflow-y-auto p-4 scrollbar-thin chat-history">
                {activeSubTab === 'congphap' && <CongPhapTab />}
                {activeSubTab === 'tamphap' && <TamPhapTab />}
            </div>
        </div>
    );
};

export default PhatQuyetTab;
