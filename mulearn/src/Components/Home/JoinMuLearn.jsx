import { useRef, useEffect, useState } from "react";

const JoinMuLearn = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (section) {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (sectionTop < windowHeight * 0.75) {
          setIsVisible(true);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on initial load

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const benefits = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
      title: "Innovative Learning",
      description:
        "Access cutting-edge curriculum and hands-on projects designed to develop real-world skills.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "Industry Network",
      description:
        "Connect with industry professionals, mentors, and like-minded peers to expand your opportunities.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      ),
      title: "Career Advancement",
      description:
        "Build a portfolio of projects and earn certifications that set you apart in the job market.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
      ),
      title: "Global Community",
      description:
        "Join a diverse community of learners from around the world, collaborating on impactful projects.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="join-mulearn-section"
      className={`py-20 bg-gradient-to-b from-white via-lavender-50 to-lavender-100 transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-lavender-900 mb-4">
            Join <span className="text-purple-600">μLearn</span>
          </h2>
          <p className="text-xl text-lavender-700 max-w-3xl mx-auto">
            Unlock your potential and accelerate your growth through our
            innovative learning community
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Video Section */}
          <div className="w-full lg:w-1/2 rounded-2xl overflow-hidden shadow-xl shadow-lavender-200/50 border border-lavender-200">
            <div className="relative pb-[56.25%]">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/3sycnoFCeaM?si=oVba5bKU-whPtseL"
                title="MuLearn Introduction Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="w-full lg:w-1/2">
            <h3 className="text-2xl font-bold text-lavender-800 mb-6">
              Why Join μLearn?
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-lavender-200/50"
                >
                  <div className="text-purple-600 mb-4">{benefit.icon}</div>
                  <h4 className="text-lg font-bold text-lavender-800 mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-lavender-600">{benefit.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <a
                href="https://app.mulearn.org/register"
                className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Become a Member
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .aspect-w-16 {
          position: relative;
          padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
        }
        .aspect-h-9 {
          position: relative;
        }
        .aspect-w-16 iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .from-lavender-50 {
          --tw-gradient-from: #faf5ff;
        }
        .to-lavender-100 {
          --tw-gradient-to: #f3e8ff;
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
        .shadow-lavender-200\\/50 {
          box-shadow: 0 10px 15px -3px rgba(233, 213, 255, 0.5);
        }
        .border-lavender-200\\/50 {
          border-color: rgba(233, 213, 255, 0.5);
        }
      `}</style>
    </section>
  );
};

export default JoinMuLearn;
