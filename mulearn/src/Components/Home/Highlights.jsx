import { useRef, useEffect, forwardRef, useState } from "react";
import img1 from "../../assets/highlights1.jpg";
import img2 from "../../assets/vr.jpg";
import img3 from "../../assets/workshop.jpg";
import img4 from "../../assets/react.jpg";
const Highlights = forwardRef((props, ref) => {
  const scrollerRef = useRef(null);
  const scrollerInnerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("highlights-section");
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

  const images = [
    {
      id: 1,
      src: img1,
      alt: "Highlight Image 1",
      title: "Community Events",
      desc: "Connect with fellow members",
    },
    {
      id: 2,
      src: img2,
      alt: "Highlight Image 2",
      title: "Tech Workshops",
      desc: "Learn cutting-edge skills",
    },
    {
      id: 3,
      src: img3,
      alt: "Highlight Image 3",
      title: "Project Showcases",
      desc: "See innovation in action",
    },
    {
      id: 4,
      src: img4,
      alt: "Highlight Image 4",
      title: "Hackathons",
      desc: "Collaborative problem solving",
    },
    {
      id: 5,
      src: "img5",
      alt: "Highlight Image 5",
      title: "Mentorship Programs",
      desc: "Learn from industry experts",
    },
    {
      id: 6,
      src: "img6",
      alt: "Highlight Image 6",
      title: "Networking Sessions",
      desc: "Build valuable connections",
    },
  ];

  const allImages = [...images, ...images];

  useEffect(() => {
    if (!scrollerRef.current || !scrollerInnerRef.current) return;

    const scrollerInner = scrollerInnerRef.current;
    const scrollerContent = Array.from(scrollerInner.children);

    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      duplicatedItem.setAttribute("aria-hidden", true);
      scrollerInner.appendChild(duplicatedItem);
    });

    scrollerInner.classList.add("animate-scroll");

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

  return (
    <section
      id="highlights-section"
      ref={ref}
      className={`py-16 bg-gradient-to-b from-lavender-100 via-white to-white overflow-hidden relative transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Light lavender top gradient overlay */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-lavender-200 to-transparent z-10 pointer-events-none"></div>

      {/* Section header */}
      <div className="container mx-auto px-4 mb-12 text-center relative z-20">
        <div className="text-3xl md:text-4xl font-bold mb-4 text-lavender-800">
          <h4 className="text-purple-500 text-xxl font-bold">Our Highlights</h4>
        </div>

        <p className="text-lavender-600 max-w-2xl mx-auto">
          Discover the diverse activities and opportunities that make our
          community special. From hands-on workshops to collaborative projects,
          there's something for everyone.
        </p>
      </div>

      {/* Infinite image scroller */}
      <div
        ref={scrollerRef}
        className="scroller relative max-w-7xl mx-auto overflow-hidden mask-edges z-20"
        aria-label="Highlight images gallery"
      >
        <div
          ref={scrollerInnerRef}
          className="scroller-inner flex gap-4 py-4 w-max"
        >
          {allImages.map((image, index) => (
            <div
              key={`${image.id}-${index}`}
              className="scroller-item flex-shrink-0 w-72 h-96 group relative rounded-xl overflow-hidden shadow-lg shadow-lavender-300/40 border border-lavender-200/40 bg-white"
            >
              {/* Image */}
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent opacity-80 z-10"></div>
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform transition-transform duration-500 group-hover:translate-y-0 translate-y-6">
                <div className="w-12 h-1 bg-lavender-400 rounded-full mb-4 transform origin-left transition-transform duration-500 group-hover:scale-x-100 scale-x-0"></div>
                <h3 className="text-xl font-bold text-lavender-800 mb-2">
                  {image.title}
                </h3>
                <p className="text-lavender-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  {image.desc}
                </p>
              </div>

              {/* Decorative element */}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-lavender-200/30 backdrop-blur-sm border border-lavender-300/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-20"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .mask-edges {
          mask-image: linear-gradient(
            to right,
            transparent,
            black 10%,
            black 90%,
            transparent
          );
        }

        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-50% - 8px));
          }
        }

        .animate-scroll {
          animation: scroll 60s linear infinite; /* slower scroll */
        }

        .pause-animation {
          animation-play-state: paused;
        }

        /* Light lavender colors */
        .from-lavender-100 {
          --tw-gradient-from: #f3e8ff;
        }
        .from-lavender-200 {
          --tw-gradient-from: #e9d5ff;
        }
        .from-lavender-400 {
          --tw-gradient-from: #c084fc;
        }
        .text-lavender-600 {
          color: #7e22ce;
        }
        .text-lavender-800 {
          color: #581c87;
        }
        .shadow-lavender-300\\/40 {
          box-shadow: 0 10px 15px -3px rgba(216, 180, 254, 0.4);
        }
        .border-lavender-200\\/40 {
          border-color: rgba(233, 213, 255, 0.4);
        }
      `}</style>
    </section>
  );
});

export default Highlights;
