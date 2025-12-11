import React, { useRef } from "react";
import Navbar from "./Navbar";
import About from "./About";
import Leaderboard from "./Leaderboard";
import Highlights from "./Highlights";
import OurTeam from "./OurTeam";
import Footer from "./Footer";
import Hero from "./Hero";

const Home = () => {
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const HighlightsRef = useRef(null);
  const OurTeamRef = useRef(null);
  const LeaderboardRef = useRef(null);

  return (
    <div>
      <Navbar
        onHeroClick={() =>
          heroRef.current?.scrollIntoView({ behavior: "smooth" })
        }
        onAboutClick={() =>
          aboutRef.current?.scrollIntoView({ behavior: "smooth" })
        }
        onLeaderClick={() =>
          LeaderboardRef.current?.scrollIntoView({ behavior: "smooth" })
        }
        onHighlightsClick={() =>
          HighlightsRef.current?.scrollIntoView({ behavior: "smooth" })
        }
        onOurTeamClick={() =>
          OurTeamRef.current?.scrollIntoView({ behavior: "smooth" })
        }
      />
      <Hero ref={heroRef} />
      <About ref={aboutRef} />
      <Leaderboard ref={LeaderboardRef} />
      <Highlights ref={HighlightsRef} />
      <OurTeam ref={OurTeamRef} />
      <Footer />
    </div>
  );
};

export default Home;
