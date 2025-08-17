import React from "react";
import { useNavigate } from "react-router-dom";
import LearningCircle from "./LearningCircle";

const Events = () => {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/");
  };

  return (
    <div>
      <div className="px-4 py-2 space-y-2 bg-purple-900/80 backdrop-blur-md">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10">
              <div className="absolute inset-0 bg-purple-500 rounded-lg rotate-45 transform transition-all duration-300 hover:rotate-[135deg] hover:bg-purple-400" />
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                μ
              </span>
            </div>
            <span className="text-white font-bold text-lg sm:text-xl">
              μlearn
            </span>
          </div>

          <button
            onClick={handleHome}
            className="relative px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium transition-all duration-300 overflow-hidden text-purple-200 hover:text-white cursor-pointer text-sm sm:text-base flex-shrink-0"
          >
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Home</span>
          </button>
        </div>
      </div>
      <LearningCircle />
    </div>
  );
};

export default Events;
