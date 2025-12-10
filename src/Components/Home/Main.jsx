import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowDropleft } from "react-icons/io";
const Main = () => {
  const [setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div>
      <div className="bg-purple-200">
        <nav className="container mx-auto px-4 ">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-purple-500 rounded-lg rotate-45 transform transition-all duration-300 hover:rotate-[135deg] hover:bg-purple-400" />
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
                  μ
                </span>
              </div>
              <span className="text-white font-bold text-xl">μlearn</span>
            </div>
          </div>
        </nav>
      </div>
      <div>
        <Link to="/">
          {" "}
          <IoIosArrowDropleft className="absolute top-4 left-4 text-4xl text-purple-600 hover:text-indigo-600 transition-colors duration-300 cursor-pointer drop-shadow-lg" />
        </Link>{" "}
      </div>
    </div>
  );
};

export default Main;
