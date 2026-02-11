require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Socket.io connection logic
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_room', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Attach io to req for use in routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/seasons', require('./routes/seasons'));
app.use('/api/weeks', require('./routes/weeks'));
app.use('/api/teams', require('./routes/teams'));
app.use('/api/scores', require('./routes/scores'));

// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', time: new Date() });
});

// Production: Serve static files from the 'public' directory
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../public')));

    // The catch-all route: for any request that doesn't match an API route, send back index.html
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../public', 'index.html'));
    });
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };
