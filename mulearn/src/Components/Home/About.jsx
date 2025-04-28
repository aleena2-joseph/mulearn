import React, { useState, useEffect, forwardRef } from "react";
import { Link } from "react-router-dom";
import JoinMuLearn from "./JoinMuLearn";
const About = forwardRef((props, ref) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("about-section");
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

  const featureDelays = ["delay-300", "delay-400", "delay-500", "delay-600"];

  return (
    <div>
      <section
        id="about-section"
        ref={ref}
        className="min-h-screen bg-white text-black px-4 py-20"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Text Section */}
            <div
              className={`lg:w-1/2 transition-all duration-1000 transform ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-12"
              }`}
            >
              <div className="space-y-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-purple-600 mr-2"></span>
                  About μlearn
                </div>

                <h2 className="text-4xl font-bold text-gray-800 leading-tight">
                  Empowering the next generation of tech innovators
                </h2>

                <p className="text-gray-600 text-lg">
                  μlearn is a dynamic learning platform designed to bridge the
                  gap between academic knowledge and industry requirements. We
                  provide a collaborative environment where students can learn,
                  practice, and master the skills needed to thrive in today’s
                  tech-driven world.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  {[
                    {
                      title: "Project-Based Learning",
                      description: "Apply knowledge to real-world projects",
                    },
                    {
                      title: "Expert Mentorship",
                      description: "Learn directly from industry professionals",
                    },
                    {
                      title: "Collaborative Community",
                      description: "Connect with peers and build networks",
                    },
                    {
                      title: "Industry-Relevant Skills",
                      description: "Focus on high-demand technologies",
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className={`transition-all duration-700 transform ${
                        featureDelays[index]
                      } ${
                        isVisible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-8"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-purple-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6">
                  <Link to="https://mulearn.org/">
                    <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-1 flex items-center gap-2">
                      Learn More About Us
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Design & Chat Section */}
            <div
              className={`relative w-full lg:w-1/2 h-[500px] sm:h-[600px] md:h-[550px] transition-all duration-1000 transform ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-12"
              }`}
            >
              {/* Decorative Elements */}
              <div className="absolute top-16 left-6 sm:left-10 w-24 h-24 sm:w-36 sm:h-36 bg-gradient-to-br from-purple-300 to-indigo-300 rounded-full blur-3xl opacity-40 animate-pulse"></div>
              <div className="absolute top-1/3 left-1/5 w-16 h-16 sm:w-20 sm:h-20 bg-purple-200 transform rotate-45 shadow-lg shadow-purple-300/40"></div>
              <div className="absolute bottom-20 right-4 sm:right-10 w-32 h-32 sm:w-48 sm:h-48 bg-purple-100 rounded-[60%] blur-xl opacity-50 "></div>
              <div className="absolute top-10 right-4 sm:right-10 flex gap-1 sm:gap-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-400 rounded-full"></div>
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-300 rounded-full"></div>
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-purple-500 rounded-full"></div>
              </div>
              <div className="absolute bottom-8 left-2 sm:left-6 grid grid-cols-4 gap-1 sm:gap-2">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-200 rounded-full"
                  ></div>
                ))}
              </div>
              <div className="absolute top-1/2 right-1/4 w-20 h-20 sm:w-24 sm:h-24 border-4 border-purple-200 rounded-full blur-sm opacity-40 animate-spin-slow"></div>

              {/* Chat Info Boxes */}
              <div className="absolute top-4 left-1 sm:top-8 sm:left-2 bg-white bg-opacity-90 border border-purple-200 shadow-lg rounded-xl p-3 sm:p-4 max-w-[85%] sm:max-w-xs text-xs sm:text-sm backdrop-blur-md">
                <div className="text-purple-700 font-semibold">μlearn:</div>
                <p className="text-gray-700 mt-1">
                  Hey there! 👋 Ready to start your tech journey?
                </p>
              </div>

              <div className="absolute top-28 right-1 sm:top-32 sm:right-2 bg-purple-100 border border-purple-300 shadow-md rounded-xl p-3 sm:p-4 max-w-[85%] sm:max-w-xs text-xs sm:text-sm backdrop-blur-md">
                <div className="text-purple-800 font-semibold">You:</div>
                <p className="text-gray-800 mt-1">
                  Yes! But where do I start? So many skills to pick from 😅
                </p>
              </div>

              <div className="absolute bottom-28 left-2 sm:bottom-36 sm:left-4 bg-white bg-opacity-90 border border-purple-200 shadow-lg rounded-xl p-3 sm:p-4 max-w-[85%] sm:max-w-xs text-xs sm:text-sm backdrop-blur-md">
                <div className="text-purple-700 font-semibold">μlearn:</div>
                <p className="text-gray-700 mt-1">
                  No worries! We’ve got curated tracks, mentors, and projects
                  waiting for you 🚀
                </p>
              </div>

              <div className="absolute bottom-4 right-2 sm:bottom-6 sm:right-6 bg-purple-100 border border-purple-300 shadow-md rounded-xl p-3 sm:p-4 max-w-[85%] sm:max-w-xs text-xs sm:text-sm backdrop-blur-md">
                <div className="text-purple-800 font-semibold">You:</div>
                <p className="text-gray-800 mt-1">
                  Wow! That sounds perfect. Can’t wait to get started 🔥
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <JoinMuLearn />
    </div>
  );
});

export default About;
