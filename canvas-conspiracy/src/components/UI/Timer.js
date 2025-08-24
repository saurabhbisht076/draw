import React from 'react';
import { Timer as TimerIcon } from 'lucide-react';

const Timer = ({ timeLeft, isActive, className = "" }) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold ${className}`}>
      <TimerIcon className="w-5 h-5" />
      <span className="text-lg">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
      {isActive && (
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
      )}
    </div>
  );
};

export default Timer;