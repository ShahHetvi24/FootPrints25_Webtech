const Room = require("../models/Room");
const crypto = require("crypto");

// Get all public rooms
exports.getPublicRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isPrivate: false })
      .select("name description createdAt")
      .sort({ createdAt: -1 });

    res.json({ rooms });
  } catch (error) {
    console.error("Get public rooms error:", error);
    res
      .status(500)
      .json({ message: "Error fetching rooms", error: error.message });
  }
};

// Create a new room
exports.createRoom = async (req, res) => {
  try {
    const { name, description, isPrivate, messageExpiryHours } = req.body;

    const shareableLink = crypto.randomBytes(8).toString("hex");

    const room = new Room({
      name,
      description,
      isPrivate: isPrivate === true,
      shareableLink,
      messageExpiryHours: messageExpiryHours || 24,
      createdBy: req.user ? req.user.id : null,
    });

    await room.save();

    // Generate full shareable link
    const fullShareableLink = `${process.env.FRONTEND_URL}/join/${shareableLink}`;

    res.status(201).json({
      room: {
        _id: room._id,
        name: room.name,
        description: room.description,
        isPrivate: room.isPrivate,
        shareableLink: fullShareableLink,
        messageExpiryHours: room.messageExpiryHours,
        createdAt: room.createdAt,
      },
    });
  } catch (error) {
    console.error("Create room error:", error);
    res
      .status(500)
      .json({ message: "Error creating room", error: error.message });
  }
};

// Get room by ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).select(
      "name description isPrivate shareableLink messageExpiryHours createdAt"
    );

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Generate full shareable link
    const fullShareableLink = `${process.env.FRONTEND_URL}/join/${room.shareableLink}`;

    res.json({
      room: {
        ...room.toObject(),
        shareableLink: fullShareableLink,
      },
    });
  } catch (error) {
    console.error("Get room error:", error);
    res
      .status(500)
      .json({ message: "Error fetching room", error: error.message });
  }
};

// Get room by shareable link
exports.getRoomByShareableLink = async (req, res) => {
  try {
    const { link } = req.params;

    const room = await Room.findOne({ shareableLink: link }).select(
      "_id name description isPrivate messageExpiryHours createdAt"
    );

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json({ room });
  } catch (error) {
    console.error("Get room by link error:", error);
    res
      .status(500)
      .json({ message: "Error fetching room", error: error.message });
  }
};

// Add user to private room
exports.addUserToPrivateRoom = async (req, res) => {
  try {
    const { roomId, userId } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (!room.isPrivate) {
      return res.status(400).json({ message: "Room is already public" });
    }

    // Add user to allowed list if not already there
    if (!room.allowedUsers.includes(userId)) {
      room.allowedUsers.push(userId);
      await room.save();
    }

    res.json({ message: "User added to room" });
  } catch (error) {
    console.error("Add user to room error:", error);
    res
      .status(500)
      .json({ message: "Error adding user to room", error: error.message });
  }
};
