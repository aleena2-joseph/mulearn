import React, { useEffect, useRef, forwardRef } from "react";
import {
  ArrowRight,
  BookOpen,
  Users,
  Target,
  Code,
  Rocket,
} from "lucide-react";

const Hero = forwardRef((props, ref) => {
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const orb3Ref = useRef(null);
  const meshRef = useRef(null);

  useEffect(() => {
    const animateOrb = (element, delay = 0, duration = 4000) => {
      if (element) {
        element.style.animation = `advancedFloat ${duration}ms ease-in-out infinite`;
        element.style.animationDelay = `${delay}ms`;
      }
    };

    animateOrb(orb1Ref.current, 0, 6000);
    animateOrb(orb2Ref.current, 2000, 8000);
    animateOrb(orb3Ref.current, 4000, 7000);

    if (meshRef.current) {
      meshRef.current.style.animation = "meshRotate 20s linear infinite";
    }
  }, []);

  const handleJoinClick = () => {
    window.open("https://app.mulearn.org/register", "_blank");
  };

  const handleExploreClick = () => {
    window.open("https://mulearn.org/", "_blank");
  };

  return (
    <>
      <style>{`
        @keyframes advancedFloat {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); }
          25% { transform: translate3d(30px, -40px, 20px) rotate(5deg) scale(1.1); }
          50% { transform: translate3d(-20px, -60px, 10px) rotate(-3deg) scale(0.95); }
          75% { transform: translate3d(40px, -30px, -15px) rotate(8deg) scale(1.05); }
        }

        @keyframes meshRotate {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(1); }
        }

        @keyframes slideInScale {
          from { opacity: 0; transform: translateY(40px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-60px) rotateY(-10deg); }
          to { opacity: 1; transform: translateX(0) rotateY(0deg); }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px) rotateY(10deg); }
          to { opacity: 1; transform: translateX(0) rotateY(0deg); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse3d {
          0%, 100% { transform: scale3d(1, 1, 1); }
          50% { transform: scale3d(1.1, 1.1, 1.1); }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .animate-slide-scale { animation: slideInScale 1s ease-out forwards; }
        .animate-slide-left { animation: slideInLeft 0.8s ease-out forwards; }
        .animate-slide-right { animation: slideInRight 0.8s ease-out forwards; }
        .animate-fade-up { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; animation-delay: 0.4s; }
        .animate-pulse-3d { animation: pulse3d 3s ease-in-out infinite; }

        .gradient-text {
          background: linear-gradient(135deg, #8b5cf6, #a855f7, #c084fc, #ddd6fe);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200%;
          animation: shimmer 3s ease-in-out infinite;
        }

        .gradient-border {
          background: linear-gradient(135deg, #8b5cf6, #a855f7, #c084fc);
          padding: 2px;
          border-radius: 20px;
        }

        .glass-morphism {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 25px 45px rgba(139, 92, 246, 0.1);
        }

        .advanced-shadow {
          box-shadow: 0 20px 25px -5px rgba(139, 92, 246, 0.1),
                      0 10px 10px -5px rgba(139, 92, 246, 0.04),
                      0 0 0 1px rgba(139, 92, 246, 0.05);
        }

        .mesh-gradient {
          background: radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.3) 0%, transparent 50%),
                      radial-gradient(circle at 40% 40%, rgba(192, 132, 252, 0.2) 0%, transparent 50%);
        }

        .floating-orb {
          border-radius: 50%;
          filter: blur(1px);
        }
      `}</style>

      <section
        ref={ref}
        className="relative min-h-screen bg-white overflow-hidden"
      >
        <div className="absolute inset-0 mesh-gradient">
          <div
            ref={orb1Ref}
            className="floating-orb absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-violet-400 via-purple-500 to-violet-600 opacity-20"
          />
          <div
            ref={orb2Ref}
            className="floating-orb absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-purple-400 via-violet-500 to-purple-600 opacity-25"
          />
          <div
            ref={orb3Ref}
            className="floating-orb absolute bottom-1/4 left-1/3 w-40 h-40 bg-gradient-to-br from-violet-300 via-purple-400 to-violet-500 opacity-15"
          />

          <div
            ref={meshRef}
            className="absolute top-20 right-20 w-64 h-64 opacity-10"
          >
            <div className="w-full h-full bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl transform rotate-45"></div>
          </div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center">
          <div className="container mx-auto px-8 py-12">
            <div className="text-center mb-20 animate-slide-scale mt-10">
              <div className="inline-block mb-6">
                <div className="gradient-border">
                  <div className="bg-white px-8 py-3 rounded-2xl">
                    <span className="text-violet-700 font-semibold text-sm">
                      AMAL JYOTHI COLLEGE OF ENGINEERING
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-6xl lg:text-8xl font-bold mb-8 leading-tight">
                <span className="gradient-text">μLearn</span>
                <br />
                <span className="text-gray-800">AJCE</span>
              </h1>

              <p className="text-xl lg:text-2xl text-gray-600 max-w-5xl mx-auto leading-relaxed mb-8">
                Empowering AJCE students through peer-to-peer learning,
                collaborative projects, and industry-ready skill development.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-up">
                <button
                  onClick={handleJoinClick}
                  className="group bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 text-white px-10 py-5 rounded-full text-xl font-bold hover:shadow-2xl transition-all duration-500 transform hover:scale-105 flex items-center gap-4 advanced-shadow"
                >
                  Join μLearn
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </button>

                <button
                  onClick={handleExploreClick}
                  className="group glass-morphism text-violet-700 px-10 py-5 rounded-full text-xl font-bold hover:shadow-xl transition-all duration-500 transform hover:scale-105 flex items-center gap-4"
                >
                  Explore More
                  <BookOpen className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid lg:grid-cols-2 gap-12 mb-20 animate-slide-left">
              <div className="glass-morphism p-8 rounded-3xl advanced-shadow">
                <div className="flex items-start gap-6 mb-6">
                  <Users className="w-10 h-10 text-violet-600" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Peer Learning</h3>
                    <p className="text-gray-700">
                      Collaborate and grow with like-minded peers in real-time
                      learning environments.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-morphism p-8 rounded-3xl advanced-shadow">
                <div className="flex items-start gap-6 mb-6">
                  <Target className="w-10 h-10 text-purple-600" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      Goal-Oriented Growth
                    </h3>
                    <p className="text-gray-700">
                      Set learning targets, track progress, and gain verifiable
                      skills that matter.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-morphism p-8 rounded-3xl advanced-shadow">
                <div className="flex items-start gap-6 mb-6">
                  <Code className="w-10 h-10 text-indigo-600" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Tech Exploration</h3>
                    <p className="text-gray-700">
                      Learn coding, web development, data science, and more with
                      hands-on practice.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-morphism p-8 rounded-3xl advanced-shadow">
                <div className="flex items-start gap-6 mb-6">
                  <Rocket className="w-10 h-10 text-fuchsia-600" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Career Launchpad</h3>
                    <p className="text-gray-700">
                      Build your resume, join projects, and connect with mentors
                      and industry experts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
});

Hero.displayName = "Hero";

export default Hero;
