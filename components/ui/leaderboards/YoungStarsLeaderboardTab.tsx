import React from 'react';
import type { PlayerState } from '../../../types/character';
import { GiGalaxy } from 'react-icons/gi';
import { FaShieldAlt, FaHourglassHalf } from 'react-icons/fa';

const YoungStarsLeaderboardTab: React.FC<{ playerState: PlayerState }> = ({ playerState }) => {
    const leaderboard = playerState.leaderboards.THIEN_NAM_TINH_TU || [];
    const lastUpdateYear = playerState.lastYoungStarsLeaderboardUpdateYear;

    if (leaderboard.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                <p>Thiên cơ chưa định, danh sách Tinh Tú vẫn còn là một bí ẩn.</p>
            </div>
        );
    }

    return (
        <div className="p-2">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-cyan-200">Thiên Nam Thập Nhị Tinh Tú</h2>
                <p className="text-sm text-gray-400">Top 12 tu sĩ trẻ (dưới 30 tuổi) có tiềm năng lớn nhất Thiên Nam. Cập nhật lần cuối vào năm {lastUpdateYear}.</p>
            </div>
            <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                    <div key={entry.npcId} className="bg-gray-800/60 p-4 rounded-lg border border-gray-700 flex items-center gap-4 transition-transform hover:scale-105 hover:border-cyan-500/50">
                        <div className="text-3xl font-bold w-12 text-center text-cyan-300">
                           {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </div>
                        <div className="flex-grow">
                            <h3 className="font-bold text-lg text-white">{entry.name} {entry.title ? <span className="text-cyan-400 italic">«{entry.title}»</span> : ''}</h3>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400 mt-1">
                                <span className="flex items-center gap-1.5" title="Thế lực"><FaShieldAlt /> {entry.factionName}</span>
                                <span className="flex items-center gap-1.5" title="Cảnh giới"><GiGalaxy /> {entry.cultivationName}</span>
                                <span className="flex items-center gap-1.5" title="Tuổi"><FaHourglassHalf /> {entry.age} tuổi</span>
                            </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <p className="text-xs text-gray-400">Điểm Tiềm Năng</p>
                            <p className="text-xl font-bold text-cyan-300">{entry.score.toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default YoungStarsLeaderboardTab;