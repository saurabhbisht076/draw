import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

// Import all components
import Home from './components/Lobby/Home';
import Lobby from './components/Lobby/Lobby';
import WaitingRoom from './components/Lobby/WaitingRoom';
import GameScreen from './components/Game/GameScreen';
import './App.css';

// Import utilities and types
import { GamePhase } from './types/gameTypes';
import { prompts } from './utils/gameUtils';
import { useTimer } from './hooks/useTimer';

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const App = () => {
  const [currentPhase, setCurrentPhase] = useState(GamePhase.HOME);
  const [gameState, setGameState] = useState({
    roomCode: '',
    players: [],
    currentPlayer: null,
    currentRound: 1,
    maxRounds: 3,
    currentPrompt: '',
    isHost: false,
    playerId: null,
    roomSettings: {
      maxPlayers: 6,
      roundTime: 90,
      rounds: 3
    }
  });
  
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { timeLeft, isActive, start, pause, reset } = useTimer(90, () => {
    handlePhaseComplete();
  });

  // API functions
  const createRoom = async (playerName) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerName }),
      });

      if (!response.ok) {
        throw new Error('Failed to create room');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async (playerName, roomCode) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/rooms/${roomCode}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to join room');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getRoomInfo = async (roomCode) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/${roomCode}`);
      
      if (!response.ok) {
        throw new Error('Failed to get room info');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const leaveRoom = async (roomCode, playerId) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/rooms/${roomCode}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId }),
      });

      if (!response.ok) {
        throw new Error('Failed to leave room');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRoomSettings = async (roomCode, playerId, settings) => {
    try {
      setLoading(true);
      setError('');
      
      const requestBody = { playerId, settings };
      console.log('=== UPDATE SETTINGS API CALL ===');
      console.log('Room Code:', roomCode);
      console.log('Player ID being sent:', playerId);
      console.log('Settings being sent:', settings);
      console.log('Full request body:', requestBody);
      console.log('Request URL:', `${API_BASE_URL}/rooms/${roomCode}/settings`);
      
      const response = await fetch(`${API_BASE_URL}/rooms/${roomCode}/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Update settings response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log('=== UPDATE SETTINGS ERROR ===');
        console.log('Error response:', errorData);
        console.log('Error message:', errorData.message);
        throw new Error(errorData.message || 'Failed to update room settings');
      }

      const data = await response.json();
      console.log('=== UPDATE SETTINGS SUCCESS ===');
      console.log('Success response:', data);
      return data;
    } catch (err) {
      console.error('Update settings error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const startGame = async (roomCode, playerId) => {
    try {
      setLoading(true);
      setError('');
      
      const requestBody = { playerId };
      console.log('Start game request:', requestBody);
      console.log('Request URL:', `${API_BASE_URL}/rooms/${roomCode}/start`);
      
      const response = await fetch(`${API_BASE_URL}/rooms/${roomCode}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Start game response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Start game error data:', errorData);
        throw new Error(errorData.message || 'Failed to start game');
      }

      const data = await response.json();
      console.log('Start game success data:', data);
      return data;
    } catch (err) {
      console.error('Start game error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Polling for room updates with proper data structure handling
  useEffect(() => {
    let interval;
    
    // FIXED: Poll for both LOBBY and WAITING phases to catch game start for all players
    if (gameState.roomCode && (currentPhase === GamePhase.LOBBY || currentPhase === GamePhase.WAITING)) {
      interval = setInterval(async () => {
        try {
          const response = await getRoomInfo(gameState.roomCode);
          
          // Debug logs to see what we're getting
          console.log('Full API Response:', response);
          console.log('Current Phase:', currentPhase);
          
          // FIXED: Extract data from nested structure
          const roomData = response.data || response;
          console.log('Room Data:', roomData);
          console.log('Players from API:', roomData.players);
          
          setGameState(prev => {
            console.log('Previous players:', prev.players);
            const newState = {
              ...prev,
              players: roomData.players || prev.players,
              // FIXED: Only update roomSettings if we're not the host or if we haven't made local changes
              // This prevents the UI from reverting when host is changing settings
              roomSettings: currentPhase === GamePhase.WAITING 
                ? (roomData.settings || prev.roomSettings)
                : prev.roomSettings
            };
            console.log('New players state:', newState.players);
            return newState;
          });
          
          // FIXED: Check if game has started for both LOBBY and WAITING phases
          // Check both gameStarted property and state property from server response
          const gameHasStarted = roomData.gameStarted || roomData.state === 'in-game';
          
          if (gameHasStarted && (currentPhase === GamePhase.LOBBY || currentPhase === GamePhase.WAITING)) {
            console.log('=== GAME STARTED DETECTED ===');
            console.log('Current phase:', currentPhase);
            console.log('Room state:', roomData.state);
            console.log('GameStarted flag:', roomData.gameStarted);
            console.log('Transitioning to DRAWING phase...');
            
            // Generate a random prompt for the first round
            const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
            
            setGameState(prev => ({
              ...prev,
              currentPrompt: randomPrompt
            }));
            
            setCurrentPhase(GamePhase.DRAWING);
            reset(gameState.roomSettings.roundTime || 90);
            start();
          }
        } catch (err) {
          console.error('Failed to poll room info:', err);
        }
      }, 1500); // Poll every 1.5 seconds for faster updates
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.roomCode, currentPhase, gameState.roomSettings.roundTime, start, reset]);

  // Event handlers
  const handleCreateRoom = async (playerName) => {
    try {
      const response = await createRoom(playerName);
      
      console.log('Create room full response:', response);
      
      // FIXED: Extract data from nested structure  
      const responseData = response.data || response;
      console.log('Create room data:', responseData);
      console.log('=== CREATE ROOM PLAYER ID DEBUG ===');
      console.log('Response playerId:', responseData.playerId);
      console.log('Response hostId:', responseData.hostId);
      console.log('Are they the same?', responseData.playerId === responseData.hostId);
      
      setGameState(prev => ({
        ...prev,
        roomCode: responseData.roomCode || response.roomCode,
        currentPlayer: { name: playerName, id: responseData.playerId || response.playerId },
        playerId: responseData.playerId || response.playerId,
        isHost: true,
        players: responseData.players || response.players || [{ 
          id: responseData.playerId || response.playerId, 
          name: playerName, 
          score: 0, 
          roundScore: 0, 
          online: true, 
          isCurrentUser: true 
        }]
      }));
      setCurrentPhase(GamePhase.LOBBY);
    } catch (err) {
      console.error('Failed to create room:', err);
    }
  };

  const handleJoinRoom = async (playerName, roomCode) => {
    try {
      const response = await joinRoom(playerName, roomCode.toUpperCase());
      
      console.log('Join room full response:', response);
      
      // FIXED: Extract data from nested structure
      const responseData = response.data || response;
      console.log('Join room data:', responseData);
      
      setGameState(prev => ({
        ...prev,
        roomCode: roomCode.toUpperCase(),
        currentPlayer: { name: playerName, id: responseData.playerId || response.playerId },
        playerId: responseData.playerId || response.playerId,
        isHost: false,
        players: responseData.players || response.players || []
      }));
      setCurrentPhase(GamePhase.WAITING);
      
      // Immediately poll for updated room info after joining
      setTimeout(async () => {
        try {
          const roomInfoResponse = await getRoomInfo(roomCode.toUpperCase());
          console.log('Room info after joining - full response:', roomInfoResponse);
          
          // FIXED: Extract from nested structure
          const roomData = roomInfoResponse.data || roomInfoResponse;
          console.log('Room info after joining - data:', roomData);
          console.log('Room info after joining - players:', roomData.players);
          
          setGameState(prev => ({
            ...prev,
            players: roomData.players || prev.players
          }));
        } catch (err) {
          console.error('Failed to get room info after joining:', err);
        }
      }, 500);
      
    } catch (err) {
      console.error('Failed to join room:', err);
    }
  };

  // FIXED: Separate settings update from game start
  const handleStartGame = async (settings) => {
    try {
      console.log('=== HANDLE START GAME DEBUG ===');
      console.log('Current gameState.playerId:', gameState.playerId);
      console.log('Current gameState.isHost:', gameState.isHost);
      console.log('Current gameState.roomCode:', gameState.roomCode);
      console.log('Settings to update:', settings);
      
      // Update settings first if provided
      if (settings) {
        try {
          // Get fresh room data to ensure we have correct hostId
          const roomInfoResponse = await getRoomInfo(gameState.roomCode);
          const roomData = roomInfoResponse.data || roomInfoResponse;
          console.log('=== FRESH ROOM DATA COMPARISON ===');
          console.log('Backend hostId:', roomData.hostId);
          console.log('Frontend playerId:', gameState.playerId);
          console.log('IDs match?', roomData.hostId === gameState.playerId);
          
          const correctPlayerId = roomData.hostId === gameState.playerId ? gameState.playerId : roomData.hostId;
          await updateRoomSettings(gameState.roomCode, correctPlayerId, settings);
          
          // Update local state with new settings
          setGameState(prev => ({
            ...prev,
            roomSettings: { ...prev.roomSettings, ...settings },
            // Fix player ID if needed
            playerId: correctPlayerId,
            currentPlayer: correctPlayerId !== prev.playerId 
              ? { ...prev.currentPlayer, id: correctPlayerId }
              : prev.currentPlayer
          }));
        } catch (err) {
          console.error('Failed to update settings:', err);
          // Continue with game start even if settings update fails
        }
      }
      
      // Transition to waiting room - game will start when all players are ready
      setCurrentPhase(GamePhase.WAITING);
    } catch (err) {
      console.error('Failed to start game:', err);
    }
  };

  const handleGameStart = async () => {
    try {
      console.log('=== HANDLE GAME START DEBUG ===');
      console.log('Current gameState.playerId:', gameState.playerId);
      console.log('Current gameState.isHost:', gameState.isHost);
      console.log('Current gameState.roomCode:', gameState.roomCode);
      
      if (gameState.isHost) {
        // Get fresh room data to ensure we have correct hostId
        try {
          const roomInfoResponse = await getRoomInfo(gameState.roomCode);
          const roomData = roomInfoResponse.data || roomInfoResponse;
          console.log('=== GAME START ID COMPARISON ===');
          console.log('Backend hostId:', roomData.hostId);
          console.log('Frontend playerId:', gameState.playerId);
          console.log('IDs match?', roomData.hostId === gameState.playerId);
          
          // Use correct hostId for start game API call
          const correctPlayerId = roomData.hostId === gameState.playerId ? gameState.playerId : roomData.hostId;
          await startGame(gameState.roomCode, correctPlayerId);
          
          // Update our state with correct ID if needed
          if (roomData.hostId !== gameState.playerId) {
            console.log('FIXING PLAYER ID MISMATCH FOR GAME START');
            setGameState(prev => ({
              ...prev,
              playerId: roomData.hostId,
              currentPlayer: { ...prev.currentPlayer, id: roomData.hostId }
            }));
          }
        } catch (err) {
          console.error('Failed to get fresh room data for game start:', err);
          // Fallback to original player ID
          await startGame(gameState.roomCode, gameState.playerId);
        }
      }
      
      // Don't immediately transition here - let the polling detect game start
      // This ensures all players transition together when the backend confirms game started
      console.log('Game start initiated, waiting for server confirmation...');
    } catch (err) {
      console.error('Failed to start game:', err);
    }
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
        if (gameState.currentRound < gameState.roomSettings.rounds) {
          setGameState(prev => ({
            ...prev,
            currentRound: prev.currentRound + 1,
            currentPrompt: prompts[Math.floor(Math.random() * prompts.length)]
          }));
          setCurrentPhase(GamePhase.DRAWING);
          reset(gameState.roomSettings.roundTime || 90);
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

  const handleLeaveRoom = async () => {
    try {
      if (gameState.roomCode && gameState.playerId) {
        await leaveRoom(gameState.roomCode, gameState.playerId);
      }
    } catch (err) {
      console.error('Failed to leave room:', err);
    } finally {
      setCurrentPhase(GamePhase.HOME);
      setGameState({
        roomCode: '',
        players: [],
        currentPlayer: null,
        currentRound: 1,
        maxRounds: 3,
        currentPrompt: '',
        isHost: false,
        playerId: null,
        roomSettings: {
          maxPlayers: 6,
          roundTime: 90,
          rounds: 3
        }
      });
      setError('');
      pause();
      reset(90);
    }
  };

  return (
    <div className="relative">
      {/* Error display */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 bg-red-500/90 backdrop-blur-lg rounded-lg text-white font-medium shadow-lg">
          {error}
          <button 
            onClick={() => setError('')}
            className="ml-3 text-red-200 hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      )}

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
            Round {gameState.currentRound}/{gameState.roomSettings.rounds}
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
          loading={loading}
          error={error}
        />
      )}

      {currentPhase === GamePhase.LOBBY && (
        <Lobby
          roomCode={gameState.roomCode}
          players={gameState.players}
          roomSettings={gameState.roomSettings}
          onStartGame={handleStartGame}
          onLeaveRoom={handleLeaveRoom}
          loading={loading}
        />
      )}

      {currentPhase === GamePhase.WAITING && (
        <WaitingRoom
          players={gameState.players}
          roomCode={gameState.roomCode}
          isHost={gameState.isHost}
          currentPlayerId={gameState.playerId}
          onStartGame={handleGameStart}
          onLeaveRoom={handleLeaveRoom}
          loading={loading}
        />
      )}

      {(currentPhase === GamePhase.DRAWING || 
        currentPhase === GamePhase.STORYTELLING || 
        currentPhase === GamePhase.VOTING || 
        currentPhase === GamePhase.RESULTS) && (
        <GameScreen
          phase={currentPhase}
          currentPrompt={gameState.currentPrompt}
          players={gameState.players}
          onPhaseComplete={handlePhaseComplete}
          timeLeft={timeLeft}
        />
      )}
    </div>
  );
};

export default App;