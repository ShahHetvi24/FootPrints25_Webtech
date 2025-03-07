const socketio = require("socket.io");
const Room = require("../models/Room");
const { nanoid } = require("nanoid");

module.exports = (httpServer) => {
  const io = socketio(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Socket.io connection handler
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a room
    socket.on("joinRoom", async ({ roomId, username, avatar }) => {
      try {
        // Find room
        const room = await Room.findById(roomId);
        if (!room) {
          socket.emit("error", { message: "Room not found" });
          return;
        }

        // Check if room is private and user is not in the allowed list
        if (room.isPrivate && !room.allowedUsers.includes(socket.id)) {
          socket.emit("error", { message: "Not authorized to join this room" });
          return;
        }

        // Join the room
        socket.join(roomId);

        // Create anonymous user id for this session if not provided
        const userId = socket.id;

        // Store user info
        socket.data.username = username || `Anonymous-${nanoid(6)}`;
        socket.data.roomId = roomId;
        socket.data.avatar =
          avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${userId}`;

        // Notify room of new user
        io.to(roomId).emit("userJoined", {
          userId,
          username: socket.data.username,
          avatar: socket.data.avatar,
          timestamp: Date.now(),
        });

        // Send room history (limited to last 100 messages)
        const recentMessages = room.messages.slice(-100);
        socket.emit("roomHistory", recentMessages);

        console.log(`User ${socket.data.username} joined room ${roomId}`);
      } catch (error) {
        console.error("Error joining room:", error);
        socket.emit("error", { message: "Failed to join room" });
      }
    });

    // Handle chat message
    socket.on("chatMessage", async (message) => {
      try {
        const roomId = socket.data.roomId;
        if (!roomId) {
          socket.emit("error", { message: "You need to join a room first" });
          return;
        }

        const newMessage = {
          content: message,
          sender: {
            userId: socket.id,
            username: socket.data.username,
            avatar: socket.data.avatar,
          },
          createdAt: new Date(),
        };

        // Save message to room
        const room = await Room.findById(roomId);
        if (!room) {
          socket.emit("error", { message: "Room not found" });
          return;
        }

        room.messages.push(newMessage);
        await room.save();

        // Broadcast message to room
        io.to(roomId).emit("message", newMessage);
      } catch (error) {
        console.error("Error handling message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      const roomId = socket.data.roomId;
      if (roomId) {
        // Notify room that user has left
        io.to(roomId).emit("userLeft", {
          userId: socket.id,
          username: socket.data.username,
          timestamp: Date.now(),
        });
      }
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};
