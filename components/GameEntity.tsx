
import React from 'react';
import type { NPC } from '../types/character';
import type { Interactable } from '../types/interaction';
import { FaUserSecret, FaLeaf, FaCube, FaBoxOpen, FaMale, FaFemale } from 'react-icons/fa';
import { GiSprout, GiPlantSeed, GiHerbsBundle, GiFireBowl, GiWyvern } from 'react-icons/gi';
import { getCultivationInfo } from '../services/cultivationService';

interface GameEntityProps {
  entity: NPC | Interactable;
  onClick: () => void;
}

const isNpc = (entity: NPC | Interactable): entity is NPC => 'cultivation' in entity || 'npcType' in entity;

const GameEntity: React.FC<GameEntityProps> = ({ entity, onClick }) => {
  const baseClasses = "absolute flex items-center justify-center w-10 h-10 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform duration-200";
  
  let entityStyle = '';
  let icon: React.ReactNode;
  let title = entity.name;

  if (isNpc(entity)) {
    if (entity.npcType === 'monster') {
        entityStyle = "bg-red-700 border-2 border-red-400 npc-shadow";
        icon = <GiWyvern className="text-red-100" size={24} />;
        title = `${entity.name}\nLoại: ${entity.role}\nCấp: ${entity.level}\nHP: ${entity.hp}/${entity.stats.maxHp}`;
    } else {
        entityStyle = "bg-yellow-500 border-2 border-yellow-200 npc-shadow";
        icon = entity.gender === 'Nữ' 
            ? <FaFemale className="text-yellow-900" size={20} /> 
            : <FaMale className="text-yellow-900" size={20} />;
        const cultivationInfo = getCultivationInfo(entity.cultivation!);
        title = `${entity.name}${entity.title ? ` «${entity.title}»` : ''}\nGiới tính: ${entity.gender}\nChức vụ: ${entity.role}\nCảnh giới: ${cultivationInfo.name}\nTuổi: ${entity.age}\nHP: ${entity.hp}/${entity.stats.maxHp}`;
    }
  } else {
    const interactable = entity as Interactable;
    if (interactable.type === 'spirit_field') {
        if (interactable.isPlanted) {
            if (interactable.isReady) {
                entityStyle = "bg-yellow-400 border-2 border-yellow-200 interactable-shadow";
                icon = <GiHerbsBundle className="text-yellow-800" size={24} />;
                title = `${interactable.plantName} (Chín muồi)`;
            } else {
                entityStyle = "bg-lime-500 border-2 border-lime-200 interactable-shadow";
                icon = <GiSprout className="text-lime-900" size={22} />;
                title = `${interactable.plantName} (Đang lớn: ${interactable.growthPercent?.toFixed(0)}%)`;
            }
        } else {
            entityStyle = "bg-yellow-900 border-2 border-yellow-700 item-shadow";
            icon = <GiPlantSeed className="text-yellow-200" size={20} />;
            title = `Linh Điền (Trống)`;
        }
    } else {
        switch (entity.type) {
          case 'herb':
            entityStyle = "bg-green-500 border-2 border-green-200 interactable-shadow";
            icon = <FaLeaf className="text-green-900" size={20} />;
            break;
          case 'stone':
            entityStyle = "bg-gray-500 border-2 border-gray-200 item-shadow";
            icon = <FaCube className="text-gray-900" size={20} />;
            break;
          case 'chest':
            entityStyle = "bg-yellow-600 border-2 border-yellow-300 npc-shadow";
            icon = <FaBoxOpen className="text-yellow-900" size={20} />;
            break;
          case 'alchemy_furnace':
            entityStyle = "bg-orange-700 border-2 border-orange-400 item-shadow";
            icon = <GiFireBowl className="text-orange-200" size={24} />;
            break;
        }
    }
  }

  return (
    <div
      className={`${baseClasses} ${entityStyle}`}
      style={{
        left: `${entity.position.x}px`,
        top: `${entity.position.y}px`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title={title}
    >
      {icon}
    </div>
  );
};

export default GameEntity;