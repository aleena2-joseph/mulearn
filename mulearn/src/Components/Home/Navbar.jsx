import { useState, useEffect } from "react";

export default function Navbar({
  onAboutClick,
  onHighlightsClick,
  onHeroClick,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("home");

  const handleItemClick = (id) => {
    setActiveItem(id);
    if (id === "home" && onHeroClick) {
      onHeroClick();
    } else if (id === "about" && onAboutClick) {
      onAboutClick();
    } else if (id === "highlights" && onHighlightsClick) {
      onHighlightsClick();
    } else if (id === "team") {
      const section = document.getElementById("ourTeam-section");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    } else if (id === "contact") {
      const section = document.getElementById("footer");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "highlights", label: "Highlights" },
    { id: "team", label: "Our Team" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-purple-900/80 backdrop-blur-md shadow-lg shadow-purple-900/10"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex ml-10 items-center space-x-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`relative px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 overflow-hidden ${
                  activeItem === item.id
                    ? "text-white"
                    : "text-purple-200 hover:text-white"
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                {activeItem === item.id && (
                  <span className="absolute inset-0 bg-purple-600 rounded-lg -z-0"></span>
                )}
                <span className="absolute inset-0 bg-purple-600 rounded-lg scale-0 transition-transform duration-300 ease-out origin-bottom-right hover:scale-100 -z-0"></span>
              </button>
            ))}
          </div>

          {/* Auth Buttons - Desktop
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <button className="text-purple-200 hover:text-white px-4 py-2 rounded-lg transition-all duration-300 hover:bg-purple-800/30">
                Log In
              </button>
            </Link>
            <Link to="/signup">
              <button className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 group">
                <span className="relative z-10">Sign Up</span>
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
              </button>
            </Link>
          </div> */}

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-purple-200 hover:text-white focus:outline-none transition-colors duration-300"
            >
              <div className="relative w-6 h-5">
                <span
                  className={`absolute h-0.5 w-full bg-current transform transition-all duration-300 ${
                    isMobileMenuOpen ? "rotate-45 top-2" : "top-0"
                  }`}
                />
                <span
                  className={`absolute h-0.5 w-full bg-current top-2 transition-all duration-300 ${
                    isMobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute h-0.5 w-full bg-current transform transition-all duration-300 ${
                    isMobileMenuOpen ? "-rotate-45 top-2" : "top-4"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen
            ? "max-h-screen opacity-100 pb-4"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-4 py-2 space-y-2 bg-purple-900/80 backdrop-blur-md">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                handleItemClick(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                activeItem === item.id
                  ? "bg-purple-700 text-white"
                  : "text-purple-200 hover:bg-purple-800 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
          {/* <div className="pt-2 space-y-2">
            <Link to="/login">
              <button className="w-full text-purple-200 hover:text-white px-4 py-3 rounded-lg transition-all duration-300 hover:bg-purple-800 text-left">
                Log In
              </button>
            </Link>
            <Link to="/signup">
              <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-lg transition-all duration-300 hover:from-indigo-600 hover:to-purple-600 text-left">
                Sign Up
              </button>
            </Link>
          </div> */}
        </div>
      </div>
    </nav>
  );
}
