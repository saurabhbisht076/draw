import React, { useState, useEffect } from 'react';
import { UserPlus, Play, Palette } from 'lucide-react';
import Button from '../UI/Button';

const Home = ({ onCreateRoom, onJoinRoom, loading, error }) => {
  // Create room state
  const [createPlayerName, setCreatePlayerName] = useState('');
  
  // Join room state
  const [joinPlayerName, setJoinPlayerName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  
  const [errors, setErrors] = useState({});
  const [localLoading, setLocalLoading] = useState(false);

  // Handle Enter key press
  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter' && !loading && !localLoading) {
      if (action === 'create' && createPlayerName.trim()) {
        handleCreateRoom();
      } else if (action === 'join' && joinPlayerName.trim() && joinCode) {
        handleJoinRoom();
      }
    }
  };

  // Clear errors when user starts typing - Create form
  useEffect(() => {
    if (createPlayerName.trim()) {
      setErrors(prev => ({ ...prev, createPlayerName: false }));
    }
  }, [createPlayerName]);

  // Clear errors when user starts typing - Join form
  useEffect(() => {
    if (joinPlayerName.trim()) {
      setErrors(prev => ({ ...prev, joinPlayerName: false }));
    }
  }, [joinPlayerName]);

  useEffect(() => {
    if (joinCode) {
      setErrors(prev => ({ ...prev, joinCode: false }));
    }
  }, [joinCode]);

  const validateCreatePlayerName = () => {
    if (!createPlayerName.trim()) {
      setErrors(prev => ({ ...prev, createPlayerName: 'Please enter your name' }));
      return false;
    }
    if (createPlayerName.trim().length < 2) {
      setErrors(prev => ({ ...prev, createPlayerName: 'Name must be at least 2 characters' }));
      return false;
    }
    if (createPlayerName.trim().length > 20) {
      setErrors(prev => ({ ...prev, createPlayerName: 'Name must be less than 20 characters' }));
      return false;
    }
    return true;
  };

  const validateJoinPlayerName = () => {
    if (!joinPlayerName.trim()) {
      setErrors(prev => ({ ...prev, joinPlayerName: 'Please enter your name' }));
      return false;
    }
    if (joinPlayerName.trim().length < 2) {
      setErrors(prev => ({ ...prev, joinPlayerName: 'Name must be at least 2 characters' }));
      return false;
    }
    if (joinPlayerName.trim().length > 20) {
      setErrors(prev => ({ ...prev, joinPlayerName: 'Name must be less than 20 characters' }));
      return false;
    }
    return true;
  };

  const validateJoinCode = () => {
    if (!joinCode.trim()) {
      setErrors(prev => ({ ...prev, joinCode: 'Please enter a room code' }));
      return false;
    }
    if (joinCode.trim().length !== 6) {
      setErrors(prev => ({ ...prev, joinCode: 'Room code must be 6 characters' }));
      return false;
    }
    return true;
  };

  const handleCreateRoom = async () => {
    if (!validateCreatePlayerName() || loading || localLoading) return;
    
    setLocalLoading(true);
    setErrors({});
    
    try {
      await onCreateRoom(createPlayerName.trim());
    } catch (err) {
      setErrors(prev => ({ ...prev, general: 'Failed to create room. Please try again.' }));
    } finally {
      setLocalLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!validateJoinPlayerName() || !validateJoinCode() || loading || localLoading) return;
    
    setLocalLoading(true);
    setErrors({});
    
    try {
      await onJoinRoom(joinPlayerName.trim(), joinCode.trim().toUpperCase());
    } catch (err) {
      setErrors(prev => ({ 
        ...prev, 
        general: 'Failed to join room. Please check the room code and try again.' 
      }));
    } finally {
      setLocalLoading(false);
    }
  };

  const isLoading = loading || localLoading;

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
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main Container */}
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
          
          {/* Error Display */}
          {(errors.general || error) && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-400/40 rounded-lg text-red-300 text-sm backdrop-blur-sm">
              {errors.general || error}
            </div>
          )}

          {/* Create Room Section */}
          <div className="space-y-4 mb-6">
            <h3 className="text-white font-semibold text-lg drop-shadow-sm">Create New Room</h3>
            
            {/* Create Room - Player Name Input */}
            <div>
              <label 
                htmlFor="createPlayerName" 
                className="block text-white font-medium mb-2 text-sm drop-shadow-sm"
              >
                Your Name
              </label>
              <input
                id="createPlayerName"
                type="text"
                value={createPlayerName}
                onChange={(e) => setCreatePlayerName(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'create')}
                placeholder="Enter your name..."
                maxLength={20}
                disabled={isLoading}
                className={`w-full p-3 rounded-lg border ${
                  errors.createPlayerName 
                    ? 'border-red-400 focus:ring-red-400' 
                    : 'border-gray-500 focus:ring-cyan-400'
                } bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-describedby={errors.createPlayerName ? "createPlayerName-error" : undefined}
              />
              {errors.createPlayerName && (
                <p id="createPlayerName-error" className="text-red-400 text-xs mt-1">
                  {errors.createPlayerName}
                </p>
              )}
            </div>

            {/* Create Room Button */}
            <button
              onClick={handleCreateRoom}
              disabled={!createPlayerName.trim() || isLoading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-transparent shadow-lg disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating...
                </div>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 inline mr-2" />
                  Create New Room
                </>
              )}
            </button>
          </div>

          {/* OR Divider */}
          <div className="flex items-center justify-center my-6">
            <hr className="flex-grow border-t border-gray-400" />
            <span className="mx-4 text-gray-200 text-sm font-medium drop-shadow-sm">OR</span>
            <hr className="flex-grow border-t border-gray-400" />
          </div>

          {/* Join Room Section */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg drop-shadow-sm">Join Existing Room</h3>
            
            {/* Join Room - Player Name Input */}
            <div>
              <label 
                htmlFor="joinPlayerName" 
                className="block text-white font-medium mb-2 text-sm drop-shadow-sm"
              >
                Your Name
              </label>
              <input
                id="joinPlayerName"
                type="text"
                value={joinPlayerName}
                onChange={(e) => setJoinPlayerName(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'join')}
                placeholder="Enter your name..."
                maxLength={20}
                disabled={isLoading}
                className={`w-full p-3 rounded-lg border ${
                  errors.joinPlayerName 
                    ? 'border-red-400 focus:ring-red-400' 
                    : 'border-gray-500 focus:ring-purple-400'
                } bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-describedby={errors.joinPlayerName ? "joinPlayerName-error" : undefined}
              />
              {errors.joinPlayerName && (
                <p id="joinPlayerName-error" className="text-red-400 text-xs mt-1">
                  {errors.joinPlayerName}
                </p>
              )}
            </div>

            {/* Join Room - Room Code Input */}
            <div>
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
                onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
                onKeyPress={(e) => handleKeyPress(e, 'join')}
                placeholder="Enter 6-digit code"
                maxLength={6}
                disabled={isLoading}
                className={`w-full p-3 rounded-lg border ${
                  errors.joinCode 
                    ? 'border-red-400 focus:ring-red-400' 
                    : 'border-gray-500 focus:ring-purple-400'
                } bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 transition-all duration-200 text-center font-mono tracking-widest backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-describedby={errors.joinCode ? "joinCode-error" : undefined}
              />
              {errors.joinCode && (
                <p id="joinCode-error" className="text-red-400 text-xs mt-1">
                  {errors.joinCode}
                </p>
              )}
            </div>
              
            {/* Join Room Button */}
            <button
              onClick={handleJoinRoom}
              disabled={!joinPlayerName.trim() || !joinCode.trim() || isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent shadow-lg disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Joining...
                </div>
              ) : (
                <>
                  <Play className="w-5 h-5 inline mr-2" />
                  Join Room
                </>
              )}
            </button>
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