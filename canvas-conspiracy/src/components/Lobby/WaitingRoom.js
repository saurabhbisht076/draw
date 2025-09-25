import React, { useState } from 'react';
import { Users, UserPlus, Home, Play, Copy, CheckCircle } from 'lucide-react';
import Button from '../UI/Button';
import PlayerCard from '../UI/PlayerCard';

const WaitingRoom = ({ players, roomCode, isHost, currentPlayerId, onStartGame, onLeaveRoom, loading }) => {
  const [copied, setCopied] = useState(false);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mark current user and host in players array
  const processedPlayers = players.map((player, index) => ({
    ...player,
    isCurrentUser: player.id === currentPlayerId,
    isHost: index === 0 || player.isHost // Assuming first player or marked as host
  }));

  const canStartGame = processedPlayers.length >= 3;

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
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
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

      <div className="relative z-10 min-h-screen p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Header Section - Enhanced */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Waiting Room
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-2">
              <span className="text-gray-200 text-lg font-medium drop-shadow-sm">Room Code:</span>
              <button 
                onClick={copyRoomCode}
                className="flex items-center gap-3 px-6 py-3 bg-white/15 backdrop-blur-lg rounded-xl text-white font-mono text-2xl hover:bg-white/25 transition-all duration-200 border border-white/30 hover:border-white/40 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-lg"
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
            <p className="text-gray-300 drop-shadow-sm">Share this code with your friends!</p>
          </div>

          {/* Main Players Card - Enhanced glass effect */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl mb-8 hover:bg-white/15 transition-all duration-300">
            <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3 drop-shadow-sm">
              <div className="p-2 bg-blue-500/30 rounded-xl backdrop-blur-sm">
                <Users className="w-8 h-8 text-blue-200" />
              </div>
              Players ({processedPlayers.length}/8)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {processedPlayers.map((player) => (
                <div key={player.id} className="transform hover:scale-105 transition-all duration-200">
                  <PlayerCard 
                    player={player} 
                    isHost={player.isHost}
                    isCurrentUser={player.isCurrentUser}
                    className="backdrop-blur-sm bg-white/10 border border-white/20 shadow-lg"
                  />
                </div>
              ))}
              
              {/* Empty slots - Enhanced */}
              {Array.from({ length: Math.max(0, 8 - processedPlayers.length) }).map((_, index) => (
                <div 
                  key={`empty-${index}`} 
                  className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border-2 border-dashed border-white/30 flex items-center justify-center hover:bg-white/10 transition-all duration-200 shadow-lg"
                >
                  <div className="text-gray-300 text-center">
                    <UserPlus className="w-8 h-8 mx-auto mb-2 opacity-60" />
                    <span className="text-sm font-medium">Waiting for player...</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons - Enhanced */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <Button 
                variant="secondary" 
                onClick={onLeaveRoom}
                disabled={loading}
                className="bg-red-500/30 hover:bg-red-500/40 border-red-400/40 text-white px-6 py-3 text-lg shadow-lg backdrop-blur-sm disabled:opacity-50"
              >
                <Home className="w-5 h-5 mr-2" />
                Leave Room
              </Button>
              
              {isHost && (
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={onStartGame}
                  disabled={loading || !canStartGame}
                  className={`px-8 py-4 text-xl font-bold shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                    canStartGame 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
                      : 'bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Starting...
                    </div>
                  ) : (
                    <>
                      <Play className="w-6 h-6 mr-3" />
                      {canStartGame 
                        ? 'Start Game - Ready!' 
                        : `Start Game - Need ${3 - processedPlayers.length} more`
                      }
                    </>
                  )}
                </Button>
              )}
              
              {!isHost && (
                <div className="text-center text-gray-300 px-8 py-4 text-lg drop-shadow-sm">
                  Waiting for host to start the game...
                </div>
              )}
            </div>
          </div>

          {/* Status Indicator - Enhanced */}
          <div className="text-center">
            <div className={`inline-flex items-center gap-3 px-6 py-3 backdrop-blur-sm rounded-2xl border shadow-lg ${
              canStartGame
                ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-400/30'
                : 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-400/30'
            }`}>
              <div className={`w-3 h-3 rounded-full animate-pulse shadow-lg ${
                canStartGame ? 'bg-green-400' : 'bg-yellow-400'
              }`}></div>
              <span className="font-medium drop-shadow-sm">
                {canStartGame
                  ? isHost 
                    ? 'Ready to start! Click Start Game when everyone is ready.'
                    : 'Ready to start! Waiting for host...' 
                  : 'Waiting for more players...'
                }
              </span>
            </div>
            
            {/* Player count indicator */}
            <div className="mt-4 flex justify-center">
              <div className="flex items-center gap-2">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div 
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index < processedPlayers.length 
                        ? 'bg-green-400 shadow-lg' 
                        : index < 3 
                        ? 'bg-red-400/50' 
                        : 'bg-gray-500/30'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 drop-shadow-sm">
              {!canStartGame ? 'Minimum 3 players required' : 'Game ready to start!'}
            </p>

            {/* Additional info for players */}
            {processedPlayers.length > 0 && (
              <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <p className="text-gray-300 text-sm drop-shadow-sm">
                  {processedPlayers.length === 1 
                    ? 'You are the only player in the room. Share the room code to invite friends!'
                    : `${processedPlayers.length} players joined. ${
                        canStartGame ? 'Ready to play!' : `Need ${3 - processedPlayers.length} more to start.`
                      }`
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;