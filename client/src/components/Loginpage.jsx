import React, { use, useEffect } from "react";
import { Users, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/auth");
        if (response.data.authenticated) {
          navigate("/home");
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkAuth();
  },[]
);

  const handleBack = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-[var(--home-bg-color)] flex items-center justify-center relative">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-5 left-4 p-2 bg-[var(--button-color)] bg-opacity-50 rounded-xl shadow-lg hover:bg-opacity-70"
      >
        <ArrowLeft size={24} color="white" />
      </button>
      
      {/* Main Content */}
      <div className="flex flex-col justify-center items-center bg-white bg-opacity-20 backdrop-blur-md rounded-lg shadow-lg w-[320px] md:w-[400px] p-8">
        <div className="mb-6">
          <Users size={60} color="white" />
        </div>
        <button className="bg-[var(--button-color)] w-[80%] p-2 rounded-lg">
          Login with Google
        </button>
        <div className="flex text-white mt-2 text-base justify-center text-center">
  "Hey, want to spill the tea or drop a confession? You don't even need login. Just vibe, speak truth, and keep it lowkey."
</div>
      </div>
    </div>
  );
};

export default LoginPage;
