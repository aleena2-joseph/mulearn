// import { useState, useEffect } from "react";
// import Image1 from "../../assets/hero_img1.png";
// import Image2 from "../../assets/hero_img2.png";
// import Image3 from "../../assets/hero_img3.png";

// const ImageList = [
//   {
//     id: 1,
//     img: Image1,
//     title: "Learn. Connect. Grow.",
//     description:
//       "Join a thriving community of learners and innovators dedicated to building skills and fostering collaboration.",
//   },
//   {
//     id: 2,
//     img: Image2,
//     title: "Unlock Your Potential",
//     description:
//       "Discover personalized learning paths, expert mentorship, and hands-on projects to accelerate your tech journey.",
//   },
//   {
//     id: 3,
//     img: Image3,
//     title: "Build for Tomorrow",
//     description:
//       "Gain the skills that matter in today's rapidly evolving tech landscape and prepare for the future of innovation.",
//   },
// ];

// export default function Hero() {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isAnimating, setIsAnimating] = useState(false);

//   // Auto slide effect
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIsAnimating(true);
//       setTimeout(() => {
//         setCurrentSlide((prev) => (prev + 1) % ImageList.length);
//         setIsAnimating(false);
//       }, 500);
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   // Manual navigation
//   const goToSlide = (index) => {
//     if (currentSlide === index) return;
//     setIsAnimating(true);
//     setTimeout(() => {
//       setCurrentSlide(index);
//       setIsAnimating(false);
//     }, 500);
//   };

//   return (
//     <section className="relative overflow-hidden min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-violet-950">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 w-full h-full">
//         {/* Gradient orbs */}
//         <div className="absolute top-0 left-0 w-full h-full opacity-30">
//           <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
//           <div className="absolute top-1/3 right-0 w-80 h-80 bg-indigo-400 rounded-full mix-blend-screen filter blur-3xl animate-pulse animation-delay-2000"></div>
//           <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-fuchsia-400 rounded-full mix-blend-screen filter blur-3xl animate-pulse animation-delay-4000"></div>
//         </div>

//         {/* Mesh grid overlay */}
//         <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

//         {/* Starry background */}
//         <div className="absolute inset-0">
//           {[...Array(100)].map((_, i) => (
//             <div
//               key={i}
//               className="absolute rounded-full bg-white"
//               style={{
//                 width: `${Math.random() * 3 + 1}px`,
//                 height: `${Math.random() * 3 + 1}px`,
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//                 opacity: Math.random() * 0.7 + 0.3,
//                 animation: `twinkle ${
//                   Math.random() * 5 + 3
//                 }s infinite ease-in-out alternate`,
//                 animationDelay: `${Math.random() * 5}s`,
//               }}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Content Container */}
//       <div className="container mx-auto px-4 py-12 relative z-10 flex min-h-screen items-center">
//         <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
//           {/* Text content section - takes 6 columns on large screens */}
//           <div className="lg:col-span-6 flex flex-col justify-center space-y-8">
//             <div
//               className={`transition-all duration-700 transform ${
//                 isAnimating
//                   ? "opacity-0 -translate-y-4"
//                   : "opacity-100 translate-y-0"
//               }`}
//             >
//               {/* Badge */}
//               <div className="inline-flex items-center bg-gradient-to-r from-purple-600/30 to-fuchsia-600/30 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-purple-500/20">
//                 <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse mr-2"></div>
//                 <span className="text-purple-200 font-medium">μlearn Ajce</span>
//               </div>

//               {/* Heading with gradient text */}
//               <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
//                 <span className="bg-gradient-to-r from-white via-purple-200 to-indigo-200 text-transparent bg-clip-text">
//                   {ImageList[currentSlide].title}
//                 </span>
//               </h1>

//               {/* Description with improved styling */}
//               <p className="text-xl text-purple-100 mb-8 max-w-xl leading-relaxed">
//                 {ImageList[currentSlide].description}
//               </p>

//               {/* CTA Buttons with refined style */}
//               <div className="flex flex-wrap gap-4 mb-10">
//                 <button className="relative group overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30">
//                   <span className="relative z-10">Get Started</span>
//                   <span className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
//                 </button>
//                 <button className="relative overflow-hidden text-purple-100 font-medium py-3 px-8 rounded-lg border border-purple-400/30 transition-all duration-300 hover:border-purple-400/60 hover:bg-purple-500/10">
//                   <span className="relative z-10">Learn More</span>
//                   <span className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
//                 </button>
//               </div>

//               {/* Slide indicators */}
//               <div className="flex gap-3">
//                 {ImageList.map((_, index) => (
//                   <button
//                     key={index}
//                     onClick={() => goToSlide(index)}
//                     className={`relative h-2 rounded-full transition-all duration-500 ${
//                       currentSlide === index
//                         ? "w-12 bg-gradient-to-r from-purple-400 to-fuchsia-500"
//                         : "w-2 bg-purple-400/40"
//                     }`}
//                     aria-label={`Go to slide ${index + 1}`}
//                   >
//                     {currentSlide === index && (
//                       <span className="absolute inset-0 rounded-full animate-pulse bg-purple-400/50"></span>
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Image section - takes 6 columns on large screens */}
//           <div className="lg:col-span-6">
//             <div
//               className={`relative transition-all duration-700 transform ${
//                 isAnimating
//                   ? "opacity-0 translate-x-8"
//                   : "opacity-100 translate-x-0"
//               }`}
//             >
//               {/* Decorative elements */}
//               <div className="absolute -top-16 -right-16 w-32 h-32 bg-purple-500/10 rounded-full"></div>
//               <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-indigo-500/10 rounded-full"></div>

//               {/* Geometric shapes */}
//               <div className="absolute top-1/4 -left-4 w-8 h-8 border-2 border-purple-400/20 rotate-45"></div>
//               <div className="absolute bottom-1/3 -right-6 w-12 h-12 border-2 border-indigo-400/20 rounded-full"></div>

//               {/* Main image display */}
//               <div className="relative rounded-2xl backdrop-blur-sm border border-purple-400/20 shadow-2xl shadow-purple-900/30 overflow-hidden transition-all duration-500">
//                 {/* Glow effect behind image */}
//                 <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-indigo-600/10 to-fuchsia-600/20 z-0"></div>

//                 {/* Ambient light effects */}
//                 <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-400/20 rounded-full blur-2xl"></div>
//                 <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl"></div>

//                 {/* Image container with reflection effect */}
//                 <div className="relative z-10 p-6">
//                   <div className="relative">
//                     <img
//                       src={ImageList[currentSlide].img}
//                       alt={ImageList[currentSlide].title}
//                       className="w-full h-auto object-contain z-10 relative"
//                     />

//                     {/* Subtle reflection */}
//                     <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-white/10 to-transparent blur-sm transform scale-y-[-1] opacity-30"></div>
//                   </div>
//                 </div>

//                 {/* Animated border glow */}
//                 <div className="absolute inset-0 rounded-2xl border border-purple-400/30 z-20 overflow-hidden">
//                   <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent animate-border-flow"></div>
//                   <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent animate-border-flow animation-delay-2000"></div>
//                   <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-purple-400/50 to-transparent animate-border-flow-vertical"></div>
//                   <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-indigo-400/50 to-transparent animate-border-flow-vertical animation-delay-2000"></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom decorative wave with improved styling */}
//       <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 1440 320"
//           className="w-full"
//         >
//           <path
//             fill="rgba(139, 92, 246, 0.07)"
//             d="M0,160L40,149.3C80,139,160,117,240,128C320,139,400,181,480,208C560,235,640,245,720,229.3C800,213,880,171,960,144C1040,117,1120,107,1200,122.7C1280,139,1360,181,1400,202.7L1440,224L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
//           ></path>
//         </svg>
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 1440 320"
//           className="w-full absolute bottom-0"
//         >
//           <path
//             fill="rgba(124, 58, 237, 0.05)"
//             d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,224C672,213,768,171,864,149.3C960,128,1056,128,1152,149.3C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
//           ></path>
//         </svg>
//       </div>

//       {/* Add CSS animations to your global styles */}
//       <style jsx global>{`
//         @keyframes twinkle {
//           0%,
//           100% {
//             opacity: 0.3;
//           }
//           50% {
//             opacity: 1;
//           }
//         }

//         @keyframes border-flow {
//           0% {
//             transform: translateX(-100%);
//           }
//           100% {
//             transform: translateX(100%);
//           }
//         }

//         @keyframes border-flow-vertical {
//           0% {
//             transform: translateY(-100%);
//           }
//           100% {
//             transform: translateY(100%);
//           }
//         }

//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }

//         .animation-delay-4000 {
//           animation-delay: 4s;
//         }
//       `}</style>
//     </section>
//   );
// }
import { useState, useEffect } from "react";
import Image1 from "../../assets/hero_img1.png";
import Image2 from "../../assets/hero_img2.png";
import Image3 from "../../assets/hero_img3.png";

const ImageList = [
  {
    id: 1,
    img: Image1,
    title: "Learn. Connect. Grow.",
    description:
      "Join a thriving community of learners and innovators dedicated to building skills and fostering collaboration.",
  },
  {
    id: 2,
    img: Image2,
    title: "Unlock Your Potential",
    description:
      "Discover personalized learning paths, expert mentorship, and hands-on projects to accelerate your tech journey.",
  },
  {
    id: 3,
    img: Image3,
    title: "Build for Tomorrow",
    description:
      "Gain the skills that matter in today's rapidly evolving tech landscape and prepare for the future of innovation.",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % ImageList.length);
        setIsAnimating(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Manual navigation
  const goToSlide = (index) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimating(false);
    }, 500);
  };

  // Particle effect component
  const Particles = () => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-4 h-4 rounded-full bg-purple-500 opacity-20 animate-float`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex justify-center items-center">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 -right-32 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        {/* Floating particles */}
        <Particles />

        {/* Hero content */}
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Text content section */}
            <div
              className={`flex flex-col justify-center gap-6 text-center lg:text-left transition-opacity duration-500 ${
                isAnimating ? "opacity-0" : "opacity-100"
              }`}
            >
              <div className="inline-block bg-purple-800/30 backdrop-blur-sm px-4 py-1 rounded-full text-purple-200 text-sm font-medium mb-2 mx-auto lg:mx-0">
                μlearn Ajce
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {ImageList[currentSlide].title}
              </h1>

              <p className="text-lg text-purple-200 max-w-lg mx-auto lg:mx-0">
                {ImageList[currentSlide].description}
              </p>

              <div className="flex flex-wrap gap-4 mt-4 justify-center lg:justify-start">
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-1">
                  Get Started
                </button>
                <button className="bg-transparent border-2 border-purple-500 text-purple-200 font-medium py-3 px-6 rounded-lg transition-all duration-300 hover:bg-purple-500/10 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1">
                  Learn More
                </button>
              </div>

              {/* Slide indicators */}
              <div className="flex justify-center lg:justify-start gap-2 mt-6">
                {ImageList.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentSlide === index
                        ? "bg-purple-400 w-8"
                        : "bg-purple-600/40 hover:bg-purple-500/60"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Image section with animation */}
            <div
              className={`relative transition-all duration-500 ${
                isAnimating
                  ? "translate-x-8 opacity-0"
                  : "translate-x-0 opacity-100"
              }`}
            >
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -top-8 -right-8 w-20 h-20 bg-purple-500/20 rounded-full animate-pulse"></div>
                <div
                  className="absolute -bottom-8 -left-8 w-16 h-16 bg-indigo-500/20 rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>

                {/* Main image with glow effect */}
                <div className="relative bg-gradient-to-tr from-purple-600/20 to-indigo-600/20 rounded-2xl p-2 backdrop-blur-sm border border-purple-500/20 shadow-xl shadow-purple-900/30">
                  <img
                    src={ImageList[currentSlide].img}
                    alt="μlearn showcase"
                    className="w-full h-auto rounded-xl object-cover shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-indigo-500/10 rounded-xl mix-blend-overlay"></div>
                </div>

                {/* Tech pattern overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-grid-pattern"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="w-full"
          >
            <path
              fill="rgba(139, 92, 246, 0.15)"
              fillOpacity="1"
              d="M0,224L40,213.3C80,203,160,181,240,186.7C320,192,400,224,480,218.7C560,213,640,171,720,170.7C800,171,880,213,960,218.7C1040,224,1120,192,1200,176C1280,160,1360,160,1400,160L1440,160L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
}
