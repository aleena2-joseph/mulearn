import { useState, useEffect, forwardRef, useRef } from "react";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";
import aibal from "../../assets/aibal jose.jpeg";
import agatha from "../../assets/agatha.png";
import adarshs from "../../assets/adarshs.jpg";
import athul from "../../assets/athul.jpg";
import alvina from "../../assets/alvina.jpg";
import ansif from "../../assets/ansif.jpg";
import christopher from "../../assets/christopher.jpg";
import edwin from "../../assets/edwin.jpg";
import emil from "../../assets/emil.png";
import joyel from "../../assets/joyel.jpg";
import asif from "../../assets/asif.JPG";
import kevin from "../../assets/kevin.jpg";
import amal from "../../assets/amal.jpg";
import navya from "../../assets/navya.jpg";
const OurTeam = forwardRef((props, ref) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const scrollerInnerRef = useRef(null);

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
    dept: "INT MCA",
    muid: "aibaljose@mulearn",
    image: aibal,

    linkedin: "https://www.linkedin.com/in/aibaljose/",
    bio: "The Campus Lead of µLearn AJCE is an Integrated MCA student at Amal Jyothi College of Engineering. With a strong passion for front-end development, React, and IoT, they also serve as the founder of IMPACT, Webmaster for ACM AJCE, and an Open IoT Ambassador with ICFOSS.",
  };

  const facultyList = [
    {
      name: "Amal K Jose",
      designation: "Assistant Professor",
      description:
        "Amal K Jose is an Assistant Professor in the Department of Computer Applications at Amal Jyothi College of Engineering, specializing in web development, cloud management, and machine learning.",
      image: amal,
    },
    {
      name: "Navyamol K T",
      designation: "Assistant Professor",
      description:
        "Navyamol K T is an Assistant Professor in the Department of Computer Applications at Amal Jyothi College of Engineering, specializing in programming, cloud platforms, and data analytics. ",
      image: navya,
    },
  ];

   const teamMembers = [
    {
      name: "Agatha Anna Skariah",
      role: "Campus Co-Lead",
      muid: "agathaannaskariah@mulearn",
      image: agatha,
      linkedin: "https://www.linkedin.com/in/agatha-anna-skariah/",
    },
    {
      name: "Joyel Shaji",
      role: "Product Management IG lead",
      muid: "joyelshaji@mulearn",
      image: joyel,
      linkedin: "https://www.linkedin.com/in/joyelshaji",
    },
    {
      name: "Emil Tom Joseph",
      role: "Tech Team",
      muid: "emiltomjoseph@mulearn",
      image: emil,
      linkedin: "https://www.linkedin.com/in/emiltomjoseph",
    },
    {
      name: "Christopher Joseph Joby",
      role: "Tech Team",
      muid: "christopherjosephjoby@mulearn",
      image: christopher,
      linkedin: "https://www.linkedin.com/in/christopherjoby7/",
    },
    {
      name: "Edwin Viju",
      role: "Marketing Team",
      muid: "edwinviju-1@mulearn",
      image: edwin,
      linkedin: "https://www.linkedin.com/in/edwinviju",
    },
    {
      name: "Asif Hussain",
      role: "Tech Team",
      muid: "asifhussain@mulearn",
      image: asif,
      linkedin: "https://www.linkedin.com/in/asif-hussain-1b1835380",
    },
    {
      name: "Athul Mathew",
      role: "Marketing Team Lead",
      muid: "athulmathew@mulearn",
      image: athul,
      linkedin: "https://www.linkedin.com/in/athul-mathew-b16202254/?lipi=urn%3Ali%3Apage%3Ap_mwlite_my_net",
    },
    {
      name: "ANSIF ANSARY",
      role: "MARKETING TEAM",
      muid: "ansifansary@mulearn",
      image: ansif,
      linkedin: "https://www.linkedin.com/in/ansifansary",
    },
    {
      name: "Kevin George",
      role: "Tech Team Lead",
      muid: "kevingeorge@mulearn",
      image: kevin,
      linkedin: "https://www.linkedin.com/in/kwingeorge",
    },
    {
      name: "Adarsh S",
      role: "Media & Design Team Lead",
      muid: "adarshs-11@mulearn",
      image: adarshs,
      linkedin: "https://www.linkedin.com/in/adarsh-s-93a228350?utm_source=share_via&utm_content=profile&utm",
    },
    {
      name: "Alvina Aju",
      role: "Web Dev IG Lead",
      muid: "alvinaaju@mulearn",
      image: alvina,
      linkedin: "https://www.linkedin.com/in/alvinaajuu",
    }
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
              Meet the Passionate Team Driving µLearn AJCE Forward
            </p>
          </div>
        </div>
        <section className="pb-30">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Our Faculty
          </h2>
          <div className="max-w-6xl mx-auto space-y-16">
            {facultyList.map((faculty, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row ${
                  index % 2 !== 0 ? "md:flex-row-reverse" : ""
                } items-center gap-12`}
              >
                {/* Image Section with Design */}
                <div className="relative flex-shrink-0">
                  {/* Background Decorative Circle */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 rounded-full opacity-60"></div>

                  {/* Main Image Container */}
                  <div className="relative">
                    <img
                      src={faculty.image}
                      alt={faculty.name}
                      className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg relative z-10"
                    />

                    {/* Bottom Design Element */}
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-20 blur-sm"></div>
                  </div>
                </div>

                {/* Description Section */}
                {/* Description Section */}
                <div
                  className={`flex-1 flex flex-col justify-center text-center ${
                    index % 2 !== 0 ? "md:text-right" : "md:text-left"
                  }`}
                >
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">
                    {faculty.name}
                  </h3>
                  <p className="text-xl text-indigo-600 font-semibold mb-1">
                    {faculty.designation}
                  </p>
                  <div
                    className={`w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mb-3 ${
                      index % 2 !== 0 ? "md:ml-auto" : ""
                    } mx-auto md:mx-0`}
                  ></div>
                  <p
                    className={`text-gray-700 text-base leading-relaxed max-w-xl ${
                      index % 2 !== 0 ? "text-right ml-auto" : "text-left"
                    }`}
                  >
                    {faculty.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

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
                    Dept: {campusLead.dept}
                  </div>
                  <div className="bg-purple-100 text-purple-800 inline-block px-3 py-1 rounded-full text-sm font-medium mb-3">
                    μid: {campusLead.muid}
                  </div>
                  <p className="text-purple-700 leading-relaxed">
                    {campusLead.bio}
                  </p>
                </div>
                <div className="mt-6 flex space-x-4">
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

                {/* Role */}
                <p className="text-purple-600 text-sm mt-1">{member.role}</p>

                {/* Full-width line with MUID and LinkedIn */}
                <div className="flex justify-between items-center mt-3 border-t border-purple-100 pt-2">
                  <span className="text-purple-500 text-xs bg-purple-50 px-2 py-1 rounded-full">
                    {member.muid}
                  </span>
                  <a
                    href={member.linkedin}
                    className="text-gray-500 hover:text-purple-800 transition-colors"
                    aria-label={`${member.name}'s LinkedIn`}
                    target="_blank"
                    rel="noopener noreferrer"
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
