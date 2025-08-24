I'll create a comprehensive README.md file for your drawing game backend:

```markdown name=README.md
# Drawing Game Backend

A real-time multiplayer drawing and guessing game backend built with Node.js, GraphQL, MongoDB, and Redis.

## 🎯 Features

- **Real-time Gameplay**
  - WebSocket-based live drawing synchronization
  - Real-time chat and game state updates
  - Instant score updates and round progression

- **User Management**
  - JWT-based authentication
  - User profiles and statistics
  - Secure password handling

- **Game Mechanics**
  - Multiple game rooms
  - Customizable room settings
  - Round-based gameplay
  - Scoring system
  - Word generation and validation

- **Technical Features**
  - GraphQL API with Apollo Server
  - MongoDB database with Mongoose
  - Redis for caching and real-time features
  - TypeScript for type safety
  - Comprehensive testing suite

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Redis
- Docker (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Anshulsm12/draw-game-backend.git
cd draw-game-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start development server:
```bash
npm run dev
```

### Docker Deployment

```bash
# Build the image
docker-compose build

# Start the services
docker-compose up -d
```

## 🛠 API Documentation

### GraphQL Endpoints

The GraphQL playground is available at `http://localhost:4000/graphql` in development mode.

#### Key Mutations:
```graphql
# User Authentication
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    token
    user {
      id
      username
    }
  }
}

# Room Management
mutation CreateRoom($input: CreateRoomInput!) {
  createRoom(input: $input) {
    id
    code
    host {
      username
    }
  }
}
```

#### Key Subscriptions:
```graphql
# Real-time Drawing Updates
subscription OnDrawingUpdate {
  drawingUpdated(gameId: "game_id") {
    player {
      username
    }
    drawingData
  }
}
```

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run linting
npm run lint

# Format code
npm run format

# Check types
npm run typecheck
```

### Project Structure

```
src/
├── config/        # Configuration files
├── graphql/       # GraphQL schemas and resolvers
├── models/        # MongoDB models
├── services/      # Business logic
└── utils/         # Utility functions
```

## 🧪 Testing

The project uses Jest for testing. Run tests with:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📦 Production Deployment

1. Build the application:
```bash
npm run build
```

2. Set production environment variables:
```bash
NODE_ENV=production
```

3. Start the server:
```bash
npm start
```

## 🔐 Security

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation
- CORS configuration
- WebSocket authentication

## 📈 Monitoring

The application includes:
- Error logging
- Performance monitoring
- Request tracking
- Real-time metrics

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Author

**Saurabh Bisht""
## 🙏 Acknowledgments

- GraphQL and Apollo Server documentation
- MongoDB documentation
- Redis documentation
- WebSocket documentation

## 📞 Support

For support, email [your-email@example.com](mailto:saurabhbisht076@gmail.com) or create an issue in the repository.
```

