import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

// Import all components
import Home from './components/Lobby/Home';
import Lobby from './components/Lobby/Lobby';
import WaitingRoom from './components/Lobby/WaitingRoom';
import GameScreen from './components/Game/GameScreen';
import './App.css';
// Import utilities and types
import { GamePhase } from './types/gameTypes';
import { generateRoomCode, prompts } from './utils/gameUtils';
import { useTimer } from './hooks/useTimer';

const App = () => {
  const [currentPhase, setCurrentPhase] = useState(GamePhase.HOME);
  const [gameState, setGameState] = useState({
    roomCode: '',
    players: [],
    currentPlayer: null,
    currentRound: 1,
    maxRounds: 3,
    currentPrompt: '',
    isHost: false
  });
  
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Mock players data
  const mockPlayers = [
    { id: 1, name: 'Alice', score: 150, roundScore: 25, online: true, isCurrentUser: true },
    { id: 2, name: 'Bob', score: 120, roundScore: 20, online: true, isCurrentUser: false },
    { id: 3, name: 'Charlie', score: 95, roundScore: 15, online: false, isCurrentUser: false },
    { id: 4, name: 'Diana', score: 85, roundScore: 10, online: true, isCurrentUser: false }
  ];

  const { timeLeft, isActive, start, pause, reset } = useTimer(90, () => {
    handlePhaseComplete();
  });

  const handleCreateRoom = (playerName) => {
    const roomCode = generateRoomCode();
    setGameState(prev => ({
      ...prev,
      roomCode,
      currentPlayer: { name: playerName, id: 1 },
      isHost: true
    }));
    setCurrentPhase(GamePhase.LOBBY);
  };

  const handleJoinRoom = (playerName, roomCode) => {
    setGameState(prev => ({
      ...prev,
      roomCode,
      currentPlayer: { name: playerName, id: Date.now() },
      isHost: false
    }));
    setCurrentPhase(GamePhase.WAITING);
  };

  const handleStartGame = (settings) => {
    setGameState(prev => ({
      ...prev,
      players: mockPlayers,
      maxRounds: settings?.rounds || 3,
      currentPrompt: prompts[Math.floor(Math.random() * prompts.length)]
    }));
    setCurrentPhase(GamePhase.WAITING);
  };

  const handleGameStart = () => {
    setCurrentPhase(GamePhase.DRAWING);
    reset(90);
    start();
  };

  const handlePhaseComplete = (data = null) => {
    pause();
    
    switch (currentPhase) {
      case GamePhase.DRAWING:
        setCurrentPhase(GamePhase.STORYTELLING);
        reset(120);
        start();
        break;
      case GamePhase.STORYTELLING:
        setCurrentPhase(GamePhase.VOTING);
        reset(60);
        start();
        break;
      case GamePhase.VOTING:
        setCurrentPhase(GamePhase.RESULTS);
        break;
      case GamePhase.RESULTS:
        if (gameState.currentRound < gameState.maxRounds) {
          setGameState(prev => ({
            ...prev,
            currentRound: prev.currentRound + 1,
            currentPrompt: prompts[Math.floor(Math.random() * prompts.length)]
          }));
          setCurrentPhase(GamePhase.DRAWING);
          reset(90);
          start();
        } else {
          // Game over, show final results
          setCurrentPhase(GamePhase.HOME);
        }
        break;
      default:
        break;
    }
  };

  const handleLeaveRoom = () => {
    setCurrentPhase(GamePhase.HOME);
    setGameState({
      roomCode: '',
      players: [],
      currentPlayer: null,
      currentRound: 1,
      maxRounds: 3,
      currentPrompt: '',
      isHost: false
    });
    pause();
    reset(90);
  };

  return (
    <div className="relative">
      {/* Sound toggle */}
      <button
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="fixed top-4 right-4 z-50 p-3 bg-white/20 backdrop-blur-lg rounded-full border border-white/30 text-white hover:bg-white/30 transition-colors"
      >
        {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
      </button>

      {/* Game progress indicator */}
      {currentPhase !== GamePhase.HOME && currentPhase !== GamePhase.LOBBY && (
        <div className="fixed top-4 left-4 z-50 flex items-center gap-4 px-4 py-2 bg-white/20 backdrop-blur-lg rounded-full border border-white/30">
          <span className="text-white font-semibold">
            Round {gameState.currentRound}/{gameState.maxRounds}
          </span>
          {currentPhase === GamePhase.DRAWING && <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>}
          {currentPhase === GamePhase.STORYTELLING && <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>}
          {currentPhase === GamePhase.VOTING && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>}
        </div>
      )}

      {/* Render current phase */}
      {currentPhase === GamePhase.HOME && (
        <Home 
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
        />
      )}

      {currentPhase === GamePhase.LOBBY && (
        <Lobby
          roomCode={gameState.roomCode}
          onStartGame={handleStartGame}
          onLeaveRoom={handleLeaveRoom}
        />
      )}

      {currentPhase === GamePhase.WAITING && (
        <WaitingRoom
          players={mockPlayers}
          roomCode={gameState.roomCode}
          isHost={gameState.isHost}
          onStartGame={handleGameStart}
          onLeaveRoom={handleLeaveRoom}
        />
      )}

      {(currentPhase === GamePhase.DRAWING || 
        currentPhase === GamePhase.STORYTELLING || 
        currentPhase === GamePhase.VOTING || 
        currentPhase === GamePhase.RESULTS) && (
        <GameScreen
          phase={currentPhase}
          currentPrompt={gameState.currentPrompt}
          players={mockPlayers}
          onPhaseComplete={handlePhaseComplete}
          timeLeft={timeLeft}
        />
      )}
    </div>
  );
};

export default App;