import React from 'react';
import { PowerUpType } from '../../types/gameTypes';

const PowerUp = ({ type, count, onUse }) => {
  const powerUps = {
    [PowerUpType.EXTRA_TIME]: { icon: '⏰', name: 'Extra Time', color: 'from-blue-500 to-cyan-500' },
    [PowerUpType.COLOR_BOMB]: { icon: '💥', name: 'Color Bomb', color: 'from-red-500 to-orange-500' },
    [PowerUpType.HINT]: { icon: '💡', name: 'Hint', color: 'from-yellow-500 to-amber-500' },
    [PowerUpType.FREEZE]: { icon: '❄️', name: 'Freeze', color: 'from-cyan-500 to-blue-500' }
  };

  const powerUp = powerUps[type];
  
  return (
    <button
      onClick={() => onUse(type)}
      disabled={count <= 0}
      className={`relative p-3 rounded-xl bg-gradient-to-br ${powerUp.color} text-white shadow-lg hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100`}
    >
      <div className="text-2xl mb-1">{powerUp.icon}</div>
      <div className="text-xs font-semibold">{powerUp.name}</div>
      {count > 0 && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-white text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
          {count}
        </div>
      )}
    </button>
  );
};

export default PowerUp;