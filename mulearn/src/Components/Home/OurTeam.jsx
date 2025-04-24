import { useState, useEffect, forwardRef, useRef } from "react";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";
import aibal from "../../assets/aibal jose.jpeg";
import athul from "../../assets/athul.jpeg";
import athira from "../../assets/athira.jpeg";
import neeva from "../../assets/neeva.jpeg";
import aleena from "../../assets/aleena.jpeg";
import aibalmani from "../../assets/aibal mani.jpeg";
import alen from "../../assets/alen.jpeg";
import abin from "../../assets/abin.png";
import geo from "../../assets/geo.png";
const OurTeam = forwardRef((props, ref) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const scrollerInnerRef = useRef(null);
  // Removing the unused scrollerRef variable

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveIndex((prev) =>
        prev === teamMembers.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("ourTeam-section");
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

  useEffect(() => {
    const scrollerInner = scrollerInnerRef.current;
    if (!scrollerInner) return;

    Array.from(scrollerInner.children).forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      duplicatedItem.setAttribute("aria-hidden", "true");
      scrollerInner.appendChild(duplicatedItem);
    });

    const handleMouseEnter = () => {
      scrollerInner.classList.remove("animate-scroll");
      scrollerInner.classList.add("pause-animation");
    };

    const handleMouseLeave = () => {
      scrollerInner.classList.remove("pause-animation");
      scrollerInner.classList.add("animate-scroll");
    };

    scrollerInner.addEventListener("mouseenter", handleMouseEnter);
    scrollerInner.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      scrollerInner.removeEventListener("mouseenter", handleMouseEnter);
      scrollerInner.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Campus Lead (fixed at the top)
  const campusLead = {
    name: "Aibal Jose",
    role: "Campus Lead",
    batch: "INT MCA",
    image: aibal,
    github: "https://github.com/arunkumar",
    linkedin: "https://linkedin.com/in/arunkumar",
    bio: "Leading MULearn initiatives at AJCE with a passion for technology and community building.",
  };

  // Team Members (will rotate in carousel)
  const teamMembers = [
    {
      name: "Athul Mathew",
      role: "Campus Co-Lead",
      batch: "2022-26",
      image: athul,
      github: "https://github.com/meeranair",
      linkedin: "https://linkedin.com/in/meeranair",
    },
    {
      name: "Athira Biju",
      role: "Web Developer",
      batch: "2022-26",
      image: athira,
      github: "https://github.com/josephthomas",
      linkedin: "https://linkedin.com/in/josephthomas",
    },
    {
      name: "Aleena Joseph",
      role: "Web Lead",
      batch: "2023-27",
      image: aleena,
      github: "https://github.com/anjalimenon",
      linkedin: "https://linkedin.com/in/anjalimenon",
    },
    {
      name: "Neeva",
      role: "Backend Developer",
      batch: "2021-25",
      image: neeva,
      github: "https://github.com/rahuldev",
      linkedin: "https://linkedin.com/in/rahuldev",
    },
    {
      name: "Aibal Jacob Mani",
      role: "Content Creator",
      batch: "2022-26",
      image: aibalmani,
      github: "https://github.com/priyavarghese",
      linkedin: "https://linkedin.com/in/priyavarghese",
    },
    {
      name: "Alen Kuriakose",
      role: "ML Engineer",
      batch: "2021-25",
      image: alen,
      github: "https://github.com/alexphilip",
      linkedin: "https://linkedin.com/in/alexphilip",
    },
    {
      name: "Abin Thomas",
      role: "Event Coordinator",
      batch: "2023-27",
      image: abin,
      github: "https://github.com/sarajames",
      linkedin: "https://linkedin.com/in/sarajames",
    },
    {
      name: "Geo George",
      role: "App Developer",
      batch: "2022-26",
      image: geo,
      github: "https://github.com/vishnuprasad",
      linkedin: "https://linkedin.com/in/vishnuprasad",
    },
    {
      name: "Lakshmi Warrier",
      role: "Community Manager",
      batch: "2023-27",
      image: "/api/placeholder/300/300",
      github: "https://github.com/lakshmiwrrier",
      linkedin: "https://linkedin.com/in/lakshmiwarrier",
    },
    {
      name: "Karthik Menon",
      role: "IoT Specialist",
      batch: "2021-25",
      image: "/api/placeholder/300/300",
      github: "https://github.com/karthikmenon",
      linkedin: "https://linkedin.com/in/karthikmenon",
    },
  ];

  // Handle navigation
  const goToNext = () => {
    setActiveIndex((prev) => (prev === teamMembers.length - 1 ? 0 : prev + 1));
  };

  const goToPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? teamMembers.length - 1 : prev - 1));
  };

  // For the smaller cards, show 5 members at a time
  const getVisibleMembers = () => {
    const visibleMembers = [];
    for (let i = 0; i < 5; i++) {
      const index = (activeIndex + i) % teamMembers.length;
      visibleMembers.push(teamMembers[index]);
    }
    return visibleMembers;
  };

  return (
    <div className="bg-lavender-50 py-16 px-4 sm:px-6 lg:px-8">
      <div
        id="ourTeam-section"
        ref={ref}
        className={`max-w-7xl mx-auto transition-opacity duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-purple-800 sm:text-4xl">
            Our Team
          </h2>
          <div className="flex items-center justify-center mt-2">
            <Users className="w-6 h-6 text-purple-600 mr-2" />
            <p className="text-lg text-purple-600">
              Meet the brilliant minds behind MULearn AJCE
            </p>
          </div>
        </div>

        {/* Campus Lead - Fixed at Top */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:scale-105 border-2 border-purple-300">
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                <div className="relative">
                  <img
                    className="h-64 w-full object-cover md:w-64 transition-transform duration-500 hover:scale-110"
                    src={campusLead.image}
                    alt={campusLead.name}
                  />
                  <div className="absolute top-0 right-0 bg-purple-600 text-white py-1 px-3 rounded-bl-lg font-medium">
                    Campus Lead
                  </div>
                </div>
              </div>
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-purple-900 mb-2 animate-fade-in">
                    {campusLead.name}
                  </h3>
                  <div className="bg-purple-100 text-purple-800 inline-block px-3 py-1 rounded-full text-sm font-medium mb-3">
                    Batch: {campusLead.batch}
                  </div>
                  <p className="text-purple-700 leading-relaxed">
                    {campusLead.bio}
                  </p>
                </div>
                <div className="mt-6 flex space-x-4">
                  <a
                    href={campusLead.github}
                    className="text-gray-500 hover:text-purple-800 transition-colors flex items-center"
                  >
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    GitHub
                  </a>
                  <a
                    href={campusLead.linkedin}
                    className="text-gray-500 hover:text-purple-800 transition-colors flex items-center"
                  >
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Header */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-purple-800">Team Members</h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={goToPrev}
              className="p-2 rounded-full bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
              aria-label="Previous members"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="p-2 rounded-full bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
              aria-label="Next members"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Team Members Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {getVisibleMembers().map((member, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-lg border border-purple-100"
            >
              <div className="relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900 to-transparent h-16 opacity-70" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-purple-800">
                  {member.name}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-purple-600 text-sm">{member.role}</p>
                  <p className="text-purple-500 text-xs bg-purple-50 px-2 py-1 rounded-full">
                    {member.batch}
                  </p>
                </div>
                <div className="mt-3 flex space-x-3">
                  <a
                    href={member.github}
                    className="text-gray-500 hover:text-purple-800 transition-colors"
                    aria-label={`${member.name}'s GitHub`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                  <a
                    href={member.linkedin}
                    className="text-gray-500 hover:text-purple-800 transition-colors"
                    aria-label={`${member.name}'s LinkedIn`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Team Progress Indicator */}
        <div className="mt-10 flex justify-center">
          {teamMembers.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`mx-1 w-3 h-3 rounded-full transition-all duration-300 ${
                idx === activeIndex ? "bg-purple-600 w-6" : "bg-purple-300"
              }`}
              aria-label={`Go to team member ${idx + 1}`}
            />
          ))}
        </div>

        {/* Infinite scroll animation container */}
        <div className="mt-16 overflow-hidden" ref={scrollerInnerRef}>
          {/* Content for the scroller would go here */}
        </div>
      </div>
    </div>
  );
});

export default OurTeam;
