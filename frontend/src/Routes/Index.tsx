import { useEffect, useState } from "react";
import type { LeaderboardGoalie } from "../Components/Leaderboard";
import Leaderboard from "../Components/Leaderboard";
import Navbar from "../Components/Navbar";

function Index() {
  const [winsLeaderboard, setWinsLeaderboard] = useState(
    new Array<LeaderboardGoalie>()
  );

  const [svPctgLeaderboard, setSvPctgLeaderboard] = useState(
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

    fetchWinsLeaderboard().catch(console.error);
    fetchSvPctgLeaderboard().catch(console.error);
  }, []);

  return (
    <>
      <Navbar></Navbar>
      <div className="grid grid-cols-3 grid-rows-3 gap-4 mt-8 mx-4">
        <Leaderboard
          title="Wins Leaderboard"
          metric="Wins"
          leaderboard={winsLeaderboard}
        />
        <Leaderboard
          title="SV% Leaderboard"
          metric="SV%"
          leaderboard={svPctgLeaderboard}
        />
      </div>
    </>
  );
}

export default Index;
