require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("./config/passport");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { createServer } = require("http");
const socketSetup = require("./config/socket");
const Redis = require("ioredis");

// Initialize Redis client
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// Import route files
const confessionRoutes = require("./routes/confessions");
const secretMessageRoutes = require("./routes/secretMessages");
const authRoutes = require("./routes/auth");
const roomRoutes = require("./routes/rooms");

const app = express();
const httpServer = createServer(app);

// Setup Socket.io
socketSetup(httpServer);

app.use(cookieParser());

// CORS setup
app.use(
  cors({
    origin: [process.env.FRONTEND_URL,"http://192.168.1.6:5173/"] || "http://localhost:5173 ",
    // origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Session configuration
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 7 days
});

app.use(sessionMiddleware);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// JSON middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("Welcome to Secret Confessions API"));
app.use("/api/v1/confessions", confessionRoutes);
app.use("/api/v1/secret-messages", secretMessageRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/rooms", roomRoutes);

// Catch-all for undefined routes
app.all("*", (req, res) => {
  res.status(404).json({ success: false, message: "Resource not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "Unauthorized" });
  } else if (err.name === "NotFoundError") {
    return res.status(404).json({ message: "Resource not found" });
  }

  res.status(500).json({ message: "Internal server error" });
});

// Setup cleanup job for expired messages
const setupCleanupJob = () => {
  setInterval(async () => {
    try {
      const now = new Date();
      // Clean expired secret messages
      await mongoose.model("SecretMessage").deleteMany({
        expiresAt: { $lte: now },
        isRead: false,
      });

      // Clean expired chat messages in rooms
      const Room = mongoose.model("Room");
      const rooms = await Room.find();

      for (const room of rooms) {
        const messageExpiryTime = room.messageExpiryHours || 24;
        const expiryDate = new Date(
          Date.now() - messageExpiryTime * 60 * 60 * 1000
        );

        room.messages = room.messages.filter(
          (msg) => new Date(msg.createdAt) > expiryDate
        );

        await room.save();
      }

      console.log("Expired messages cleanup completed");
    } catch (error) {
      console.error("Error cleaning up expired messages:", error);
    }
  }, 60 * 60 * 1000); // Run every hour
};

// Start server and connect to database
const port = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected...");
    setupCleanupJob();
    httpServer.listen(port, () =>
      console.log(`Server listening on port ${port}!`)
    );
  })
  .catch((err) => console.error(err));
