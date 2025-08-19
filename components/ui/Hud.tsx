import React, { useEffect, useState } from 'react';
import type { PlayerState } from '../../types/character';
import type { GameMap } from '../../types/map';
import { getCultivationInfo } from '../../services/cultivationService';
import { FaMapMarkedAlt, FaCompass, FaYinYang, FaEye, FaEyeSlash, FaBookOpen, FaGem, FaIdCard, FaHourglassHalf, FaRadiationAlt } from 'react-icons/fa';
import { GiGalaxy, GiBrain, GiScrollQuill, GiCaveEntrance } from 'react-icons/gi';
import AttributeDisplay from './AttributeDisplay';
import CombatStatDisplay from './CombatStatDisplay';
import TimeDisplay from './TimeDisplay';
import { EFFECT_TYPE_NAMES } from '../../types/skill';

interface HudProps {
  playerState: PlayerState;
  currentMap: GameMap;
  gameMessage: { text: string; id: number } | null;
  isLoading: boolean;
  currentArea: string | null;
  currentZone: string | null;
  onBreakthrough: () => void;
  onToggleMap: () => void;
  onToggleMeditation: () => void;
  onToggleInfoPanel: () => void;
  onToggleJournalPanel: () => void;
  onToggleWorldInfoPanel: () => void;
  onToggleSeclusionPanel: () => void;
  isMeditating: boolean;
}

