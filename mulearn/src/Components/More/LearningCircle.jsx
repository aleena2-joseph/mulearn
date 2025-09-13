import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // Adjust path as needed
import {
  Users,
  Code,
  Shield,
  Globe,
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  Loader,
  AlertCircle,
} from "lucide-react";

const LearningCircle = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [learningCircles, setLearningCircles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Circle design configurations
  const circleDesigns = {
    "No-code/Low-code": {
      icon: <Code className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "from-violet-600 to-purple-600",
      bgColor: "bg-violet-50/50",
      accentColor: "text-violet-600",
      borderColor: "border-violet-100",
    },
    "Cyber Security": {
      icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "from-red-500 to-rose-500",
      bgColor: "bg-red-50/50",
      accentColor: "text-red-600",
      borderColor: "border-red-100",
    },
    "Web Development": {
      icon: <Globe className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50/50",
      accentColor: "text-blue-600",
      borderColor: "border-blue-100",
    },
    "AI & Machine Learning": {
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50/50",
      accentColor: "text-emerald-600",
      borderColor: "border-emerald-100",
    },
  };

  // Fetch data from Firebase
  useEffect(() => {
    const fetchLearningCircles = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching data from Firebase...");

        // Fetch from Firebase Firestore
        const querySnapshot = await getDocs(collection(db, "learningCircles"));
        const circlesData = [];

        console.log(`Found ${querySnapshot.size} documents`);

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log("Document data:", data);

          const design =
            circleDesigns[data.title] || circleDesigns["No-code/Low-code"];

          circlesData.push({
            id: doc.id,
            ...data,
            ...design,
          });
        });

        if (circlesData.length === 0) {
          setError(
            "No learning circles found in the database. Please add some data to Firebase."
          );
        } else {
          setLearningCircles(circlesData);
          console.log("Successfully loaded learning circles:", circlesData);
        }
      } catch (err) {
        console.error("Error fetching learning circles:", err);
        setError(`Failed to load learning circles: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningCircles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">
            Loading learning circles from Firebase...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Data
          </h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
          <div className="mt-4 text-sm text-gray-500">
            <p>Make sure:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Firebase is properly configured</li>
              <li>Firestore security rules allow read access</li>
              <li>Collection "learningCircles" exists with data</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (learningCircles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Learning Circles Found
          </h2>
          <p className="text-gray-600 mb-4">
            No learning circles are currently available. Please add some data to
            your Firebase database.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-200 via-violet-100 to-violet-50">
        <div className="absolute inset-0"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex items-center justify-center space-x-2 mb-4 sm:mb-6">
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
            <span className="text-xs sm:text-sm font-semibold text-indigo-600 uppercase tracking-wider">
              AJCE LEARNING CIRCLES
            </span>
          </div>
        </div>
        <div className="text-center mb-8 sm:mb-16 px-4">
          <h4 className="text-2xl sm:text-3xl lg:text-4xl text-gray-950 font-bold mb-3 sm:mb-4">
            Choose Your Learning Path
          </h4>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            Select from our specialized learning circles designed to accelerate
            your skills and career growth
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-20 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </div>

      {/* Learning Circles Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {learningCircles.map((circle) => (
            <div
              key={circle.id}
              className={`group cursor-pointer transition-all duration-300 ${
                hoveredCard === circle.id ? "scale-[1.01] sm:scale-[1.02]" : ""
              }`}
              onMouseEnter={() => setHoveredCard(circle.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div
                className={`${circle.bgColor} ${circle.borderColor} border-2 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 h-full bg-white shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
              >
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-gray-900 via-transparent to-transparent"></div>

                {/* Card Header */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <div
                      className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r ${circle.color} text-white shadow-lg`}
                    >
                      {circle.icon}
                    </div>
                  </div>

                  {/* Card Content */}
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                    {circle.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                    {circle.description}
                  </p>

                  {/* Features */}
                  {circle.features && circle.features.length > 0 && (
                    <div className="mb-6 sm:mb-8">
                      <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider">
                        What you'll learn
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3">
                        {circle.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center text-xs sm:text-sm text-gray-700"
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${circle.color} mr-2 sm:mr-3 flex-shrink-0`}
                            ></div>
                            <span className="font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Join Button */}
                  <button
                    onClick={() =>
                      window.open("https://pass.teamimpact.in/", "_blank")
                    }
                    className={`w-full bg-gradient-to-r ${circle.color} text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center group text-sm sm:text-base`}
                  >
                    <span>Join Learning Circle</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>

                {/* Hover glow effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${circle.color} opacity-0 group-hover:opacity-5 rounded-xl sm:rounded-2xl transition-opacity duration-300 pointer-events-none`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-gray-300 mb-6 sm:mb-8 text-base sm:text-lg">
            Join thousands of students who have transformed their careers
            through our learning circles.
          </p>
          <button
            onClick={() => window.open("https://pass.teamimpact.in/", "_blank")}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg text-sm sm:text-base"
          >
            Register Now
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gray-600 text-sm sm:text-base">
            © μlearn AJCE. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LearningCircle;
