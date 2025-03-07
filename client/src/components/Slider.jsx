import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, FlaskConical, Orbit, Sprout, Unplug, Waypoints, Wrench } from 'lucide-react';

// Enhanced Card Component
const Card = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col bg-[var(--title-color)] bg-opacity-1 rounded-xl overflow-hidden h-[400px] p-3">
      <div className="relative h-48 flex justify-center items-center overflow-hidden">
        {icon}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-bold text-xl mb-2 text-gray-800">{title}</h3>
        <p className="text-white mb-4 flex-1">{description}</p>
        <button className="mt-auto w-full bg-[var(--button-color)] text-white font-medium py-2 px-4 rounded transition-colors duration-200">
          {"Chat Anonymously"}
        </button>
      </div>
    </div>
  );
};

// Main Slider Component
const ImageSlider = ({ title, cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3); // Default to 3 cards

  const maxIndex = Math.max(0, cards.length - cardsToShow);

  const nextSlide = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Adjust cardsToShow based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsToShow(1); // Show 1 card on small screens
      } else {
        setCardsToShow(3); // Show 3 cards on larger screens
      }
    };

    handleResize(); // Call initially to set the correct value
    window.addEventListener('resize', handleResize); // Add event listener for resizing

    return () => window.removeEventListener('resize', handleResize); // Cleanup on component unmount
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-6xl text-white font-bold mb-8 text-center">{title}</h2>

      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)` }}
          >
            {cards.map((card, index) => (
              <div key={index} className="flex-none w-full sm:w-1/3 px-2 h-full">
                <Card
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                />
              </div>
            ))}
          </div>
        </div>

        {currentIndex > 0 && (
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 z-10"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {currentIndex < maxIndex && (
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 z-10"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const cardData = [
    {
      icon: <Orbit className="w-[80%] h-[80%] text-white" />,
      title: "Data Den",
      description: "Where we decode the chaos and turn data into straight-up magic—no cap, just code.",
    },
    {
      icon: <Wrench className="w-[80%] h-[80%] text-white" />,
      title: "Rivet Crew",
      description: "We're all about that grind—building, fixing, and making machines go vroom, no shortcuts!",
    },
    {
      icon: <Waypoints className="w-[80%] h-[80%] text-white" />,
      title: "Circuit Society",
      description: "Where we spark up ideas, power up innovation, and keep the current flowing, no stops!",
    },
    {
      icon: <Sprout className="w-[80%] h-[80%] text-white" />,
      title: "Terrain Tribe",
      description: "We lay the foundation, build the future, and make sure the world stands strong—one blueprint at a time!",
    },
    {
      icon: <FlaskConical className="w-[80%] h-[80%] text-white" />,
      title: "Catalyst",
      description: "We spark reactions, mix things up, and turn ideas into explosive innovation—no chill, just chemistry!",
    },
    {
      icon: <Unplug className="w-[80%] h-[80%] text-white" />,
      title: "BuzzPub",
      description: "Where the chatter never stops, the vibes are always lit, and everyone's got something to say!",
    }
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-[var(--home-bg-color)] py-10">
      <ImageSlider title="Choose Your TeaTok" cards={cardData} />
    </div>
  );
};

export default App;
