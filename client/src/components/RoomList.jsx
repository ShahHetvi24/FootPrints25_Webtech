import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "./RoomsList.css";

function RoomsList({ onRoomSelect, activeRoom }) {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDescription, setNewRoomDescription] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [hoverInfo, setHoverInfo] = useState({
    visible: false,
    description: "",
    x: 0,
    y: 0,
  });

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

      // Show success toast
      toast.success(`Room "${newRoomName}" created successfully!`, {
        position: "bottom-right",
        theme: "colored",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error creating room:", error);

      // Show error toast
      toast.error(
        `Failed to create room: ${
          error.response?.data?.message || error.message
        }`,
        {
          position: "bottom-right",
          autoClose: 5000,
          theme: "dark",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
  };

  const handleMouseEnter = (event, description) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoverInfo({
      visible: true,
      description: description || "No description provided",
      x: event.clientX,
      y: rect.bottom + window.scrollY, // Position below the list item
    });
  };

  const handleMouseLeave = () => {
    setHoverInfo({ ...hoverInfo, visible: false });
  };

  const handleMouseMove = (event) => {
    if (hoverInfo.visible) {
      setHoverInfo({
        ...hoverInfo,
        x: event.clientX,
        y: event.clientY + 20, // Position below cursor
      });
    }
  };

  return (
    <div className="rooms-list">
      {/* ToastContainer - place this once in your component */}
      <ToastContainer />

      <div className="rooms-header">
        <h2>TeaTok Rooms</h2>
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
            onMouseEnter={(e) => handleMouseEnter(e, room.description)}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          >
            <h3>{room.name}</h3>
            {/* <p>{room.description}</p> */}
          </li>
        ))}
        {rooms.length === 0 && !showCreateForm && (
          <li className="no-rooms">
            <p>No rooms available. Create a new room to start chatting!</p>
          </li>
        )}
      </ul>

      {hoverInfo.visible && (
        <div
          className="hover-description"
          style={{
            position: "absolute",
            left: `${hoverInfo.x}px`,
            top: `${hoverInfo.y}px`,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "8px 12px",
            borderRadius: "4px",
            zIndex: 1000,
            maxWidth: "300px",
            pointerEvents: "none", // So it doesn't interfere with other interactions
          }}
        >
          {hoverInfo.description}
        </div>
      )}
    </div>
  );
}

export default RoomsList;
