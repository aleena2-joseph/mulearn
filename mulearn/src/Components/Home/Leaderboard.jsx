import React, { useState, useEffect } from "react";
import { Trophy, Medal } from "lucide-react";

const Leaderboard = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("leaderboard-section");
      if (section) {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (sectionTop < windowHeight * 0.75) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const leaderboardItems = [
    {
      name: "Emma Johnson",
      score: 2450,
      rank: "2nd",
      delay: 300,
      icon: <Medal className="text-[#a78bfa]" size={32} />, // soft violet
    },
    {
      name: "James Smith",
      score: 3200,
      rank: "1st",
      delay: 200,
      icon: <Trophy className="text-[#c084fc]" size={40} />, // soft purple
    },
    {
      name: "Olivia Davis",
      score: 2100,
      rank: "3rd",
      delay: 400,
      icon: <Medal className="text-[#d8b4fe]" size={32} />, // light lavender
    },
  ];

  const topPerformers = [
    { name: "Noah Wilson", score: 1950, rank: "4th" },
    { name: "Sophia Martinez", score: 1820, rank: "5th" },
    { name: "William Taylor", score: 1790, rank: "6th" },
    { name: "Ava Brown", score: 1760, rank: "7th" },
    { name: "Benjamin Anderson", score: 1730, rank: "8th" },
  ];

  return (
    <div
      id="leaderboard-section"
      className="py-20 bg-gradient-to-br from-[#f6f4fa] to-[#ece7f9] text-gray-800"
    >
      <div
        className={`container mx-auto px-4 max-w-5xl transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 relative inline-block text-[#5b4c79]">
            Leaderboard
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#c084fc] to-[#a78bfa] rounded-full"></div>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Celebrating our champions who shine with excellence.
          </p>
        </div>

        {/* Top 3 Podium */}
        <div className="flex flex-col md:flex-row justify-center items-end mb-16 gap-4">
          {leaderboardItems.map((item, index) => {
            const getHeight = () => {
              if (item.rank === "1st") return "h-64";
              if (item.rank === "2nd") return "h-56";
              return "h-48";
            };

            const getWidth = () => {
              if (item.rank === "1st") return "w-full md:w-1/3";
              return "w-full md:w-1/4";
            };

            const getBgColor = () => {
              if (item.rank === "1st")
                return "bg-gradient-to-t from-[#e9d5ff] to-[#f3e8ff]";
              if (item.rank === "2nd")
                return "bg-gradient-to-t from-[#ddd6fe] to-[#ede9fe]";
              return "bg-gradient-to-t from-[#e0d7ff] to-[#f5f3ff]";
            };

            return (
              <div
                key={index}
                className={`${getWidth()} flex flex-col items-center transition-all duration-1000 ${
                  isVisible
                    ? "opacity-100 transform-none"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${item.delay}ms` }}
              >
                <div className="relative mb-2">
                  <div className="absolute -top-2 -right-2 bg-[#a78bfa] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-sm">
                    {item.rank.charAt(0)}
                  </div>
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-gradient-to-br from-[#ede9fe] to-[#f5f3ff] flex items-center justify-center">
                    <span className="font-bold text-2xl text-gray-700">
                      {item.name.charAt(0)}
                    </span>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <p className="font-bold text-lg text-[#4c4061]">
                    {item.name}
                  </p>
                  <p className="text-gray-500">{item.score} points</p>
                </div>

                <div
                  className={`${getHeight()} ${getBgColor()} w-full rounded-t-xl flex flex-col items-center justify-end p-4 shadow-md transform transition-all duration-500 hover:scale-105`}
                >
                  <div className="mb-4">{item.icon}</div>
                  <div className="font-bold text-lg text-[#5b4c79]">
                    {item.rank} Place
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rest of Leaderboard */}
        <div
          className={`bg-[#f3effa] shadow-xl rounded-xl p-6 transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h3 className="text-xl font-bold mb-4 border-b border-violet-200 pb-2 text-[#4c4061]">
            Top Performers
          </h3>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-md bg-[#ede9fe] hover:bg-[#e4dfff] transition-all duration-300 transform ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-4"
                }`}
                style={{ transitionDelay: `${600 + index * 100}ms` }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-[#c4b5fd] text-white font-bold flex items-center justify-center">
                    {index + 4}
                  </div>
                  <div>
                    <p className="font-medium text-[#4c4061]">
                      {performer.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {performer.rank} Place
                    </p>
                  </div>
                </div>
                <div className="text-lg font-bold text-[#5b4c79]">
                  {performer.score}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
