const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // Change to your frontend domain in production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', require('./routes'));

// Health Check
app.get('/', (req, res) => {
  res.send('🟢 Real-time Collaboration API is running!');
});

// Error Handler Middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Socket.IO Realtime Events
io.on('connection', (socket) => {
  console.log('📡 New client connected:', socket.id);

  // Join space
  socket.on('join-space', (spaceId) => {
    socket.join(spaceId);
    console.log(`🔗 Socket ${socket.id} joined space ${spaceId}`);
  });

  // Broadcast new item
  socket.on('item-added', (data) => {
    io.to(data.spaceId).emit('item-added', data.item);
  });

  // Optional: handle update/delete in real time
  socket.on('item-updated', (data) => {
    io.to(data.spaceId).emit('item-updated', data.item);
  });

  socket.on('item-deleted', (data) => {
    io.to(data.spaceId).emit('item-deleted', data.itemId);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Connect to MongoDB and start the server
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
