const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const { connectDB } = require('./config/db');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  }
});

// Pass socket.io instance to express app
app.set('socketio', io);

// CORS: Allow all origins listed in CLIENT_URL (comma-separated)
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


// Socket.IO Connection Handler
io.on('connection', (socket) => {
  console.log(`[WebSocket] Client connected: ${socket.id}`);

  socket.on('join_seller', (sellerId) => {
    socket.join(`seller_${sellerId}`);
    console.log(`[WebSocket] Client ${socket.id} joined room seller_${sellerId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[WebSocket] Client disconnected: ${socket.id}`);
  });
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const searchRoutes = require('./routes/searchRoutes');
const seedRoutes = require('./routes/seedRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const schemeRoutes = require('./routes/schemeRoutes');
const reportRoutes = require('./routes/reportRoutes');

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/seeds', seedRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/reports', reportRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ONLINE', 
    app: 'Smart Seed Availability & Stock Management System (NIXTION / TN SEEDS)',
    timestamp: new Date()
  });
});

const PORT = process.env.PORT || 5000;

// Connect Database & Run Seed
connectDB().then(() => {
  const runSeeder = require('./seed');
  return runSeeder();
}).then(() => {
  server.listen(PORT, () => {
    console.log(`===================================================================`);
    console.log(`[NIXTION] Smart Seed Backend running on port http://localhost:${PORT}`);
    console.log(`[NIXTION] Socket.IO real-time availability engine active`);
    console.log(`===================================================================`);
  });
}).catch(err => {
  console.error('[Fatal Error] Failed to start backend server:', err);
});
