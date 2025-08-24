import React, { useState } from 'react';
import { Palette, CheckCircle, Trophy, Users, Target, Clock, Sparkles } from 'lucide-react';
import { GamePhase, PowerUpType } from '../../types/gameTypes';
import CanvasStage from '../Canvas/CanvasStage';
import Timer from '../UI/Timer';
import Button from '../UI/Button';
import PowerUp from '../UI/PowerUp';

const GameScreen = ({ phase, currentPrompt, players, onPhaseComplete, timeLeft }) => {
  const [story, setStory] = useState('');
  const [selectedStory, setSelectedStory] = useState(null);
  const [powerUps, setPowerUps] = useState({
    [PowerUpType.EXTRA_TIME]: 1,
    [PowerUpType.COLOR_BOMB]: 1,
    [PowerUpType.HINT]: 2,
    [PowerUpType.FREEZE]: 1
  });

  const usePowerUp = (type) => {
    if (powerUps[type] > 0) {
      setPowerUps(prev => ({ ...prev, [type]: prev[type] - 1 }));
      // Handle power-up logic here
    }
  };

  const mockStories = [
    "A brave knight discovers that his trusty steed is actually afraid of mice, leading to hilarious adventures in the kingdom.",
    "An intergalactic chef tries to perfect the ultimate pizza recipe while dealing with alien customers who have very strange taste preferences.",
    "A time-traveling librarian accidentally changes history by returning books to the wrong time periods."
  ];

  // Common background component
 const GameBackground = ({ children }) => (
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
        {children}
      </div>
    </div>
  );

  if (phase === GamePhase.DRAWING) {
    return (
      <GameBackground>
        <div className="max-w-5xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 lg:gap-4 mb-4 lg:mb-6 p-3 lg:p-4 bg-white/10 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/20 shadow-lg">
            <Timer timeLeft={timeLeft} isActive={true} />
            <div className="flex flex-wrap gap-2">
              {Object.entries(powerUps).map(([type, count]) => (
                <PowerUp key={type} type={type} count={count} onUse={usePowerUp} />
              ))}
            </div>
          </div>
          
          <CanvasStage
            prompt={currentPrompt}
            onComplete={onPhaseComplete}
            timeLeft={timeLeft}
          />
        </div>
      </GameBackground>
    );
  }

  if (phase === GamePhase.STORYTELLING) {
    return (
      <GameBackground>
        <div className="max-w-4xl mx-auto w-full">
          {/* Header Section - Compact */}
          <div className="text-center mb-6 lg:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl lg:rounded-2xl mb-3 lg:mb-4 shadow-lg">
              <Palette className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div>
            <Timer timeLeft={timeLeft} isActive={true} className="mx-auto mb-3 lg:mb-4" />
            <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-3 lg:mb-4 drop-shadow-lg">
              Tell a Story! 📝
            </h1>
            <p className="text-gray-200 text-base lg:text-lg drop-shadow-sm">
              Write a creative story about this drawing:
            </p>
          </div>

          {/* Main Content Card - More Compact */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl mb-6 lg:mb-8">
            {/* Drawing Display Area - Smaller */}
            <div className="w-full h-48 lg:h-64 bg-white/5 backdrop-blur-sm rounded-xl lg:rounded-2xl mb-4 lg:mb-6 flex items-center justify-center border border-white/20 shadow-inner">
              <div className="text-gray-300 text-center">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-purple-500/20 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-2 lg:mb-3">
                  <Palette className="w-6 h-6 lg:w-8 lg:h-8 text-purple-300" />
                </div>
                <p className="text-base lg:text-lg font-medium">Player's Drawing</p>
                <p className="text-sm text-gray-400">Analyzing this masterpiece...</p>
              </div>
            </div>

            {/* Story Input - Compact */}
            <div className="space-y-3 lg:space-y-4">
              <label className="block text-white font-semibold mb-2 text-base lg:text-lg">
                Your Creative Story:
              </label>
              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Write your creative story here... What's happening in this drawing? Be imaginative!"
                className="w-full h-28 lg:h-32 px-4 lg:px-5 py-3 lg:py-4 rounded-xl lg:rounded-2xl bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 border border-white/20 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 resize-none transition-all duration-200 text-base lg:text-lg"
                maxLength={500}
              />
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${story.length > 450 ? 'text-red-400' : 'text-gray-400'}`}>
                    {story.length}/500 characters
                  </span>
                  {story.length > 400 && (
                    <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full">
                      Almost full!
                    </span>
                  )}
                </div>
                <Button 
                  onClick={() => onPhaseComplete(story)} 
                  disabled={!story.trim()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-4 lg:px-6 py-2 lg:py-3 text-base lg:text-lg font-bold shadow-lg w-full sm:w-auto"
                >
                  <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                  Submit Story
                </Button>
              </div>
            </div>
          </div>

          {/* Tips Section - Compact */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 lg:px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg lg:rounded-xl border border-white/20 text-white text-xs lg:text-sm">
              <Sparkles className="w-3 h-3 lg:w-4 lg:h-4 text-purple-300" />
              <span>Tip: Be creative and descriptive! Other players will vote on your story.</span>
            </div>
          </div>
        </div>
      </GameBackground>
    );
  }

  if (phase === GamePhase.VOTING) {
    return (
      <GameBackground>
        <div className="max-w-4xl mx-auto w-full">
          {/* Header Section - Compact */}
          <div className="text-center mb-6 lg:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl lg:rounded-2xl mb-3 lg:mb-4 shadow-lg">
              <CheckCircle className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div>
            <Timer timeLeft={timeLeft} isActive={true} className="mx-auto mb-3 lg:mb-4" />
            <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-3 lg:mb-4 drop-shadow-lg">
              Vote for the Best Story! 🗳️
            </h1>
            <p className="text-gray-200 text-base lg:text-lg drop-shadow-sm mb-3 lg:mb-4">
              Which story best matches the original prompt?
            </p>
            <div className="inline-block p-3 lg:p-4 bg-purple-500/20 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-purple-400/30 shadow-lg">
              <span className="text-purple-300 font-semibold text-sm lg:text-base">Original Prompt: </span>
              <span className="text-white font-bold text-base lg:text-lg">"{currentPrompt}"</span>
            </div>
          </div>

          {/* Stories Grid - More Compact */}
          <div className="grid gap-4 lg:gap-6 mb-6 lg:mb-8">
            {mockStories.map((storyText, index) => (
              <div
                key={index}
                onClick={() => setSelectedStory(index)}
                className={`p-4 lg:p-6 rounded-2xl lg:rounded-3xl border-2 cursor-pointer transition-all duration-200 transform hover:scale-102 ${
                  selectedStory === index
                    ? 'bg-purple-500/30 border-purple-400 shadow-lg shadow-purple-500/25 scale-102'
                    : 'bg-white/10 border-white/20 hover:bg-white/15'
                } backdrop-blur-xl`}
              >
                <div className="flex items-start gap-3 lg:gap-4">
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center font-bold text-base lg:text-lg shadow-lg ${
                    selectedStory === index 
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white' 
                      : 'bg-white/20 text-gray-300'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div className="flex-1">
                    <p className="text-white leading-relaxed text-base lg:text-lg">{storyText}</p>
                    {selectedStory === index && (
                      <div className="mt-2 lg:mt-3 flex items-center gap-2 text-purple-300">
                        <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                        <span className="font-medium text-sm lg:text-base">Selected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="text-center mb-4 lg:mb-6">
            <Button 
              onClick={() => onPhaseComplete(selectedStory)} 
              disabled={selectedStory === null}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-6 lg:px-8 py-3 lg:py-4 text-lg lg:text-xl font-bold shadow-xl w-full sm:w-auto"
            >
              <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 mr-2 lg:mr-3" />
              Submit Vote
            </Button>
          </div>

          {/* Voting Tips - Compact */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 lg:px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg lg:rounded-xl border border-white/20 text-white text-xs lg:text-sm">
              <Target className="w-3 h-3 lg:w-4 lg:h-4 text-green-300" />
              <span>Choose the story that best captures the original prompt!</span>
            </div>
          </div>
        </div>
      </GameBackground>
    );
  }

  if (phase === GamePhase.RESULTS) {
    return (
      <GameBackground>
        <div className="max-w-5xl mx-auto w-full">
          {/* Header Section - Compact */}
          <div className="text-center mb-6 lg:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl lg:rounded-3xl mb-4 lg:mb-6 shadow-xl">
              <Trophy className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 lg:mb-4 drop-shadow-lg">
              Round Results! 🎉
            </h1>
            <p className="text-gray-200 text-lg lg:text-xl drop-shadow-sm">
              See how everyone performed this round
            </p>
          </div>

          {/* Results Grid - More Compact */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
            
            {/* Leaderboard - Compact */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6">
                <div className="p-2 bg-yellow-500/20 rounded-lg lg:rounded-xl backdrop-blur-sm">
                  <Trophy className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-300" />
                </div>
                <h2 className="text-lg lg:text-2xl font-bold text-white drop-shadow-sm">
                  🏆 Leaderboard
                </h2>
              </div>
              
              <div className="space-y-3 lg:space-y-4">
                {players.map((player, index) => (
                  <div key={player.id} className={`flex items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-xl lg:rounded-2xl transition-all duration-200 hover:scale-105 ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border border-yellow-500/40 shadow-lg' :
                    index === 1 ? 'bg-gradient-to-r from-gray-400/30 to-gray-500/30 border border-gray-400/40 shadow-lg' :
                    index === 2 ? 'bg-gradient-to-r from-orange-600/30 to-red-600/30 border border-orange-600/40 shadow-lg' :
                    'bg-white/10 backdrop-blur-sm border border-white/20'
                  }`}>
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center font-bold text-base lg:text-lg shadow-lg ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white' :
                      index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white' :
                      index === 2 ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white' :
                      'bg-white/20 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white text-base lg:text-lg drop-shadow-sm truncate">{player.name}</div>
                      <div className="text-xs lg:text-sm text-gray-300">
                        +{player.roundScore || 0} points this round
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xl lg:text-2xl font-bold text-white drop-shadow-sm">{player.score || 0}</div>
                      <div className="text-xs lg:text-sm text-gray-400">total</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Round Stats - Compact */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6">
                <div className="p-2 bg-blue-500/20 rounded-lg lg:rounded-xl backdrop-blur-sm">
                  <Users className="w-5 h-5 lg:w-6 lg:h-6 text-blue-300" />
                </div>
                <h2 className="text-lg lg:text-2xl font-bold text-white drop-shadow-sm">
                  📊 Round Stats
                </h2>
              </div>
              
              <div className="space-y-4 lg:space-y-6">
                {/* Original Prompt - Compact */}
                <div className="text-center p-4 lg:p-6 bg-purple-500/20 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-purple-400/30">
                  <div className="text-lg lg:text-2xl xl:text-3xl font-bold text-white mb-2 drop-shadow-sm">
                    "{currentPrompt}"
                  </div>
                  <div className="text-purple-300 text-sm lg:text-base font-medium">Original Prompt</div>
                </div>
                
                {/* Stats Grid - Compact */}
                <div className="grid grid-cols-2 gap-3 lg:gap-4">
                  <div className="text-center p-3 lg:p-4 bg-blue-500/20 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-blue-400/30">
                    <div className="text-2xl lg:text-3xl font-bold text-white drop-shadow-sm">3</div>
                    <div className="text-blue-300 text-xs lg:text-sm font-medium">Stories Written</div>
                  </div>
                  <div className="text-center p-3 lg:p-4 bg-green-500/20 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-green-400/30">
                    <div className="text-2xl lg:text-3xl font-bold text-white drop-shadow-sm">2</div>
                    <div className="text-green-300 text-xs lg:text-sm font-medium">Correct Guesses</div>
                  </div>
                </div>

                {/* Best Story - Compact */}
                <div className="p-4 lg:p-6 bg-orange-500/20 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-orange-400/30">
                  <div className="text-center mb-3 lg:mb-4">
                    <div className="text-base lg:text-xl font-bold text-white drop-shadow-sm">🌟 Best Story</div>
                    <div className="text-orange-300 text-xs lg:text-sm font-medium">Most votes received</div>
                  </div>
                  <div className="text-white text-xs lg:text-sm italic leading-relaxed">
                    "A brave knight discovers that his trusty steed is actually afraid of mice..."
                  </div>
                  <div className="text-orange-300 text-xs lg:text-sm mt-2 lg:mt-3 text-center font-medium">
                    - Player Name
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Round Button */}
          <div className="text-center">
            <Button 
              size="lg" 
              onClick={() => onPhaseComplete()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 lg:px-10 py-3 lg:py-4 text-lg lg:text-xl font-bold shadow-xl transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
            >
              <Target className="w-5 h-5 lg:w-6 lg:h-6 mr-2 lg:mr-3" />
              Next Round
            </Button>
          </div>
        </div>
      </GameBackground>
    );
  }

  return null;
};

export default GameScreen;
