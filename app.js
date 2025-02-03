const express = require('express');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorMiddleware');
const sequelize = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const commentRoutes = require('./routes/commentRoutes');
const SocketController = require('./controller/SocketController');
const AIRoutes = require("./routes/AIRoutes");

const { createServer } = require("http");
const { Server } = require("socket.io");

const path = require('path');
dotenv.config();

const app = express();
const host = process.env.HOST;

const port = 8000;

app.use(express.json({
  extends: true
}));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(
  cors({
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

app.use(errorHandler);
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/blog', blogRoutes);
app.use('/comment', commentRoutes);
app.use('/api/v1/ai', AIRoutes);

sequelize
  .sync({ alter: false }) // Sync models with the database
  .then(() => console.log('Database Synced'))
  .catch((err) => console.error('Database Sync Error:', err));

sequelize
  .authenticate()
  .then(() => console.log('Connected to MySQL'))
  .catch((err) => console.error('DB Connection Error:', err));

const node_server = createServer(app);
const io = new Server(node_server, {
  cors: {
    origin: "http://localhost:5173", // Allow frontend origin
    methods: ["GET", "POST"],
    credentials: true
  }
});

SocketController(io);

node_server.listen(port, host, () => {
  console.log(`server is running on http://localhost:${port}`);
});
