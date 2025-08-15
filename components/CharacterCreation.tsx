
import React, { useState } from 'react';
import type { PlayerState } from '../types/character';
import { importPlayerState, generateRandomLinhCan } from '../hooks/usePlayerPersistence';
import type { LinhCan } from '../types/linhcan';
import { LINH_CAN_DATA } from '../data/linhcan';

interface CharacterCreationProps {
  onCharacterCreate: (name: string, useRandomNames: boolean, linhCan: LinhCan[], gender: 'Nam' | 'Nữ') => void;
  setPlayerState: React.Dispatch<React.SetStateAction<PlayerState | null>>;
}

const LinhCanDisplay: React.FC<{ linhCan: LinhCan[] }> = ({ linhCan }) => (
    <div className="flex flex-col gap-2">
        <label className="text-lg text-blue-300 font-semibold">Tiên Thiên Linh Căn</label>
        <div className="bg-gray-800/50 border-2 border-gray-600 rounded-md p-4 space-y-3">
            {linhCan.map((lc) => {
                const lcData = LINH_CAN_DATA[lc.type];
                return (
                    <div key={lc.type} className="flex items-center gap-4 animate-fade-in" title={lcData.description}>
                        <div className="text-3xl w-8 text-center flex-shrink-0">{lcData.icon}</div>
                        <div className="flex-grow">
                            <div className="flex justify-between items-baseline mb-1">
                                <span className="font-semibold text-white">{lcData.name}</span>
                                <span className="text-sm text-gray-300">Độ Thuần Khiết: <span className="font-bold text-yellow-300">{lc.purity}</span></span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2.5 rounded-full" style={{ width: `${lc.purity}%` }}></div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onCharacterCreate, setPlayerState }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [message, setMessage] = useState<string | null>(null);
  const [useRandomNames, setUseRandomNames] = useState(false);
  const [generatedLinhCan, setGeneratedLinhCan] = useState<LinhCan[] | null>(null);


  const handleGenerateLinhCan = () => {
    setGeneratedLinhCan(generateRandomLinhCan());
  };

  const handleStartGame = () => {
    if (!name.trim()) {
        setMessage('Tiên danh không thể để trống.');
        setTimeout(() => setMessage(null), 4000);
        return;
    }
    if (!generatedLinhCan) {
        setMessage('Xin hãy khám phá linh căn của bạn trước.');
        setTimeout(() => setMessage(null), 4000);
        return;
    }
    onCharacterCreate(name.trim(), useRandomNames, generatedLinhCan, gender);
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
    <div className="w-screen h-screen bg-gray-900 flex items-center justify-center p-4" style={{ background: 'radial-gradient(ellipse at center, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0) 70%), linear-gradient(to bottom, #1a2a1b, #1a2a1b)' }}>
      <div className="w-full max-w-2xl bg-gray-900/80 border-2 border-yellow-400/50 rounded-lg shadow-2xl shadow-yellow-500/20 p-8 flex flex-col gap-6 animate-fade-in backdrop-blur-sm">
        <h1 className="text-4xl font-bold text-yellow-300 text-center font-serif">Sáng Tạo Vận Mệnh</h1>
        <p className="text-center text-gray-400">Định hình con đường tu tiên của bạn. Mỗi huyền thoại đều có một khởi đầu.</p>

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

        <div className="flex flex-col gap-4">
            {generatedLinhCan ? (
                <LinhCanDisplay linhCan={generatedLinhCan} />
            ) : (
                 <div className="text-center p-8 bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-md text-gray-400">
                    <p className="text-lg">Số mệnh của bạn sẽ được quyết định bởi Tiên Thiên Linh Căn.</p>
                    <p>Hãy khám phá nó.</p>
                </div>
            )}
            <button
                onClick={handleGenerateLinhCan}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-purple-500/30 border border-indigo-300 transform transition-all duration-200 hover:scale-105"
            >
                {generatedLinhCan ? 'Thử Vận May Lần Nữa' : 'Khám Phá Linh Căn'}
            </button>
        </div>
        
        <div className="flex items-center gap-3">
            <input
                type="checkbox"
                id="randomNames"
                checked={useRandomNames}
                onChange={(e) => setUseRandomNames(e.target.checked)}
                className="h-5 w-5 rounded border-gray-500 text-yellow-400 focus:ring-yellow-500 bg-gray-700"
            />
            <label htmlFor="randomNames" className="text-gray-300 select-none">Sử dụng tên địa danh ngẫu nhiên</label>
        </div>

        <div className="flex flex-col sm:flex-row-reverse gap-4 mt-2">
            <button
                onClick={handleStartGame}
                disabled={!name.trim() || !generatedLinhCan}
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

        {message && (
            <p className="text-center text-red-400 mt-2">{message}</p>
        )}
      </div>
    </div>
  );
};

export default CharacterCreation;