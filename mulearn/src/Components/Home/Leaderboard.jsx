import { useState, useEffect } from "react";
import {
  Trophy,
  Award,
  Target,
  RefreshCw,
  AlertCircle,
  User,
} from "lucide-react";
import { FaMedal } from "react-icons/fa6";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Accessing environment variables
  const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
  const AIRTABLE_TABLE_NAME =
    import.meta.env.VITE_AIRTABLE_TABLE_NAME || "Leaderboard";
  const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if Airtable credentials are missing
      if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) {
        setError(
          "Airtable credentials are missing! Please check your environment variables."
        );
        setLoading(false);
        return;
      }

      // Fetch data with sorting by College Rank
      const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?sort%5B0%5D%5Bfield%5D=College%20Rank&sort%5B0%5D%5Bdirection%5D=asc`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError(
            "Base or table not found. Please check your Base ID and table name."
          );
        } else if (response.status === 401) {
          setError("Authentication failed. Please check your API key.");
        } else if (response.status === 403) {
          setError(
            "Access denied. Your API key may not have permission to access this base."
          );
        } else {
          setError(`Failed to load data. Status: ${response.status}`);
        }
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (!data.records || data.records.length === 0) {
        setError("No data found in the table.");
        setLoading(false);
        return;
      }

      const formattedData = data.records.map((record) => {
        const fields = record.fields;

        // Map fields with fallbacks
        const getCollegeRank = () => {
          return (
            fields["College Rank"] ||
            fields.CollegeRank ||
            fields.Rank ||
            fields.rank ||
            0
          );
        };

        const getNameValue = () => {
          return (
            fields.Name ||
            fields.name ||
            fields.Student ||
            fields.student ||
            fields.StudentName ||
            "Unknown"
          );
        };

        const getMuidValue = () => {
          return fields.MUID || fields.muid || fields.MuId || fields.ID || "";
        };

        const getKarmaValue = () => {
          return (
            fields["Karma Points"] ||
            fields.KarmaPoints ||
            fields.Karma ||
            fields.karma ||
            fields.Points ||
            fields.points ||
            fields.Score ||
            fields.score ||
            "0"
          );
        };

        const getProfileImageValue = () => {
          const profileImage =
            fields["Profile Image"] ||
            fields.ProfileImage ||
            fields["profile_image"];
          if (profileImage && profileImage.length > 0) {
            return profileImage[0].url;
          }
          return null;
        };

        return {
          rank: getCollegeRank(),
          name: getNameValue(),
          muid: getMuidValue(),
          karma: getKarmaValue(),
          profileImage: getProfileImageValue(),
        };
      });

      // Filter out entries with "Unknown" names, empty names, and sort by College Rank (ascending)
      const filteredData = formattedData.filter(
        (member) =>
          member.name !== "Unknown" &&
          member.name.trim() !== "" &&
          member.name.toLowerCase() !== "unknown"
      );

      const sortedData = filteredData.sort((a, b) => {
        const rankA =
          typeof a.rank === "number" ? a.rank : parseInt(a.rank) || 999;
        const rankB =
          typeof b.rank === "number" ? b.rank : parseInt(b.rank) || 999;
        return rankA - rankB;
      });

      setLeaderboardData(sortedData);
    } catch (err) {
      setError(`Failed to load leaderboard data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-8 h-8 text-yellow-500" />;
      case 2:
        return <FaMedal className="w-8 h-8 text-gray-400" />;
      case 3:
        return <Award className="w-8 h-8 text-amber-600" />;
      default:
        return (
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-purple-800 font-bold text-sm">{rank}</span>
          </div>
        );
    }
  };

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
      case 3:
        return "bg-gradient-to-r from-amber-500 to-amber-700 text-white";
      default:
        return "bg-gradient-to-r from-purple-500 to-purple-700 text-white";
    }
  };

  const getCardBorder = (rank) => {
    switch (rank) {
      case 1:
        return "border-yellow-300 shadow-yellow-100";
      case 2:
        return "border-gray-300 shadow-gray-100";
      case 3:
        return "border-amber-300 shadow-amber-100";
      default:
        return "border-purple-200 shadow-purple-100";
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-indigo-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-300 border-t-purple-600 mx-auto mb-4"></div>
            <p className="text-purple-600 text-lg">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Get top 3 valid entries (excluding "Unknown")
  const topThree = leaderboardData
    .filter((member) => member.name !== "Unknown" && member.name.trim() !== "")
    .slice(0, 3);

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Target className="w-10 h-10 text-purple-600 mr-3" />
            <h2 className="text-4xl font-bold text-purple-800">
              µLearn AJCE Leaderboard
            </h2>
          </div>
          <p className="text-lg text-purple-600 max-w-2xl mx-auto">
            Celebrating our top performers and their amazing contributions to
            the µLearn community
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Top 3 Podium */}
        {topThree.length > 0 && (
          <div className="mb-12 mt-[10%]">
            <div className="flex justify-center items-end space-x-6">
              {topThree.map((member, index) => {
                const displayRank = index + 1; // 1, 2, 3 based on array position
                const heights = "h-48"; // equal height
                const medals = {
                  1: <Trophy className="w-8 h-8 text-yellow-900" />,
                  2: <FaMedal className="w-8 h-8 text-gray-800" />,
                  3: <Award className="w-8 h-8 text-amber-900" />,
                };

                const bgColors = {
                  1: "bg-yellow-400",
                  2: "bg-gray-300",
                  3: "bg-amber-500",
                };

                const textColors = {
                  1: "text-yellow-900",
                  2: "text-gray-800",
                  3: "text-amber-900",
                };

                const rankBadgeColors = {
                  1: "bg-yellow-600 text-white",
                  2: "bg-gray-600 text-white",
                  3: "bg-amber-600 text-white",
                };

                return (
                  <div
                    key={member.muid || index}
                    className={`flex flex-col items-center justify-end ${heights} relative`}
                  >
                    {/* Rank Number Badge - Top Right Corner */}
                    <div
                      className={`absolute -top-2 -right-2 z-20 w-8 h-8 rounded-full ${rankBadgeColors[displayRank]} flex items-center justify-center shadow-lg border-2 border-white`}
                    >
                      <span className="font-bold text-lg">{displayRank}</span>
                    </div>

                    {/* Profile Image - Circular and positioned above the card */}
                    <div className="absolute -top-8 z-10">
                      <div className="w-16 h-16 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                        {member.profileImage ? (
                          <img
                            src={member.profileImage}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-full h-full flex items-center justify-center ${
                            member.profileImage ? "hidden" : "flex"
                          }`}
                        >
                          <User className="w-8 h-8 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div
                      className={`${bgColors[displayRank]} w-52 rounded-xl p-4 shadow-lg text-center flex flex-col items-center pt-6`}
                    >
                      <div className="mb-2">{medals[displayRank]}</div>

                      {/* Highlighted Name as a bar/button */}
                      <div className="bg-white px-4 py-1 rounded-full font-bold text-sm shadow-md mb-2 text-black">
                        {member.name}
                      </div>

                      <p className={`text-xs mb-2 ${textColors[displayRank]}`}>
                        {member.muid || "No MUID"}
                      </p>

                      {/* Plain karma display (no highlight) */}
                      <p className="text-sm font-semibold text-white">
                        {member.karma} Karma
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Rest of the leaderboard */}
        <div className="space-y-4">
          {leaderboardData
            .filter((member) => member.rank > 3)
            .map((member) => (
              <div
                key={member.rank}
                className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${getCardBorder(
                  member.rank
                )} p-6 transform hover:scale-102`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getRankIcon(member.rank)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-purple-800">
                        {member.name}
                      </h3>
                      <p className="text-purple-600 text-sm">
                        {member.muid || "No MUID available"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-4 py-2 rounded-full shadow-lg">
                      <span className="font-bold text-lg">{member.karma}</span>
                    </div>
                    <p className="text-sm text-purple-600 mt-1">Karma Points</p>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* No Data Message */}
        {!loading && !error && leaderboardData.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-purple-300 mx-auto mb-4" />
            <p className="text-xl text-purple-600 mb-2">
              No leaderboard data available
            </p>
            <p className="text-purple-500">
              Check your Airtable configuration and try again.
            </p>
          </div>
        )}

        {/* Refresh Button */}
        <div className="text-center mt-8">
          <button
            onClick={fetchLeaderboardData}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center mx-auto"
          >
            <RefreshCw
              className={`w-5 h-5 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Refreshing..." : "Refresh Leaderboard"}
          </button>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 text-sm text-purple-600">
          <p>
            Leaderboard updates automatically. Keep earning karma points! 🚀
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