const Hud: React.FC<HudProps> = ({ playerState, currentMap, gameMessage, isLoading, currentArea, currentZone, onBreakthrough, onToggleMap, onToggleMeditation, onToggleInfoPanel, onToggleJournalPanel, onToggleWorldInfoPanel, onToggleSeclusionPanel, isMeditating }) => {
  const [visibleMessage, setVisibleMessage] = useState<string | null>(null);
  const [isPlayerInfoVisible, setIsPlayerInfoVisible] = useState(true);

  useEffect(() => {
    if (gameMessage) {
      setVisibleMessage(gameMessage.text);
      const timer = setTimeout(() => {
        setVisibleMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [gameMessage]);

  const hpPercentage = (playerState.hp / playerState.stats.maxHp) * 100;
  const manaPercentage = (playerState.mana / playerState.stats.maxMana) * 100;
  const qiPercentage = (playerState.qi / playerState.stats.maxQi) * 100;
  const isBreakthroughReady = playerState.qi >= playerState.stats.maxQi;
  const cultivationInfo = getCultivationInfo(playerState.cultivation);
  const age = playerState.time.year - 1;
  const agePercentage = (age / playerState.stats.maxThoNguyen) * 100;
  const ageColorClass = agePercentage > 90 ? 'text-red-400 animate-pulse' : agePercentage > 75 ? 'text-yellow-400' : 'text-gray-400';
  const isDebuffed = playerState.activeEffects.some(e => e.type === 'ENVIRONMENTAL_DEBUFF');

  let locationDisplay = currentMap.name;
    if (currentArea) {
        locationDisplay = currentArea;
    }
    if (currentZone) {
        locationDisplay = `${currentArea ? currentArea + ' - ' : ''}${currentZone}`;
    }

  return (
    <>
      {/* Top-Left: Player Stats */}
      <div className={`absolute top-4 left-4 bg-gray-900/70 p-4 rounded-lg border border-blue-400/30 shadow-lg backdrop-blur-sm flex flex-col z-20 transition-all duration-300 ease-in-out ${isPlayerInfoVisible ? 'min-w-[320px] gap-y-3' : 'w-auto gap-y-0'}`}>
        <div className="flex justify-between items-center gap-x-4">
            <div>
                <h2 className="text-xl font-bold text-blue-300">{playerState.name}</h2>
                {isPlayerInfoVisible && (
                    <>
                        <p className="text-base text-gray-300">{cultivationInfo.name} - {playerState.gender}</p>
                        {playerState.stats.maxThoNguyen > 0 && (
                            <div className={`flex items-center gap-x-2 text-sm mt-1 ${ageColorClass}`} title="Tuổi / Thọ Nguyên Tối Đa">
                                <FaHourglassHalf className={agePercentage > 90 ? 'text-red-400' : agePercentage > 75 ? 'text-yellow-400' : 'text-purple-300'} />
                                <span>Tuổi: {age} / {playerState.stats.maxThoNguyen}</span>
                            </div>
                        )}
                        {playerState.activeEffects.length > 0 && (
                            <div className="flex items-center gap-x-2 mt-2">
                                {playerState.activeEffects.map((effect, index) => (
                                    <div key={index} className="flex items-center gap-1.5 px-2 py-1 bg-red-900/50 rounded-full text-red-300 text-xs" title={EFFECT_TYPE_NAMES[effect.type]}>
                                        <FaRadiationAlt />
                                        <span>{EFFECT_TYPE_NAMES[effect.type]}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
            <button
                onClick={() => setIsPlayerInfoVisible(!isPlayerInfoVisible)}
                className="text-gray-400 hover:text-white transition-colors p-1"
                aria-label={isPlayerInfoVisible ? "Ẩn thông tin nhân vật" : "Hiện thông tin nhân vật"}
                title={isPlayerInfoVisible ? "Ẩn thông tin" : "Hiện thông tin"}
            >
                {isPlayerInfoVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
        </div>
        
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isPlayerInfoVisible ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="flex flex-col gap-y-3 pt-2">
                <div className="flex flex-col gap-y-1.5">
                    <div>
                         <p className="text-xs text-red-200 mb-1 text-right">{playerState.hp} / {playerState.stats.maxHp} Sinh Lực</p>
                         <div className="w-full bg-gray-700/50 rounded-full h-3.5 border border-black/20">
                            <div
                                className="bg-red-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${hpPercentage}%`, filter: 'drop-shadow(0 0 4px #ef4444)' }}
                            ></div>
                        </div>
                    </div>
                     <div>
                        <p className="text-xs text-indigo-200 mb-1 text-right">{playerState.mana} / {playerState.stats.maxMana} Linh Lực</p>
                        <div className="w-full bg-gray-700/50 rounded-full h-3.5 border border-black/20">
                            <div
                                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${manaPercentage}%`, filter: 'drop-shadow(0 0 4px #6366f1)' }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="pt-2 border-t border-blue-400/20 mt-3">
                    <p className="text-xs text-cyan-200 mb-1 text-right">{playerState.qi} / {playerState.stats.maxQi} Chân Khí</p>
                    <div className="w-full bg-gray-700/50 rounded-full h-2.5 border border-black/20">
                        <div
                            className="bg-cyan-400 h-full rounded-full transition-all duration-500 qi-bar-glow"
                            style={{ width: `${qiPercentage}%` }}
                        ></div>
                    </div>
                </div>

                <AttributeDisplay attributes={playerState.attributes} isDebuffed={isDebuffed} />
                <CombatStatDisplay stats={playerState.stats} isDebuffed={isDebuffed} />
            </div>
        </div>
      </div>

      {/* Top-Right: Time Display */}
      <TimeDisplay time={playerState.time} />

      {/* Bottom-Left: Location & Currency Info */}
      <div className="absolute bottom-4 left-4 bg-gray-900/70 p-3 rounded-lg border border-gray-600/50 shadow-md backdrop-blur-sm z-20 flex flex-col gap-y-2">
        <div className={`flex items-center gap-x-2 ${isDebuffed ? 'text-red-400 animate-pulse' : 'text-purple-300'}`}>
            <FaCompass />
            <span className="font-semibold text-sm">{locationDisplay}</span>
        </div>
        <div className="flex items-center gap-x-2 text-yellow-300" title="Linh Thạch">
            <FaGem />
            <span className="font-semibold text-sm">{playerState.linhThach.toLocaleString()}</span>
        </div>
         <div className="flex items-center gap-x-2 text-cyan-300" title="Điểm Cảm Ngộ">
            <GiBrain />
            <span className="font-semibold text-sm">{playerState.camNgo.toLocaleString()}</span>
        </div>
      </div>

      {/* Bottom-Center: Action Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-end justify-center gap-x-4 z-20">
        {isBreakthroughReady && !cultivationInfo.isMaxLevel && (
            <button
                onClick={onBreakthrough}
                className="hud-action-button hud-action-button-breakthrough"
                aria-label="Đột Phá"
                title="Đột Phá Cảnh Giới"
            >
                <GiGalaxy size={40} />
            </button>
        )}
        <button
            onClick={onToggleMeditation}
            className={`hud-action-button ${isMeditating ? 'active' : ''}`}
            aria-label={isMeditating ? "Dừng đả toạ" : "Đả Toạ"}
            title={isMeditating ? "Dừng đả toạ" : "Đả Toạ (Hồi Chân Khí & Cảm Ngộ)"}
        >
            <FaYinYang size={32} className={isMeditating ? 'animate-spin' : ''} />
        </button>
        <button
            onClick={onToggleSeclusionPanel}
            className="hud-action-button"
            aria-label="Bế Quan"
            title="Bế Quan Tu Luyện"
        >
            <GiCaveEntrance size={32} />
        </button>
         <button
            onClick={onToggleInfoPanel}
            className="hud-action-button"
            aria-label="Nhân Vật"
            title="Mở Bảng Thông Tin Nhân Vật"
        >
            <FaIdCard size={30} />
        </button>
        <button
            onClick={onToggleJournalPanel}
            className="hud-action-button"
            aria-label="Nhật Ký"
            title="Mở Nhật Ký Tu Luyện"
        >
            <GiScrollQuill size={30} />
        </button>
        <button
            onClick={onToggleWorldInfoPanel}
            className="hud-action-button"
            aria-label="Sách Tri Thức"
            title="Mở Sách Tri Thức (Thông Tin Thế Giới)"
        >
            <FaBookOpen size={30} />
        </button>
        <button
            onClick={onToggleMap}
            className="hud-action-button"
            aria-label="Bản Đồ"
            title="Mở Bản Đồ"
        >
            <FaMapMarkedAlt size={28} />
        </button>
      </div>

      {/* Game Message */}
      {visibleMessage && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-gray-900/80 py-2 px-4 rounded-lg border border-green-400/30 shadow-md backdrop-blur-sm animate-fade-in-out z-20 pointer-events-none">
          <p className="text-green-300">{visibleMessage}</p>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
         <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="w-16 h-16 border-4 border-t-transparent border-yellow-400 rounded-full animate-spin"></div>
            <p className="ml-4 text-xl text-yellow-300">Thiên địa biến chuyển...</p>
         </div>
      )}
    </>
  );
};

export default Hud;