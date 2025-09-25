require('dotenv').config();
const express = require('express');
const sequelize = require('./config/db');
const http = require('http');
const cors = require('cors');
const roomsRoutes = require('./routes/rooms.routes');
const { Server } = require('socket.io');

const app = express();
app.use(express.json());

// Allow both prod and dev frontend origins
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_DEV_URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

require('./sockets/rooms.socket')(io);
app.use('/rooms', roomsRoutes);
app.set('io', io);

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synced');
    server.listen(PORT, () => console.log(`Server running on ${PORT}`));
  } catch (err) {
    console.error('DB connection error:', err);
  }
})();
