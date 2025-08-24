import React from 'react';
import { Crown } from 'lucide-react';

const PlayerCard = ({ player, isHost = false, isCurrentUser = false }) => {
  return (
    <div className={`p-4 rounded-xl bg-gradient-to-br ${isCurrentUser ? 'from-purple-500 to-pink-500' : 'from-gray-700 to-gray-800'} text-white shadow-lg transform hover:scale-105 transition-all duration-200`}>
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${isCurrentUser ? 'bg-white text-purple-600' : 'bg-purple-500'}`}>
          {player.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{player.name}</span>
            {isHost && <Crown className="w-4 h-4 text-yellow-400" />}
          </div>
          <div className="text-sm opacity-75">
            Score: {player.score || 0}
          </div>
        </div>
        <div className={`w-3 h-3 rounded-full ${player.online ? 'bg-green-400' : 'bg-gray-400'}`}></div>
      </div>
    </div>
  );
};

export default PlayerCard;