import { useState, useEffect } from "react";
import { FaLinkedin } from "react-icons/fa";
import {
  RiInstagramLine,
  RiTwitterXFill,
  RiGithubFill,
  RiYoutubeFill,
  RiMapPinLine,
  RiMailLine,
  RiPhoneLine,
  RiUserHeartLine,
} from "react-icons/ri";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const footerElement = document.getElementById("footer");
      if (!footerElement) return;

      const rect = footerElement.getBoundingClientRect();
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;

      if (rect.top <= windowHeight * 0.8) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", onScroll);
    setTimeout(() => onScroll(), 100); // Check on initial load

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <footer
      id="footer"
      className="relative bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 text-white overflow-hidden border-t border-purple-500/30"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-10 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-20 right-20 w-16 h-16 border border-purple-400/30 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 border border-purple-400/30 rotate-45 animate-pulse"></div>

        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"
            style={{
              width: "100%",
              top: `${10 + i * 12}%`,
              left: "0",
              transform: "rotate(-35deg) translateX(-50%)",
              transformOrigin: "center",
            }}
          ></div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div
          className={`grid grid-cols-1 md:grid-cols-12 gap-12 mb-12 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Brand Section */}
          <div className="md:col-span-4 flex flex-col">
            <div className="mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-200 via-white to-lavender-200 bg-clip-text text-transparent mb-2">
                μlearn AJCE
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full mb-4"></div>
              <p className="text-lavender-200 mb-6">
                Empowering students through tech-enabled learning communities
                and fostering innovation at Amal Jyothi College of Engineering.
              </p>
            </div>

            <div className="backdrop-blur-sm bg-purple-800/20 rounded-xl p-4 border border-purple-500/20 mb-6 transform transition-transform hover:scale-105 duration-300">
              <h3 className="text-lg font-semibold text-white mb-3">
                Stay Updated
              </h3>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-grow bg-purple-900/60 border border-purple-500/30 rounded-l-lg px-4 py-2 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-r-lg px-4 py-2 text-white font-medium transition-all duration-300"
                >
                  Subscribe
                </button>
              </form>
            </div>

            <div className="flex gap-4">
              {[
                {
                  icon: <FaLinkedin />,
                  label: "LinkedIn",
                  href: "https://www.linkedin.com/company/mulearn-ajce/posts/?feedView=all",
                },
                {
                  icon: <RiInstagramLine />,
                  label: "Instagram",
                  href: "https://www.instagram.com/mulearn.ajc?igsh=MTdzdHZ5bjM3NGl0bw==",
                },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-800/50 border border-purple-500/30 text-purple-200 hover:bg-purple-700 hover:text-white hover:border-purple-400 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold text-white mb-4">
              Quick Links
            </h3>
            <div className="w-12 h-1 bg-purple-500/50 rounded-full mb-6"></div>
            <ul className="space-y-2">
              {["Home", "About", "Events", "Projects", "Team", "Gallery"].map(
                (text, idx) => (
                  <li key={idx}>
                    <a
                      href="#"
                      className="text-lavender-200 hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-0 h-px bg-purple-400 mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                      {text}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold text-white mb-4">Resources</h3>
            <div className="w-12 h-1 bg-purple-500/50 rounded-full mb-6"></div>
            <ul className="space-y-2">
              {[
                "Karmapoints",
                "Courses",
                "Workshops",
                "Learning Paths",
                "Mentorship",
                "FAQs",
              ].map((text, idx) => (
                <li key={idx}>
                  <a
                    href="#"
                    className="text-lavender-200 hover:text-white transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-0 h-px bg-purple-400 mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">
              Contact Us
            </h3>
            <div className="w-12 h-1 bg-purple-500/50 rounded-full mb-6"></div>

            {/* Address */}
            <div className="backdrop-blur-sm bg-purple-800/20 rounded-lg p-4 border border-purple-500/20">
              <div className="flex items-start">
                <RiMapPinLine className="text-xl text-purple-400 mr-3 mt-1" />
                <div>
                  <h4 className="font-medium text-white">Address</h4>
                  <p className="text-lavender-200">
                    μlearn AJCE, Amal Jyothi College of Engineering,
                    <br />
                    Koovapally, Kanjirappally, Kerala - 686518
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="backdrop-blur-sm bg-purple-800/20 rounded-lg p-4 border border-purple-500/20">
              <div className="flex items-start">
                <RiMailLine className="text-xl text-purple-400 mr-3 mt-1" />
                <div>
                  <h4 className="font-medium text-white">Email Us</h4>
                  <a
                    href="mailto:mulearn.ajce@gmail.com"
                    className="text-lavender-200 hover:text-white"
                  >
                    mulearn.ajce@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="backdrop-blur-sm bg-purple-800/20 rounded-lg p-4 border border-purple-500/20">
              <div className="flex items-start">
                <RiPhoneLine className="text-xl text-purple-400 mr-3 mt-1" />
                <div>
                  <h4 className="font-medium text-white">Call Us</h4>
                  <a
                    href="tel:+919876543210"
                    className="text-lavender-200 hover:text-white"
                  >
                    +91 98765 43210
                  </a>
                </div>
              </div>
            </div>

            {/* Campus Ambassadors */}
            <div className="backdrop-blur-sm bg-purple-800/20 rounded-lg p-4 border border-purple-500/20">
              <div className="flex items-start">
                <RiUserHeartLine className="text-xl text-purple-400 mr-3 mt-1" />
                <div>
                  <h4 className="font-medium text-white">Campus Ambassadors</h4>
                  <p className="text-lavender-200">
                    Reach out to your campus ambassadors for updates and events
                    happening in μLearn AJCE.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-purple-200 border-t border-purple-500/30 pt-8 mt-8">
          © {new Date().getFullYear()} μlearn AJCE. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
