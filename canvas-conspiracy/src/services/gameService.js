// Game Service - Ready for backend integration
class GameService {
  constructor() {
    this.socket = null;
    this.gameState = {
      roomCode: '',
      players: [],
      currentPlayer: null,
      currentRound: 1,
      maxRounds: 3,
      currentPrompt: '',
      phase: 'home',
      isHost: false
    };
    this.callbacks = {
      onPhaseChange: null,
      onPlayerJoin: null,
      onPlayerLeave: null,
      onGameStateUpdate: null
    };
  }

  // Initialize connection (ready for WebSocket/Socket.IO)
  connect(serverUrl) {
    // TODO: Implement WebSocket connection
    // this.socket = new WebSocket(serverUrl);
    // this.socket.onmessage = this.handleMessage.bind(this);
    console.log('GameService: Ready to connect to', serverUrl);
  }

  // Create room
  async createRoom(playerName, gameSettings = {}) {
    // TODO: Replace with actual API call
    const mockResponse = {
      roomCode: this.generateRoomCode(),
      playerId: Date.now(),
      isHost: true
    };

    this.gameState.roomCode = mockResponse.roomCode;
    this.gameState.currentPlayer = { id: mockResponse.playerId, name: playerName };
    this.gameState.isHost = mockResponse.isHost;

    return mockResponse;
  }

  // Join room
  async joinRoom(roomCode, playerName) {
    // TODO: Replace with actual API call
    const mockResponse = {
      success: true,
      playerId: Date.now(),
      players: this.getMockPlayers(),
      gameState: { ...this.gameState, roomCode }
    };

    if (mockResponse.success) {
      this.gameState = { ...this.gameState, ...mockResponse.gameState };
      this.gameState.currentPlayer = { id: mockResponse.playerId, name: playerName };
    }

    return mockResponse;
  }

  // Start game
  async startGame(gameSettings) {
    // TODO: Replace with actual API call
    const mockResponse = {
      success: true,
      gameState: {
        ...this.gameState,
        phase: 'drawing',
        currentPrompt: this.getRandomPrompt(),
        maxRounds: gameSettings.rounds || 3,
        roundTime: gameSettings.roundTime || 90
      }
    };

    this.gameState = { ...this.gameState, ...mockResponse.gameState };
    return mockResponse;
  }

  // Submit drawing
  async submitDrawing(drawingData) {
    // TODO: Replace with actual API call
    console.log('Submitting drawing:', drawingData);
    return { success: true };
  }

  // Submit story
  async submitStory(story) {
    // TODO: Replace with actual API call
    console.log('Submitting story:', story);
    return { success: true };
  }

  // Submit vote
  async submitVote(storyIndex) {
    // TODO: Replace with actual API call
    console.log('Submitting vote for story:', storyIndex);
    return { success: true };
  }

  // Use power-up
  async usePowerUp(powerUpType) {
    // TODO: Replace with actual API call
    console.log('Using power-up:', powerUpType);
    return { success: true };
  }

  // Leave room
  async leaveRoom() {
    // TODO: Replace with actual API call
    this.gameState = {
      roomCode: '',
      players: [],
      currentPlayer: null,
      currentRound: 1,
      maxRounds: 3,
      currentPrompt: '',
      phase: 'home',
      isHost: false
    };
    return { success: true };
  }

  // Handle incoming messages (WebSocket)
  handleMessage(message) {
    const data = JSON.parse(message.data);
    
    switch (data.type) {
      case 'PLAYER_JOINED':
        this.callbacks.onPlayerJoin?.(data.player);
        break;
      case 'PLAYER_LEFT':
        this.callbacks.onPlayerLeave?.(data.playerId);
        break;
      case 'PHASE_CHANGE':
        this.gameState.phase = data.phase;
        this.callbacks.onPhaseChange?.(data.phase);
        break;
      case 'GAME_STATE_UPDATE':
        this.gameState = { ...this.gameState, ...data.gameState };
        this.callbacks.onGameStateUpdate?.(this.gameState);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  // Set event callbacks
  setCallbacks(callbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  // Get current game state
  getGameState() {
    return { ...this.gameState };
  }

  // Utility methods
  generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  getRandomPrompt() {
    const prompts = [
      "A cat trying to use a computer",
      "An alien ordering pizza",
      "A superhero doing laundry",
      "A robot learning to dance",
      "A dragon at a coffee shop"
    ];
    return prompts[Math.floor(Math.random() * prompts.length)];
  }

  getMockPlayers() {
    return [
      { id: 1, name: 'Alice', score: 150, online: true, isCurrentUser: true },
      { id: 2, name: 'Bob', score: 120, online: true, isCurrentUser: false },
      { id: 3, name: 'Charlie', score: 95, online: false, isCurrentUser: false }
    ];
  }
}

// Export singleton instance
export default new GameService();