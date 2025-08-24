import React from 'react';
import { Users, Trophy, Clock, Crown, Medal, Award } from 'lucide-react';
import PlayerCard from '../UI/PlayerCard';

const GameBoard = ({ players, currentRound, maxRounds, timeLeft, currentPhase }) => {
  const getPhaseDisplay = (phase) => {
    switch (phase) {
      case 'drawing':
        return { text: 'Drawing Phase', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-500/20', icon: '🎨' };
      case 'storytelling':
        return { text: 'Storytelling Phase', color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-500/20', icon: '📝' };
      case 'voting':
        return { text: 'Voting Phase', color: 'from-green-500 to-green-600', bgColor: 'bg-green-500/20', icon: '🗳️' };
      case 'results':
        return { text: 'Results', color: 'from-yellow-500 to-yellow-600', bgColor: 'bg-yellow-500/20', icon: '🏆' };
      default:
        return { text: 'Game Phase', color: 'from-gray-500 to-gray-600', bgColor: 'bg-gray-500/20', icon: '🎮' };
    }
  };

  const phaseInfo = getPhaseDisplay(currentPhase);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft > 60) return 'text-green-400 bg-green-500/20 border-green-400/30';
    if (timeLeft > 30) return 'text-yellow-400 bg-yellow-500/20 border-yellow-400/30';
    return 'text-red-400 bg-red-500/20 border-red-400/30 animate-pulse';
  };

  const getLeaderboardIcon = (index) => {
    switch (index) {
      case 0: return <Crown className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-400" />;
      case 1: return <Medal className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />;
      case 2: return <Award className="w-4 h-4 lg:w-5 lg:h-5 text-orange-400" />;
      default: return null;
    }
  };

  const getLeaderboardBadge = (index) => {
    switch (index) {
      case 0: return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg';
      case 1: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg';
      case 2: return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg';
      default: return 'bg-white/20 text-white';
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Fixed Background */}
      <div 
        className="fixed inset-0 w-full h-full"
        style={{
          background: `
            linear-gradient(135deg, rgba(41, 36, 97, 0.85) 0%, rgba(162, 103, 218, 0.85) 50%, rgba(28, 11, 19, 0.85) 100%)
          `,
          zIndex: -2
        }}
      />
      
      {/* Logo Background Layer */}
      <div 
        className="fixed inset-0 w-full h-full opacity-10"
        style={{
          backgroundImage: `url('/logo512.png')`,
          backgroundSize: 'min(40vw, 40vh)',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: -1
        }}
      />

      {/* Enhanced Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col justify-center py-4 px-4 sm:px-6 lg:px-8">
        {/* Better Constrained Container */}
        <div className="w-full max-w-5xl mx-auto">
          
          {/* Header Section - Compact */}
          <div className="text-center mb-4 lg:mb-6">
            <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-2 drop-shadow-lg">
              Game in Progress
            </h1>
            <p className="text-gray-300 drop-shadow-sm text-sm lg:text-base">
              Follow along as players create and compete!
            </p>
          </div>

          {/* Main Game Board Container */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
            
            {/* Game Status Header - More Compact */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 lg:gap-4 mb-6 lg:mb-8 p-3 lg:p-4 bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-white/20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className={`px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r ${phaseInfo.color} rounded-xl lg:rounded-2xl text-white font-bold flex items-center gap-2 lg:gap-3 shadow-lg`}>
                  <span className="text-lg lg:text-2xl">{phaseInfo.icon}</span>
                  <span className="text-sm lg:text-lg">{phaseInfo.text}</span>
                </div>
                <div className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-indigo-500/20 backdrop-blur-sm rounded-lg lg:rounded-xl text-indigo-200 border border-indigo-400/30">
                  <Trophy className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="font-semibold text-sm lg:text-base">
                    Round {currentRound} of {maxRounds}
                  </span>
                </div>
              </div>
              
              {timeLeft > 0 && (
                <div className={`flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 backdrop-blur-sm rounded-xl lg:rounded-2xl border shadow-lg ${getTimeColor()}`}>
                  <Clock className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="font-mono text-base lg:text-lg font-bold">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              )}
            </div>

            {/* Players Grid - More Compact */}
            <div className="mb-6 lg:mb-8">
              <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6">
                <div className="p-2 bg-blue-500/20 rounded-lg lg:rounded-xl backdrop-blur-sm">
                  <Users className="w-5 h-5 lg:w-6 lg:h-6 text-blue-300" />
                </div>
                <h3 className="text-lg lg:text-2xl font-bold text-white drop-shadow-sm">
                  Players ({players.length})
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4 max-h-[50vh] overflow-y-auto">
                {players.map((player, index) => (
                  <div key={player.id} className="relative transform hover:scale-105 transition-all duration-200">
                    <PlayerCard 
                      player={player} 
                      isHost={index === 0}
                      isCurrentUser={player.isCurrentUser}
                      className="backdrop-blur-sm bg-white/10 border border-white/20 shadow-lg"
                    />
                    
                    {/* Enhanced Player Status Indicator - Smaller */}
                    <div className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2">
                      {player.status === 'drawing' && (
                        <div className="flex items-center justify-center w-6 h-6 lg:w-8 lg:h-8 bg-blue-500 rounded-full animate-pulse shadow-lg border-2 border-white" title="Drawing">
                          <span className="text-white text-xs font-bold">🎨</span>
                        </div>
                      )}
                      {player.status === 'writing' && (
                        <div className="flex items-center justify-center w-6 h-6 lg:w-8 lg:h-8 bg-purple-500 rounded-full animate-pulse shadow-lg border-2 border-white" title="Writing Story">
                          <span className="text-white text-xs font-bold">📝</span>
                        </div>
                      )}
                      {player.status === 'voting' && (
                        <div className="flex items-center justify-center w-6 h-6 lg:w-8 lg:h-8 bg-green-500 rounded-full animate-pulse shadow-lg border-2 border-white" title="Voting">
                          <span className="text-white text-xs font-bold">🗳️</span>
                        </div>
                      )}
                      {player.status === 'done' && (
                        <div className="flex items-center justify-center w-6 h-6 lg:w-8 lg:h-8 bg-yellow-500 rounded-full shadow-lg border-2 border-white" title="Finished">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                      )}
                    </div>

                    {/* Host Crown - Smaller */}
                    {index === 0 && (
                      <div className="absolute -top-2 -left-2 lg:-top-3 lg:-left-3">
                        <div className="flex items-center justify-center w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full shadow-lg border-2 border-white">
                          <Crown className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Leaderboard - More Compact */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-white/20">
              <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6">
                <div className="p-2 bg-yellow-500/20 rounded-lg lg:rounded-xl backdrop-blur-sm">
                  <Trophy className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-300" />
                </div>
                <h3 className="text-lg lg:text-2xl font-bold text-white drop-shadow-sm">
                  Current Standings
                </h3>
              </div>
              
              <div className="space-y-2 lg:space-y-3 max-h-[30vh] overflow-y-auto">
                {players
                  .sort((a, b) => (b.score || 0) - (a.score || 0))
                  .slice(0, 5)
                  .map((player, index) => (
                    <div key={player.id} className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-200 shadow-lg">
                      <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-xl lg:rounded-2xl flex items-center justify-center font-bold text-sm lg:text-lg ${getLeaderboardBadge(index)}`}>
                        {index < 3 ? getLeaderboardIcon(index) : index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white font-bold text-sm lg:text-lg drop-shadow-sm truncate">{player.name}</span>
                          {index === 0 && <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full flex-shrink-0">Leader</span>}
                          {player.isCurrentUser && <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full flex-shrink-0">You</span>}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-white font-bold text-lg lg:text-xl font-mono">{player.score || 0}</div>
                        <div className="text-gray-400 text-xs">points</div>
                      </div>
                    </div>
                  ))}
                
                {/* Show remaining players count if more than 5 */}
                {players.length > 5 && (
                  <div className="text-center py-2">
                    <span className="text-gray-400 text-sm">
                      +{players.length - 5} more players
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Game Tips - Compact */}
          <div className="mt-4 lg:mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 lg:px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg lg:rounded-xl border border-white/20 text-white text-xs lg:text-sm">
              <span>💡</span>
              <span>
                {currentPhase === 'drawing' && 'Players are creating their masterpieces!'}
                {currentPhase === 'storytelling' && 'Time for creative storytelling!'}
                {currentPhase === 'voting' && 'Players are making their choices!'}
                {currentPhase === 'results' && 'See how everyone performed!'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;