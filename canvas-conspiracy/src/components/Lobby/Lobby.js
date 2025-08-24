import React, { useState } from 'react';
import { Settings, Home, Copy, CheckCircle, Play, Users, Clock, Target } from 'lucide-react';
import Button from '../UI/Button';

const Lobby = ({ roomCode, onStartGame, onLeaveRoom, players = [] }) => {
  const [maxPlayers, setMaxPlayers] = useState(6);
  const [roundTime, setRoundTime] = useState(90);
  const [rounds, setRounds] = useState(3);
  const [copied, setCopied] = useState(false);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 120) return `${seconds / 60}m`;
    return `${seconds / 60}min`;
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
          style={{
          background: `linear-gradient(135deg, rgba(41, 36, 97, 0.4) 0%, rgba(162, 103, 218, 0.4) 50%, rgba(28, 11, 19, 0.4) 100%), url('/logo512.png')`,
          backgroundSize: 'cover, 40%',
          backgroundPosition: 'center, center',
          backgroundRepeat: 'no-repeat, no-repeat',
          backgroundAttachment: 'fixed, fixed'
        }}
    >
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        
        {/* Additional subtle logo overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url('/logo512.png')`,
            backgroundSize: '60%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
      </div>

      <div className="relative z-10 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Section - Enhanced with better contrast */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-12">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-lg">
                Game Lobby
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="text-gray-200 text-lg font-medium drop-shadow-sm">Room Code:</span>
                <button 
                  onClick={copyRoomCode}
                  className="flex items-center gap-3 px-6 py-3 bg-white/15 backdrop-blur-lg rounded-xl text-white font-mono text-xl sm:text-2xl hover:bg-white/25 transition-all duration-200 border border-white/30 hover:border-white/40 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-lg"
                  aria-label={`Copy room code ${roomCode}`}
                >
                  <span className="tracking-wider">{roomCode}</span>
                  {copied ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <Copy className="w-6 h-6 text-gray-200" />
                  )}
                </button>
                {copied && (
                  <span className="text-green-400 text-sm font-medium animate-fade-in drop-shadow-sm">
                    Copied!
                  </span>
                )}
              </div>
            </div>
            
            <Button 
              variant="secondary" 
              onClick={onLeaveRoom}
              className="bg-red-500/30 hover:bg-red-500/40 border-red-400/40 text-white px-6 py-3 text-lg shadow-lg backdrop-blur-sm"
            >
              <Home className="w-5 h-5 mr-2" />
              Leave Room
            </Button>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Game Settings Card - Enhanced glass effect */}
            <div className="xl:col-span-1 bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 drop-shadow-sm">
                <div className="p-2 bg-purple-500/30 rounded-xl backdrop-blur-sm">
                  <Settings className="w-6 h-6 text-purple-200" />
                </div>
                Game Settings
              </h2>
              
              <div className="space-y-8">
                {/* Max Players */}
                <div>
                  <label className="block text-white font-semibold mb-3 text-lg flex items-center gap-2 drop-shadow-sm">
                    <Users className="w-5 h-5 text-cyan-300" />
                    Max Players
                  </label>
                  <div className="relative">
                    <select 
                      value={maxPlayers} 
                      onChange={(e) => setMaxPlayers(Number(e.target.value))}
                      className="w-full px-5 py-4 rounded-2xl bg-white/15 backdrop-blur-sm text-white text-lg border border-white/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-200 appearance-none cursor-pointer shadow-lg"
                    >
                      {[3,4,5,6,7,8].map(num => (
                        <option key={num} value={num} className="bg-gray-800 text-white">
                          {num} Players
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Drawing Time */}
                <div>
                  <label className="block text-white font-semibold mb-3 text-lg flex items-center gap-2 drop-shadow-sm">
                    <Clock className="w-5 h-5 text-green-300" />
                    Drawing Time
                  </label>
                  <div className="relative">
                    <select 
                      value={roundTime} 
                      onChange={(e) => setRoundTime(Number(e.target.value))}
                      className="w-full px-5 py-4 rounded-2xl bg-white/15 backdrop-blur-sm text-white text-lg border border-white/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-200 appearance-none cursor-pointer shadow-lg"
                    >
                      <option value={60} className="bg-gray-800">1 Minute</option>
                      <option value={90} className="bg-gray-800">1.5 Minutes</option>
                      <option value={120} className="bg-gray-800">2 Minutes</option>
                      <option value={180} className="bg-gray-800">3 Minutes</option>
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Number of Rounds */}
                <div>
                  <label className="block text-white font-semibold mb-3 text-lg flex items-center gap-2 drop-shadow-sm">
                    <Target className="w-5 h-5 text-orange-300" />
                    Number of Rounds
                  </label>
                  <div className="relative">
                    <select 
                      value={rounds} 
                      onChange={(e) => setRounds(Number(e.target.value))}
                      className="w-full px-5 py-4 rounded-2xl bg-white/15 backdrop-blur-sm text-white text-lg border border-white/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-200 appearance-none cursor-pointer shadow-lg"
                    >
                      {[3,5,7,10].map(num => (
                        <option key={num} value={num} className="bg-gray-800">
                          {num} Rounds
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Start Game Button */}
              <Button 
                variant="primary" 
                size="lg" 
                className="w-full mt-10 py-4 text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl"
                onClick={() => onStartGame({ maxPlayers, roundTime, rounds })}
              >
                <Play className="w-6 h-6 mr-3" />
                Start Game
              </Button>
            </div>

            {/* How to Play Card - Enhanced glass effect */}
            <div className="xl:col-span-2 bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 drop-shadow-sm">
                <div className="p-2 bg-gradient-to-r from-pink-500/30 to-purple-600/30 rounded-xl backdrop-blur-sm">
                  <span className="text-2xl">🎮</span>
                </div>
                How to Play
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    step: 1,
                    title: "Draw",
                    description: "Each player draws the given prompt within the time limit.",
                    color: "from-purple-500 to-purple-600",
                    icon: "🎨"
                  },
                  {
                    step: 2,
                    title: "Tell",
                    description: "Write a creative story about someone else's drawing.",
                    color: "from-pink-500 to-pink-600",
                    icon: "📝"
                  },
                  {
                    step: 3,
                    title: "Guess",
                    description: "Vote for which story matches the original prompt.",
                    color: "from-indigo-500 to-indigo-600",
                    icon: "🤔"
                  },
                  {
                    step: 4,
                    title: "Score",
                    description: "Earn points for correct guesses and creative stories!",
                    color: "from-green-500 to-green-600",
                    icon: "🏆"
                  }
                ].map((item) => (
                  <div key={item.step} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200 shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{item.icon}</span>
                          <h3 className="text-xl font-bold text-white drop-shadow-sm">{item.title}</h3>
                        </div>
                        <p className="text-gray-200 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Game Summary */}
              <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl border border-purple-400/30 shadow-lg">
                <div className="flex flex-wrap items-center justify-center gap-6 text-center">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-300" />
                    <span className="text-white font-medium drop-shadow-sm">{maxPlayers} Max Players</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-300" />
                    <span className="text-white font-medium drop-shadow-sm">{formatTime(roundTime)} per Round</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-orange-300" />
                    <span className="text-white font-medium drop-shadow-sm">{rounds} Total Rounds</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
