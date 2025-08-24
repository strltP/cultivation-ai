import React, { useState, useMemo } from 'react';
import type { PlayerState, JournalEntry } from '../../types/character';
import { FaTimes, FaBookOpen } from 'react-icons/fa';
import { GiScrollQuill } from 'react-icons/gi';
import { ALL_SKILLS } from '../../data/skills/skills';
import { REALM_PROGRESSION } from '../../constants';

interface JournalGroupProps {
    entries: Record<string, JournalEntry[]>;
    sortedKeys: string[];
    emptyMessage: string;
}

const JournalGroup: React.FC<JournalGroupProps> = ({ entries, sortedKeys, emptyMessage }) => {
    if (sortedKeys.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                <p>{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {sortedKeys.map(groupKey => (
                <div key={groupKey}>
                    <h3 className="text-2xl font-semibold text-amber-300 border-b border-amber-500/50 pb-2 mb-3">{groupKey}</h3>
                    <ul className="space-y-2">
                        {entries[groupKey]
                            .sort((a, b) => b.time.day - a.time.day)
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
    );
};

const isMajorWorldEvent = (entry: JournalEntry): boolean => {
    if (entry.type !== 'world') return false;

    // Criterion 1: Breakthroughs to major realms or peak minor realms
    const breakthroughRegex = /đã thành công đột phá đến (.+?)!/;
    const breakthroughMatch = entry.message.match(breakthroughRegex);
    if (breakthroughMatch) {
        const cultivationName = breakthroughMatch[1];
        const parts = cultivationName.split(' - ');
        if (parts.length === 2) {
            const realmName = parts[0].trim();
            const levelName = parts[1].trim();
            
            const realm = REALM_PROGRESSION.find(r => r.name === realmName);
            if (realm) {
                const levelIndex = realm.levels.findIndex(l => l.levelName === levelName);
                // Major event if it's the first level (new realm) or last level (peak)
                if (levelIndex === 0 || levelIndex === realm.levels.length - 1) {
                    return true;
                }
            }
        }
    }

    // Criterion 2: Skill mastered to its final level
    const skillMasteryRegex = /đã lĩnh ngộ "(.+?)" đến tầng thứ (\d+)/;
    const skillMatch = entry.message.match(skillMasteryRegex);
    if (skillMatch) {
        const skillName = skillMatch[1];
        const level = parseInt(skillMatch[2], 10);
        const skillDef = ALL_SKILLS.find(s => s.name === skillName);
        if (skillDef && level === skillDef.maxLevel) {
            return true;
        }
    }

    return false;
};


const JournalPanel: React.FC<{ playerState: PlayerState; onClose: () => void }> = ({ playerState, onClose }) => {
    const [activeTab, setActiveTab] = useState<'player' | 'world'>('player');
    const [worldTab, setWorldTab] = useState<'major' | 'minor'>('major');

    const tabs: { id: 'player' | 'world'; label: string; icon: React.ReactNode }[] = [
        { id: 'player', label: 'Nhật Ký Người Chơi', icon: <GiScrollQuill /> },
        { id: 'world', label: 'Nhật Ký Thế Giới', icon: <FaBookOpen /> },
    ];
    
    const { playerJournal, majorWorldEvents, minorWorldEvents } = useMemo(() => {
        const groupEntriesByDate = (entries: JournalEntry[]) => {
            return entries.reduce((acc, entry) => {
                const key = `Tháng ${entry.time.month}, Năm ${entry.time.year}`;
                if (!acc[key]) acc[key] = [];
                acc[key].push(entry);
                return acc;
            }, {} as Record<string, JournalEntry[]>);
        };
        
        const playerEntries = (playerState.journal || []).filter(entry => (entry.type || 'player') === 'player');
        
        const worldEntries = (playerState.journal || []).filter(entry => entry.type === 'world');
        const majorEntries = worldEntries.filter(isMajorWorldEvent);
        const minorEntries = worldEntries.filter(entry => !isMajorWorldEvent(entry));

        return {
            playerJournal: groupEntriesByDate(playerEntries),
            majorWorldEvents: groupEntriesByDate(majorEntries),
            minorWorldEvents: groupEntriesByDate(minorEntries),
        };
    }, [playerState.journal]);

    const sortDateKeys = (dateKeys: string[]) => {
        return dateKeys.sort((a, b) => {
            const [, monthA, , yearA] = a.split(' ');
            const [, monthB, , yearB] = b.split(' ');
            if (parseInt(yearA) !== parseInt(yearB)) return parseInt(yearB) - parseInt(yearA);
            return parseInt(monthB, 10) - parseInt(monthA, 10);
        });
    };
    
    const sortedPlayerJournalKeys = sortDateKeys(Object.keys(playerJournal));
    const sortedMajorWorldKeys = sortDateKeys(Object.keys(majorWorldEvents));
    const sortedMinorWorldKeys = sortDateKeys(Object.keys(minorWorldEvents));


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
                <main className="flex-grow p-4 overflow-y-auto scrollbar-thin chat-history flex flex-col">
                    {activeTab === 'player' && (
                         <JournalGroup 
                             entries={playerJournal} 
                             sortedKeys={sortedPlayerJournalKeys} 
                             emptyMessage="Nhật ký của bạn vẫn còn trống. Hãy bắt đầu hành trình của mình!" 
                         />
                    )}
                    {activeTab === 'world' && (
                        <>
                            <nav className="flex-shrink-0 flex border-b-2 border-gray-600 mb-4">
                                <button
                                    onClick={() => setWorldTab('major')}
                                    className={`px-6 py-2 text-lg font-semibold transition-colors duration-200 border-b-4 ${worldTab === 'major' ? 'text-yellow-300 border-yellow-400' : 'text-gray-400 border-transparent hover:text-white'}`}
                                >
                                    Đại Sự Ký
                                </button>
                                <button
                                    onClick={() => setWorldTab('minor')}
                                    className={`px-6 py-2 text-lg font-semibold transition-colors duration-200 border-b-4 ${worldTab === 'minor' ? 'text-yellow-300 border-yellow-400' : 'text-gray-400 border-transparent hover:text-white'}`}
                                >
                                    Tiểu Sự Ký
                                </button>
                            </nav>
                             <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                                {worldTab === 'major' && <JournalGroup entries={majorWorldEvents} sortedKeys={sortedMajorWorldKeys} emptyMessage="Chưa có đại sự nào xảy ra trong thế giới." />}
                                {worldTab === 'minor' && <JournalGroup entries={minorWorldEvents} sortedKeys={sortedMinorWorldKeys} emptyMessage="Thế giới vẫn còn yên tĩnh." />}
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default JournalPanel;
