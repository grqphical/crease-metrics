import { useEffect, useState } from "react";
import Leaderboard, { type LeaderboardGoalie } from "../Components/Leaderboard";
import Navbar from "../Components/Navbar";

function Goalies() {
  const [winsLeaderboard, setWinsLeaderboard] = useState(
    new Array<LeaderboardGoalie>()
  );

  const [svPctgLeaderboard, setSvPctgLeaderboard] = useState(
    new Array<LeaderboardGoalie>()
  );

  const [gaaLeaderboard, setGaaLeaderboard] = useState(
    new Array<LeaderboardGoalie>()
  );

  const [shutoutLeaderboard, setShutoutLeaderboard] = useState(
    new Array<LeaderboardGoalie>()
  );

  useEffect(() => {
    const fetchWinsLeaderboard = async () => {
      const response = await fetch("/api/leaderboard/wins");

      const json = await response.json();

      setWinsLeaderboard(json);
    };

    const fetchSvPctgLeaderboard = async () => {
      const response = await fetch("/api/leaderboard/svpct");

      const json = await response.json();

      setSvPctgLeaderboard(json);
    };

    const fetchGaaLeaderboard = async () => {
      const response = await fetch("/api/leaderboard/gaa");

      const json = await response.json();

      setGaaLeaderboard(json);
    };

    const fetchShutoutLeaderboard = async () => {
      const response = await fetch("/api/leaderboard/shutouts");

      const json = await response.json();

      setShutoutLeaderboard(json);

    }

    fetchWinsLeaderboard().catch(console.error);
    fetchSvPctgLeaderboard().catch(console.error);
    fetchGaaLeaderboard().catch(console.error);
    fetchShutoutLeaderboard().catch(console.error)
  }, []);

  return (
    <>
      <Navbar />
      <div className="grid grid-cols-2 grid-rows-2 gap-2 mt-8 mx-4 max-w-screen">
        <Leaderboard
          title="Wins Leaderboard"
          metric="Wins"
          leaderboard={winsLeaderboard}
        />
        <Leaderboard
          title="Save Percentage Leaderboard"
          metric="SV%"
          leaderboard={svPctgLeaderboard}
        />
        <Leaderboard
          title="Goals Against Average Leaderboard"
          metric="GAA"
          leaderboard={gaaLeaderboard}
        />
        <Leaderboard
          title="Shutouts Leaderboard"
          metric="Shutouts"
          leaderboard={shutoutLeaderboard}
        />
      </div>
    </>
  );
}

export default Goalies;
