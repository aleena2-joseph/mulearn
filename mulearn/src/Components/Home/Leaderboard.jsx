import React, { useState, useEffect } from "react";
import { Trophy, Medal, Award } from "lucide-react";

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

  // Placeholder for profile images - replace with actual image paths
  const profileImages = {
    first: "/api/placeholder/150/150",
    second: "/api/placeholder/150/150",
    third: "/api/placeholder/150/150",
  };

  const leaderboardItems = [
    {
      name: "James Smith",
      score: 3200,
      rank: "1st",
      delay: 200,
      icon: <Trophy className="text-yellow-500" size={28} />,
      image: profileImages.first,
      badge: "bg-gradient-to-r from-yellow-400 to-yellow-600",
      muid: "MU123456",
      karmaPoints: 1250,
    },
    {
      name: "Emma Johnson",
      score: 2450,
      rank: "2nd",
      delay: 300,
      icon: <Medal className="text-gray-400" size={28} />,
      image: profileImages.second,
      badge: "bg-gradient-to-r from-gray-300 to-gray-500",
      muid: "MU234567",
      karmaPoints: 980,
    },
    {
      name: "Olivia Davis",
      score: 2100,
      rank: "3rd",
      delay: 400,
      icon: <Award className="text-amber-700" size={28} />,
      image: profileImages.third,
      badge: "bg-gradient-to-r from-amber-600 to-amber-800",
      muid: "MU345678",
      karmaPoints: 820,
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
    <section
      id="leaderboard-section"
      className="py-20 bg-gradient-to-b from-lavender-50 via-white to-lavender-100"
    >
      <div
        className={`container mx-auto px-4 max-w-6xl transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-lavender-900 mb-4">
            <span className="text-purple-600">µLearn</span> Leaderboard
          </h2>
          <p className="text-xl text-lavender-700 max-w-2xl mx-auto">
            Celebrating our community champions and their extraordinary
            achievements
          </p>
        </div>

        {/* Top 3 Winners */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leaderboardItems.map((item, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl overflow-hidden shadow-lg border border-lavender-200/50 transform transition-all duration-700 hover:shadow-xl hover:-translate-y-2 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${item.delay}ms` }}
              >
                {/* Rank Badge */}
                <div className={`h-2 ${item.badge}`}></div>

                <div className="p-6">
                  {/* Profile Image and Rank */}
                  <div className="flex justify-center -mt-8">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md">
                        <img
                          src={item.image}
                          alt={`${item.name}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
                        {item.icon}
                      </div>
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="text-center mt-4">
                    <h3 className="text-xl font-bold text-lavender-800">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="text-sm text-purple-600 font-medium">
                        {item.rank} Place
                      </span>
                      <span className="w-1 h-1 rounded-full bg-lavender-300"></span>
                    </div>
                  </div>

                  {/* MUID and Rank */}
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center justify-center px-3 py-1 bg-lavender-100 rounded-full text-xs text-lavender-700">
                      <span className="mr-1">MUID:</span>
                      <span className="font-medium">{item.muid}</span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-purple-600">
                      {item.uLearnRank}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="mt-6 grid grid-cols-2 gap-2">
                    <div className="bg-lavender-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-lavender-600 mb-1">
                        Karma Points
                      </p>
                      <p className="font-bold text-lavender-800 text-lg">
                        {item.karmaPoints}
                      </p>
                    </div>
                    <div className="bg-lavender-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-lavender-600 mb-1">
                        Total Rank
                      </p>
                      <p className="font-bold text-lavender-800 text-lg">
                        {item.score}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rest of Leaderboard - Keeping Original Design */}
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

      {/* Custom CSS for consistent styling with other components */}
      <style jsx>{`
        .from-lavender-50 {
          --tw-gradient-from: #faf5ff;
        }
        .to-lavender-100 {
          --tw-gradient-to: #f3e8ff;
        }
        .via-white {
          --tw-gradient-stops: var(--tw-gradient-from), #ffffff,
            var(--tw-gradient-to);
        }
        .bg-lavender-50 {
          background-color: #faf5ff;
        }
        .bg-lavender-100 {
          background-color: #f3e8ff;
        }
        .text-lavender-600 {
          color: #7e22ce;
        }
        .text-lavender-700 {
          color: #6b21a8;
        }
        .text-lavender-800 {
          color: #581c87;
        }
        .text-lavender-900 {
          color: #4c1d95;
        }
        .border-lavender-100 {
          border-color: #f3e8ff;
        }
        .border-lavender-200\\/50 {
          border-color: rgba(233, 213, 255, 0.5);
        }
      `}</style>
    </section>
  );
};

export default Leaderboard;
