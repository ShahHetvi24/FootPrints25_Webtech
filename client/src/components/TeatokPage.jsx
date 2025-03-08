import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CardSlider from "./CardSlider";

const Slider = () => {
  const navigate = useNavigate();
  const [cardData, setCardData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [roomData, setRoomData] = useState({
    name: "",
    description: "",
    isPrivate: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/rooms/public");
        setCardData(response.data.rooms);
        console.log("Rooms:", response);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchData();
  }, []);

  const handleCreateRoomClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRoomData({ ...roomData, [name]: type === "checkbox" ? checked : value });
  };

  const handleCreateRoom = async () => {
    try {
      const response = await axios.post("/api/rooms", roomData);
      setCardData([...cardData, response.data.room]);
      setShowModal(false);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--home-bg-color)] py-1 relative">
      <nav className="px-6 py-4 flex justify-between">
        <button
          className="bg-[var(--button-color)] text-white font-medium px-4 py-2 rounded-lg"
          onClick={handleCreateRoomClick}
        >
          Create Room
        </button>
        <button
          className="bg-[var(--button-color)] text-white font-medium px-4 py-2 rounded-lg"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </nav>
      <div className="flex justify-center items-center"></div>
      <CardSlider title="Choose Your TeaTok" cards={cardData} />

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Create New Room</h2>
            <input
              type="text"
              name="name"
              placeholder="Room Name"
              value={roomData.name}
              onChange={handleInputChange}
              className="w-full p-2 mb-2 border rounded"
            />
            <textarea
              name="description"
              placeholder="Room Description"
              value={roomData.description}
              onChange={handleInputChange}
              className="w-full p-2 mb-2 border rounded"
            />
            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                name="isPrivate"
                checked={roomData.isPrivate}
                onChange={handleInputChange}
                className="mr-2"
              />
              Private Room
            </label>
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="bg-[var(--button-color)] text-white px-4 py-2 rounded-lg"
                onClick={handleCreateRoom}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Slider;
