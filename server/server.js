// server.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const passport = require("./config/passport.js");
const session = require("express-session");
const mongoose = require("mongoose");
const crypto = require("crypto");
const cors = require("cors");
const { createClient } = require("redis");
const MongoStore = require("connect-mongo");

// Initialize Express app
const app = express();
app.use(
  cors({
    origin: "https://melodic-froyo-ddbd3a.netlify.app",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      secure: false, // Change to true in production (HTTPS)
      sameSite: "lax", // Ensures cookies work cross-origin
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
// app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://manchopda1508:IZlV3cVgEeUK3I1m@secret-confessions.btxgq.mongodb.net/?retryWrites=true&w=majority&appName=secret-confessions",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Initialize Redis client
const redisClient = createClient({
  url: "redis://default:rffCO5niPS8kyWa9cn1dZrn7amJLEJ4Q@redis-12638.c325.us-east-1-4.ec2.redns.redis-cloud.com:12638",
});

redisClient.on("connect", () => {
  console.log("✅ Connected to Redis successfully!");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

(async () => {
  try {
    await redisClient.connect();
    // Test setting a key
    await redisClient.set("testKey", "Hello, Redis!");
    const value = await redisClient.get("testKey");
    console.log("Redis Test Key Value:", value); // Should print "Hello, Redis!"
  } catch (error) {
    console.error("❌ Redis Error:", error);
  }
})();

// Models
const MessageSchema = new mongoose.Schema({
  content: String,
  room: String,
  sender: String,
  timestamp: { type: Date, default: Date.now },
  expiresAt: Date,
});

const RoomSchema = new mongoose.Schema({
  name: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
});

const ConfessionSchema = new mongoose.Schema({
  content: String,
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
});

const SecretMessageSchema = new mongoose.Schema({
  content: String,
  uniqueId: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
  viewed: { type: Boolean, default: false },
});

const Message = mongoose.model("Message", MessageSchema);
const Room = mongoose.model("Room", RoomSchema);
const Confession = mongoose.model("Confession", ConfessionSchema);
const SecretMessage = mongoose.model("SecretMessage", SecretMessageSchema);

// API Routes for Rooms
app.use("/api/v1/auth", require("./routes/auth"));

app.get("/api/rooms", async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/rooms", async (req, res) => {
  try {
    const { name, description } = req.body;
    const room = new Room({ name, description });
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API Routes for Public Confessions
app.get("/api/confessions", async (req, res) => {
  try {
    const confessions = await Confession.find({
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });
    res.json(confessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/confessions", async (req, res) => {
  try {
    const { content, expiresInHours = 24 } = req.body;

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);

    const confession = new Confession({
      content,
      expiresAt,
    });

    await confession.save();
    res.status(201).json(confession);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API Routes for Secret Messages
app.post("/api/secret-messages", async (req, res) => {
  try {
    const { content, expiresInHours = 24 } = req.body;

    // Validate input
    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "Content cannot be empty" });
    }

    if (
      typeof expiresInHours !== "number" ||
      expiresInHours <= 0 ||
      expiresInHours > 168
    ) {
      return res
        .status(400)
        .json({ error: "expiresInHours must be between 1 and 168" });
    }

    const uniqueId = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);

    const secretMessage = new SecretMessage({
      content,
      uniqueId,
      expiresAt,
      viewed: false,
    });

    await secretMessage.save();

    // Try Redis storage but continue even if it fails
    await redisClient.set(
      `secret_message:${uniqueId}`,
      JSON.stringify({ content, createdAt: new Date() }),
      "EX",
      expiresInHours * 60 * 60
    );

    res.status(201).json({
      message: "Secret message created",
      link: `/view/${uniqueId}`,
      expiresAt,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/secret-messages/:uniqueId", async (req, res) => {
  try {
    const { uniqueId } = req.params;

    // First check in MongoDB
    const secretMessage = await SecretMessage.findOne({
      uniqueId,
      viewed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!secretMessage) {
      // Try Redis as fallback if MongoDB lookup failed
      const redisMessage = await redisClient.get(`secret_message:${uniqueId}`);

      if (!redisMessage) {
        return res.status(404).json({
          error: "Message not found or already viewed",
        });
      }

      // Delete from Redis after retrieving
      await redisClient.del(`secret_message:${uniqueId}`);

      const parsedMessage = JSON.parse(redisMessage);
      return res.json({
        content: parsedMessage.content,
        createdAt: parsedMessage.createdAt,
      });
    }

    // Mark as viewed in MongoDB
    secretMessage.viewed = true;
    await secretMessage.save();

    // Schedule deletion after response is sent
    setTimeout(async () => {
      await SecretMessage.deleteOne({ uniqueId });
      console.log(`Secret message ${uniqueId} deleted`);
    }, 1000);

    res.json({
      content: secretMessage.content,
      createdAt: secretMessage.createdAt,
      expiresAt: secretMessage.expiresAt,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Socket.io setup for real-time chat
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", async (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);

    // Send last 50 messages for this room
    try {
      const messages = await Message.find({ room: roomId })
        .sort({ timestamp: -1 })
        .limit(50);

      socket.emit("message_history", messages.reverse());
    } catch (err) {
      console.error("Error fetching message history:", err);
    }
  });

  socket.on("leave_room", (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId}`);
  });

  socket.on("send_message", async (data) => {
    try {
      const { content, room, sender, expiresInHours = 24 } = data;

      if (!content || !room || !sender) {
        return;
      }

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + expiresInHours);

      // Save message to MongoDB
      const message = new Message({
        content,
        room,
        sender,
        timestamp: new Date(),
        expiresAt,
      });

      await message.save();

      // Emit message to all users in the room
      io.to(room).emit("receive_message", {
        content,
        sender,
        timestamp: message.timestamp,
      });

      console.log(`Message sent in room ${room} by ${sender}`);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Cron job to delete expired content (runs every hour)
setInterval(async () => {
  try {
    const now = new Date();

    // Delete expired confessions
    await Confession.deleteMany({ expiresAt: { $lte: now } });

    // Delete expired secret messages
    await SecretMessage.deleteMany({ expiresAt: { $lte: now } });

    // Delete expired chat messages
    await Message.deleteMany({ expiresAt: { $lte: now } });

    console.log("Cleanup job completed:", new Date());
  } catch (err) {
    console.error("Error in cleanup job:", err);
  }
}, 60 * 60 * 1000); // Run every hour

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
