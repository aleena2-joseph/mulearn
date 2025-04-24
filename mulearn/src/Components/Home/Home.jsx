import React, { useRef } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import About from "./About";
import Leaderboard from "./Leaderboard";
import Highlights from "./Highlights";
import OurTeam from "./OurTeam";
const Home = () => {
  const aboutRef = useRef(null);
  const HighlightsRef = useRef(null);
  const OurTeamRef = useRef(null);
  return (
    <div>
      <Navbar
        onAboutClick={() =>
          aboutRef.current?.scrollIntoView({ behavior: "smooth" })
        }
        onHighlightsClick={() =>
          HighlightsRef.current?.scrollIntoView({ behavior: "smooth" })
        }
        onOurTeamClick={() =>
          OurTeamRef.current?.scrollIntoView({ behavior: "smooth" })
        }
      />

      <Hero />
      <About ref={aboutRef} />
      <Leaderboard />
      <Highlights ref={HighlightsRef} />
      <OurTeam ref={OurTeamRef} />
    </div>
  );
};

export default Home;
