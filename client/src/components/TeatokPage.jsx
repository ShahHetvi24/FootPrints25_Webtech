import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Orbit,
  Wrench,
  Waypoints,
  Sprout,
  FlaskConical,
  Unplug,
} from "lucide-react";
import CardSlider from "./CardSlider";

const Slider = () => {
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate("/login");
  };

  const cardData = [
    {
      icon: <Orbit size={170} color="white" />,
      title: "Data Den",
      description:
        "Where we decode the chaos and turn data into straight-up magic—no cap, just code.",
    },
    {
      icon: <Wrench size={170} color="white" />,
      title: "Rivet Crew",
      description:
        "We're all about that grind—building, fixing, and making machines go vroom, no shortcuts!",
    },
    {
      icon: <Waypoints size={170} color="white" />,
      title: "Circuit Society",
      description:
        "Where we spark up ideas, power up innovation, and keep the current flowing, no stops!",
    },
    {
      icon: <Sprout size={170} color="white" />,
      title: "Terrain Tribe",
      description:
        "We lay the foundation, build the future, and make sure the world stands strong—one blueprint at a time!",
    },
    {
      icon: <FlaskConical size={170} color="white" />,
      title: "Catalyst",
      description:
        "We spark reactions, mix things up, and turn ideas into explosive innovation—no chill, just chemistry!",
    },
    {
      icon: <Unplug size={170} color="white" />,
      title: "BuzzPub",
      description:
        "Where the chatter never stops, the vibes are always lit, and everyone's got something to say!",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--home-bg-color)] py-1 relative">
      <nav className="px-6 py-4 flex justify-end">
        <button
          className="bg-[var(--button-color)] text-white font-medium px-4 py-2 rounded-lg"
          onClick={handleLoginClick}
        >
          Login
        </button>
      </nav>
      <div className="flex justify-center items-center"></div>
      <CardSlider title="Choose Your TeaTok" cards={cardData} />
    </div>
  );
};

export default Slider;
