import { useEffect, useState } from "react";
import Box from "../Components/Box";
import type { LeaderboardGoalie } from "../Components/Leaderboard";
import Leaderboard from "../Components/Leaderboard";
import Navbar from "../Components/Navbar";

function Index() {
  const [winsLeaderboard, setWinsLeaderboard] = useState(
    new Array<LeaderboardGoalie>()
  );

  useEffect(() => {
    const fetchWinsLeaderboard = async () => {
      const response = await fetch("/api/leaderboard/wins");

      const json = await response.json();

      setWinsLeaderboard(json);
    };

    fetchWinsLeaderboard().catch(console.error);
  });

  return (
    <>
      <Navbar></Navbar>
      <div className="grid grid-cols-3 grid-rows-3 gap-4 mt-8 mx-4">
        <Leaderboard
          title="Wins Leaderboard"
          metric="Wins"
          leaderboard={winsLeaderboard}
        />
        <Box>
          <h1 className="text-3xl">SV% Leaderboard</h1>
        </Box>
        <Box>
          <h1 className="text-3xl">GAA Average Leaderboard</h1>
        </Box>
      </div>
    </>
  );
}

export default Index;
