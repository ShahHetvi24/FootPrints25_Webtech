import React, { useState, useEffect } from "react";
import axios from "axios";
// import "./RoomsList.css";

function RoomsList({ onRoomSelect, activeRoom }) {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDescription, setNewRoomDescription] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get("/api/rooms");
      setRooms(response.data);

      // Select the first room if none is active
      if (response.data.length > 0 && !activeRoom) {
        onRoomSelect(response.data[0]._id);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const createRoom = async (e) => {
    e.preventDefault();

    if (!newRoomName.trim()) return;

    try {
      await axios.post("/api/rooms", {
        name: newRoomName,
        description: newRoomDescription,
      });

      setNewRoomName("");
      setNewRoomDescription("");
      setShowCreateForm(false);
      fetchRooms();
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  return (
    <div className="rooms-list">
      <div className="rooms-header">
        <h2>Chat Rooms</h2>
        <button
          className="new-room-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Cancel" : "New Room"}
        </button>
      </div>

      {showCreateForm && (
        <form className="create-room-form" onSubmit={createRoom}>
          <input
            type="text"
            placeholder="Room name"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newRoomDescription}
            onChange={(e) => setNewRoomDescription(e.target.value)}
          />
          <button type="submit">Create Room</button>
        </form>
      )}

      <ul className="rooms-list-items">
        {rooms.map((room) => (
          <li
            key={room._id}
            className={room._id === activeRoom ? "active" : ""}
            onClick={() => onRoomSelect(room._id)}
          >
            <h3>{room.name}</h3>
            <p>{room.description}</p>
          </li>
        ))}
        {rooms.length === 0 && !showCreateForm && (
          <li className="no-rooms">
            <p>No rooms available. Create a new room to start chatting!</p>
          </li>
        )}
      </ul>
    </div>
  );
}

export default RoomsList;
