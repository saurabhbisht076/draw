import React, { useState, useEffect } from 'react';
import { UserPlus, Play, Palette } from 'lucide-react';
import Button from '../UI/Button';

const Home = ({ onCreateRoom, onJoinRoom }) => {
  const [joinCode, setJoinCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [errors, setErrors] = useState({});

  // Handle Enter key press
  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      if (action === 'create' && playerName.trim()) {
        onCreateRoom(playerName);
      } else if (action === 'join' && playerName.trim() && joinCode) {
        onJoinRoom(playerName, joinCode);
      }
    }
  };

  // Clear errors when user starts typing
  useEffect(() => {
    if (playerName.trim()) {
      setErrors(prev => ({ ...prev, playerName: false }));
    }
  }, [playerName]);

  useEffect(() => {
    if (joinCode) {
      setErrors(prev => ({ ...prev, joinCode: false }));
    }
  }, [joinCode]);

  return (
    <div 
      className="min-h-screen flex justify-center items-center px-4 sm:px-6 lg:px-8 relative"
         style={{
          background: `linear-gradient(135deg, rgba(41, 36, 97, 0.4) 0%, rgba(162, 103, 218, 0.4) 50%, rgba(28, 11, 19, 0.4) 100%), url('/logo512.png')`,
          backgroundSize: 'cover, 40%',
          backgroundPosition: 'center, center',
          backgroundRepeat: 'no-repeat, no-repeat',
          backgroundAttachment: 'fixed, fixed'
        }}

    >
        
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      
      {/* Decorative elements (optional - can be removed if image is busy) */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main Container - Properly Centered */}
      <div className="relative z-10 w-full max-w-md">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Palette className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Canvas Conspiracy
          </h1>
          
          <p className="text-gray-200 text-sm sm:text-base mb-2 drop-shadow-md">
            Draw, Tell, Guess & Win!
          </p>
          
          <p className="text-gray-300 text-xs sm:text-sm drop-shadow-md">
            A multiplayer drawing & storytelling game
          </p>
        </div>

        {/* Main Card with Enhanced Glass Effect */}
        <div className="w-full px-6 py-8 bg-white/10 rounded-xl backdrop-blur-lg border border-white/20 shadow-2xl">
          
          {/* Form with Proper Spacing */}
          <div className="space-y-6">
            
            {/* Player Name Input with Accessibility */}
            <div>
              <label 
                htmlFor="playerName" 
                className="block text-white font-medium mb-2 text-sm drop-shadow-sm"
              >
                Player Name
              </label>
              <input
                id="playerName"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'create')}
                placeholder="Enter your name..."
                maxLength={20}
                className={`w-full p-3 rounded-lg border ${
                  errors.playerName 
                    ? 'border-red-400 focus:ring-red-400' 
                    : 'border-gray-500 focus:ring-cyan-400'
                } bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 transition-all duration-200 backdrop-blur-sm`}
                aria-describedby={errors.playerName ? "playerName-error" : undefined}
              />
              {errors.playerName && (
                <p id="playerName-error" className="text-red-400 text-xs mt-1">
                  Please enter your name
                </p>
              )}
            </div>

            {/* Create Room Button with Clear Hierarchy */}
            <button
              onClick={() => {
                if (!playerName.trim()) {
                  setErrors(prev => ({ ...prev, playerName: true }));
                  return;
                }
                onCreateRoom(playerName);
              }}
              className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-transparent shadow-lg"
              disabled={!playerName.trim()}
            >
              <UserPlus className="w-5 h-5 inline mr-2" />
              Create New Room
            </button>

            {/* Proper OR Divider */}
            <div className="flex items-center justify-center my-6">
              <hr className="flex-grow border-t border-gray-400" />
              <span className="mx-4 text-gray-200 text-sm font-medium drop-shadow-sm">OR</span>
              <hr className="flex-grow border-t border-gray-400" />
            </div>

            {/* Join Room Section */}
            <div className="space-y-4">
              <label 
                htmlFor="joinCode" 
                className="block text-white font-medium mb-2 text-sm drop-shadow-sm"
              >
                Room Code
              </label>
              <input
                id="joinCode"
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                onKeyPress={(e) => handleKeyPress(e, 'join')}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className={`w-full p-3 rounded-lg border ${
                  errors.joinCode 
                    ? 'border-red-400 focus:ring-red-400' 
                    : 'border-gray-500 focus:ring-purple-400'
                } bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 transition-all duration-200 text-center font-mono tracking-widest backdrop-blur-sm`}
                aria-describedby={errors.joinCode ? "joinCode-error" : undefined}
              />
              {errors.joinCode && (
                <p id="joinCode-error" className="text-red-400 text-xs mt-1">
                  Please enter a room code
                </p>
              )}
              
              {/* Secondary Button with Different Hierarchy */}
              <button
                onClick={() => {
                  if (!playerName.trim()) {
                    setErrors(prev => ({ ...prev, playerName: true }));
                    return;
                  }
                  if (!joinCode) {
                    setErrors(prev => ({ ...prev, joinCode: true }));
                    return;
                  }
                  onJoinRoom(playerName, joinCode);
                }}
                className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-transparent shadow-lg"
                disabled={!playerName.trim() || !joinCode}
              >
                <Play className="w-5 h-5 inline mr-2" />
                Join Room
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-6">
          <p className="text-gray-200 text-xs sm:text-sm drop-shadow-sm">
            Need 3-8 players for the best experience
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
