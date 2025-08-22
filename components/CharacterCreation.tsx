import React, { useState } from 'react';
import type { PlayerState } from '../types/character';
import { importPlayerState, generateRandomLinhCan } from '../hooks/usePlayerPersistence';
import type { LinhCan } from '../types/linhcan';
import { LINH_CAN_DATA } from '../data/linhcan';
import { getLinhCanTierInfo } from '../services/cultivationService';

interface CharacterCreationProps {
  onCharacterCreate: (name: string, linhCan: LinhCan[], gender: 'Nam' | 'Nữ') => void;
  setPlayerState: React.Dispatch<React.SetStateAction<PlayerState | null>>;
}

const LinhCanDisplay: React.FC<{ linhCan: LinhCan[] }> = ({ linhCan }) => {
    const tierInfo = getLinhCanTierInfo(linhCan);
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-baseline">
                <label className="text-lg text-blue-300 font-semibold">Tiên Thiên Linh Căn</label>
                <span className={`text-lg font-semibold ${tierInfo.color}`}>{tierInfo.name}</span>
            </div>
            <div className="bg-gray-800/50 border border-gray-600 rounded-md p-3 space-y-2">
                {linhCan.map((lc) => {
                    const lcData = LINH_CAN_DATA[lc.type];
                    return (
                        <div key={lc.type} className="flex items-center gap-3 animate-fade-in" title={lcData.description}>
                            <div className="text-2xl w-8 text-center flex-shrink-0">{lcData.icon}</div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="font-semibold text-white text-sm">{lcData.name}</span>
                                    <span className="text-xs text-gray-300">Độ Thuần Khiết: <span className="font-bold text-yellow-300">{lc.purity}</span></span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2 rounded-full" style={{ width: `${lc.purity}%` }}></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onCharacterCreate, setPlayerState }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [message, setMessage] = useState<string | null>(null);
  const [linhCanChoices, setLinhCanChoices] = useState<LinhCan[][] | null>(null);
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);

  const handleGenerateChoices = () => {
    setSelectedChoiceIndex(null); // Reset selection on reroll
    const choices = Array.from({ length: 3 }, () => generateRandomLinhCan());
    setLinhCanChoices(choices);
  };

  const handleStartGame = () => {
    if (!name.trim()) {
        setMessage('Tiên danh không thể để trống.');
        setTimeout(() => setMessage(null), 4000);
        return;
    }
    if (selectedChoiceIndex === null || !linhCanChoices) {
        setMessage('Xin hãy chọn một vận mệnh trước.');
        setTimeout(() => setMessage(null), 4000);
        return;
    }
    onCharacterCreate(name.trim(), linhCanChoices[selectedChoiceIndex], gender);
  };
  
  const handleImportSave = () => {
    importPlayerState((success, msg) => {
        if (success) {
            window.location.reload();
        } else {
            setMessage(msg);
            setTimeout(() => setMessage(null), 4000);
        }
    });
  };

  return (
    <div 
      className="w-screen h-screen bg-gray-900 flex flex-col p-4 sm:p-6 md:p-8 animate-fade-in" 
      style={{ background: 'radial-gradient(ellipse at center, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0) 70%), linear-gradient(to bottom, #1a2a1b, #1a2a1b)' }}
    >
      {/* Header */}
      <div className="text-center mb-4 flex-shrink-0">
        <h1 className="text-4xl md:text-5xl font-bold text-yellow-300 font-serif">Sáng Tạo Vận Mệnh</h1>
        <p className="text-gray-400 mt-2">Định hình con đường tu tiên của bạn. Mỗi huyền thoại đều có một khởi đầu.</p>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col lg:flex-row gap-6 md:gap-8 overflow-hidden">
        
        {/* Left Panel: Character Details */}
        <div className="lg:w-1/3 flex flex-col gap-6 p-6 bg-black/20 rounded-lg border border-yellow-400/30 backdrop-blur-sm">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-lg text-blue-300 font-semibold">Tiên Danh</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên của bạn..."
              className="bg-gray-800/50 border-2 border-gray-600 rounded-md p-3 text-white focus:border-yellow-400 focus:ring-yellow-400 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
              <label className="text-lg text-blue-300 font-semibold">Giới Tính</label>
              <div className="flex gap-4 bg-gray-800/50 border-2 border-gray-600 rounded-md p-3">
                  <label className="flex items-center gap-2 cursor-pointer text-white">
                      <input type="radio" name="gender" value="Nam" checked={gender === 'Nam'} onChange={() => setGender('Nam')} className="w-5 h-5 text-blue-400 bg-gray-700 border-gray-600 focus:ring-blue-500" />
                      Nam
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-white">
                      <input type="radio" name="gender" value="Nữ" checked={gender === 'Nữ'} onChange={() => setGender('Nữ')} className="w-5 h-5 text-pink-400 bg-gray-700 border-gray-600 focus:ring-pink-500" />
                      Nữ
                  </label>
              </div>
          </div>
          
          <div className="mt-auto flex flex-col gap-4">
            <button
                onClick={handleGenerateChoices}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-purple-500/30 border border-indigo-300 transform transition-all duration-200 hover:scale-105"
            >
                {linhCanChoices ? 'Thử Vận May Lần Nữa' : 'Xem Thiên Mệnh'}
            </button>
          </div>
        </div>

        {/* Right Panel: Destiny Choices */}
        <div className="lg:w-2/3 flex flex-col gap-4 bg-black/20 rounded-lg border border-yellow-400/30 p-4 md:p-6 overflow-hidden backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-center text-blue-300 flex-shrink-0">Hãy chọn một vận mệnh</h3>
          {linhCanChoices ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow overflow-y-auto pr-2 scrollbar-thin">
                  {linhCanChoices.map((choice, index) => {
                      const isSelected = selectedChoiceIndex === index;
                      return (
                          <div key={index} className={`p-4 bg-gray-800/60 rounded-lg border-2 flex flex-col transition-all duration-200 ${isSelected ? 'border-yellow-400 ring-2 ring-yellow-400' : 'border-gray-600'}`}>
                              <div className="flex-grow">
                                  <LinhCanDisplay linhCan={choice} />
                              </div>
                              <button onClick={() => setSelectedChoiceIndex(index)} className="w-full mt-4 bg-gray-600 text-white font-bold py-2 rounded-lg hover:bg-gray-500 disabled:bg-yellow-500 disabled:text-yellow-900" disabled={isSelected}>
                                  {isSelected ? 'Đã Chọn' : 'Chọn Vận Mệnh Này'}
                              </button>
                          </div>
                      );
                  })}
              </div>
          ) : (
                <div className="flex-grow flex items-center justify-center text-center p-8 bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-md text-gray-400">
                  <div>
                      <p className="text-lg">Số mệnh của bạn sẽ được quyết định bởi Tiên Thiên Linh Căn.</p>
                      <p>Hãy khám phá nó.</p>
                  </div>
              </div>
          )}
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex-shrink-0 mt-4">
        {message && (
            <p className="text-center text-red-400 mb-2">{message}</p>
        )}
        <div className="flex flex-col sm:flex-row-reverse gap-4 max-w-lg mx-auto">
           <button
                onClick={handleStartGame}
                disabled={!name.trim() || selectedChoiceIndex === null}
                className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-900 font-bold py-3 px-4 rounded-lg shadow-lg shadow-yellow-500/40 border border-yellow-300 transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 text-xl"
                >
                Bắt Đầu Hành Trình
            </button>
            <button
                onClick={handleImportSave}
                className="w-full sm:w-auto bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg border border-gray-500 transform transition-all duration-200 hover:scale-105 text-lg"
            >
                Nhập Dữ Liệu
            </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreation;