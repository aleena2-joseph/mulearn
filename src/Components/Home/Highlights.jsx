import { useRef, useEffect, forwardRef, useState } from "react";
import img1 from "../../assets/highlights1.jpg";
import img2 from "../../assets/awards.jpg";
import img3 from "../../assets/workshop.jpg";
import img4 from "../../assets/react.jpg";
import permute1 from "../../assets/events/permute (1).jpg";
import permute2 from "../../assets/events/permute (2).jpg";
import permute3 from "../../assets/events/permute (3).jpg";
import permute4 from "../../assets/events/permute (4).jpg";
import permute5 from "../../assets/events/permute (5).jpg";
import permute6 from "../../assets/events/permute (6).jpg";
import permute7 from "../../assets/events/permute (7).jpg";
import permute8 from "../../assets/events/permute (8).jpg";
import award2 from "../../assets/events/award2.jpg";
import react1_1 from "../../assets/events/react1 (2).jpg";
import react1_2 from "../../assets/events/react1 (3).jpg";
import react1_3 from "../../assets/events/react1 (1).jpg";
import react2_1 from "../../assets/events/react 2 (1).jpg";
import react2_2 from "../../assets/events/react 2 (2).jpg";
import react2_3 from "../../assets/events/react 2 (3).jpg";
import react2_4 from "../../assets/events/react 2 (4).jpg";
import react2_5 from "../../assets/events/react 2 (5).jpg";
import react2_6 from "../../assets/events/react 2 (6).jpg";
import react3_1 from "../../assets/events/react3 (1).jpg";
import react3_2 from "../../assets/events/react3 (2).jpg";
import react3_3 from "../../assets/events/react3 (3).jpg";
import mufest1_1 from "../../assets/events/mufest1 (1).jpg";
import mufest1_2 from "../../assets/events/mufest1 (2).jpg";
import mufest1_3 from "../../assets/events/mufest1 (3).jpg";
import mufest1_4 from "../../assets/events/mufest1 (4).jpg";
import mufest3_1 from "../../assets/events/mufest3 (1).jpg";
import mufest3_2 from "../../assets/events/mufest3 (2).jpg";
import mufest3_3 from "../../assets/events/mufest3 (3).jpg";
import mufest3_4 from "../../assets/events/mufest3 (4).jpg";
import mufest3_5 from "../../assets/events/mufest3 (5).jpg";
import mufest3_6 from "../../assets/events/mufest3 (6).jpg";
const Highlights = forwardRef((props, ref) => {
  const scrollerRef = useRef(null);
  const scrollerInnerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  // Additional high-resolution images for the popup
  const popupImages = [
    {
      id: 1,
      src: img1,
      alt: "Perμte'25 Full View",
      title: "Perμte'25",
      desc: "The µLearn AJCE team had the wonderful opportunity to participate in Perµte 2025, the flagship event of the µLearn Foundation. It was an inspiring experience where we connected with CEOs, industry leaders, and passionate individuals, explored innovative projects, and built valuable networks. The event featured fun activities, engaging discussions, and showcased the true spirit of collaboration, innovation, and skill development. We are grateful to µLearn for providing such an enriching platform and look forward to applying these experiences in our future journey!",
      additionalImages: [
        { src: permute1, alt: "Perμte'25" },
        { src: permute2, alt: "Perμte'25" },
        { src: permute3, alt: "Perμte'25" },
        { src: permute4, alt: "Perμte'25" },
        { src: permute5, alt: "Perμte'25" },
        { src: permute6, alt: "Perμte'25" },
        { src: permute7, alt: "Perμte'25" },
        { src: permute8, alt: "Perμte'25" },
      ],
    },
    {
      id: 2,
      src: img2,
      alt: "Appreciations Full View",
      title: "Token of Appreciation",
      desc: "To express our heartfelt gratitude, µLearn AJCE presented a small memento to Navya Lizabeth for leading the React Hands-On Workshop. Her dedication, guidance, and effort made the sessions truly impactful for all participants. We deeply appreciate her support in empowering the community through learning and inspiration.",
      additionalImages: [
        { src: img2, alt: "Token of Appreciation" },
        { src: award2, alt: "Token of Appreciation" },
      ],
    },
    {
      id: 3,
      src: img3,
      alt: "μFest Full View",
      title: "μFest",
      desc: "µLearn AJCE organized MuFest, a 3-day offline event held from January 7–9, 2025, led by Campus Lead Aibal Jose. The event kicked off with an orientation session introducing participants to µLearn’s vision and community. On the second day, attendees explored the concept of karma mining through interactive activities, encouraging skill development and collaboration. The final day featured a hands-on no-code app development workshop, where participants brought their creative ideas to life, making the event a transformative and inspiring experience.",
      additionalImages: [
        { src: mufest1_1, alt: "Day 1: μFest Opening Ceremony" },
        { src: mufest1_2, alt: "Day 1: μFest Opening Ceremony" },
        { src: mufest1_3, alt: "μFest Day 2" },
        { src: mufest1_4, alt: "μFest Day 2" },
        { src: mufest3_1, alt: "μFest Day 3" },
        { src: mufest3_2, alt: "μFest Day 3" },
        { src: mufest3_3, alt: "μFest Day 3" },
        { src: mufest3_4, alt: "μFest Day 3" },
        { src: mufest3_5, alt: "μFest Day 3" },
        { src: mufest3_6, alt: "μFest Day 3" },
      ],
    },
    {
      id: 4,
      src: img4,
      alt: "React Workshop Full View",
      title: "React Workshop",
      desc: "µLearn AJCE successfully conducted a 3-day React Hands-On Workshop from March 10–12, 2025, led by Navya Lizabeth. Designed for coding enthusiasts, the workshop offered a fun, beginner-friendly environment focused on real coding rather than just theory. Participants actively built projects, tackled challenges, and received guidance whenever needed, making it a valuable and engaging experience for those looking to level up their React skills",
      additionalImages: [
        { src: react1_1, alt: "React Workshop Day 1" },
        { src: react1_2, alt: "React Workshop Day 1" },
        { src: react1_3, alt: "React Workshop Day 1" },
        { src: react2_1, alt: "React Workshop Day 2" },
        { src: react2_2, alt: "React Workshop Day 2" },
        { src: react2_3, alt: "React Workshop Day 2" },
        { src: react2_4, alt: "React Workshop Day 2" },
        { src: react2_5, alt: "React Workshop Day 2" },
        { src: react2_6, alt: "React Workshop Day 2" },
        { src: react3_1, alt: "React Workshop Day 3" },
        { src: react3_2, alt: "React Workshop Day 3" },
        { src: react3_3, alt: "React Workshop Day 3" },
      ],
    },
  ];

  const images = [
    {
      id: 1,
      src: img1,
      alt: "Highlight Image 1",
      title: "Perμte'25",
      desc: "µLearn's Skill Festival",
    },
    {
      id: 2,
      src: img2,
      alt: "Appreciations",
      title: "Appreciations",
      desc: "Honoring Excellence at µLearn",
    },
    {
      id: 3,
      src: img3,
      alt: "Highlight Image 3",
      title: "μFest",
      desc: "MuLearn's 3-Day Event",
    },
    {
      id: 4,
      src: img4,
      alt: "Highlight Image 4",
      title: "React Workshop",
      desc: "React Hands-On Workshop",
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

  // Handle image click
  const handleImageClick = (imageId) => {
    const popupImage = popupImages.find((img) => img.id === imageId);
    if (popupImage) {
      setSelectedImage(popupImage);
      setShowModal(true);
      // Pause scrolling when modal is open
      document.body.style.overflow = "hidden";
    }
  };

  // Close the modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedImage(null);
    // Resume scrolling
    document.body.style.overflow = "auto";
  };

  // Image carousel navigation in modal
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    if (selectedImage) {
      setCurrentImageIndex((prev) =>
        prev === selectedImage.additionalImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedImage) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedImage.additionalImages.length - 1 : prev - 1
      );
    }
  };

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
              className="scroller-item flex-shrink-0 w-72 h-96 group relative rounded-xl overflow-hidden shadow-lg shadow-lavender-300/40 border border-lavender-200/40 bg-white cursor-pointer"
              onClick={() => handleImageClick(image.id)}
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
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {showModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-full overflow-hidden relative flex flex-col md:flex-row">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md z-50 hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-lavender-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Main image and carousel */}
            <div className="md:w-2/3 w-full relative bg-black">
              {/* Main Image */}
              <div className="relative h-96 md:h-full">
                <img
                  src={selectedImage.additionalImages[currentImageIndex].src}
                  alt={selectedImage.additionalImages[currentImageIndex].alt}
                  className="w-full h-full object-contain"
                />

                {/* Navigation arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Thumbnail navigation */}
              <div className="flex justify-center bg-black bg-opacity-50 p-2 absolute bottom-0 w-full">
                {selectedImage.additionalImages.map((img, idx) => (
                  <div
                    key={idx}
                    className={`w-12 h-12 mx-1 rounded overflow-hidden border-2 cursor-pointer ${
                      currentImageIndex === idx
                        ? "border-lavender-400"
                        : "border-transparent"
                    }`}
                    onClick={() => setCurrentImageIndex(idx)}
                  >
                    <img
                      src={img.src}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="md:w-1/3 w-full p-6 overflow-y-auto">
              <h2 className="text-2xl font-bold text-lavender-800 mb-2">
                {selectedImage.title}
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Image {currentImageIndex + 1} of{" "}
                {selectedImage.additionalImages.length}
              </p>
              <h3 className="font-medium text-lavender-600 mb-6">
                {selectedImage.additionalImages[currentImageIndex].alt}
              </h3>
              <p className="text-gray-700">{selectedImage.desc}</p>
            </div>
          </div>
        </div>
      )}

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
