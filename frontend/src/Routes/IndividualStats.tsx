import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Box from "../Components/Box";
import Icon from "../Components/Icon";
import Loader from "../Components/Loader";
import Navbar from "../Components/Navbar";

interface DefaultString {
  default: string;
}

interface DraftDetails {
  year: number;
  teamAbbrev: string;
  round: number;
  pickInRound: number;
  overallPick: 45;
}

interface CareerStats {
  gamesPlayed: number;
  gamesStarted: number;
  goalsAgainstAvg: number;
  losses: number;
  otLosses: number;
  savePctg: number;
  shutouts: number;
  wins: number;
}

interface CareerTotals {
  regularSeason: CareerStats
  playoffs: CareerStats
}

interface GoalieStats {
  firstName: DefaultString;
  lastName: DefaultString;
  sweaterNumber: number;
  currentTeamAbbrev: string;
  fullTeamName: DefaultString;
  headshot: string;
  heightInCentimeters: number;
  weightInKilograms: number;
  birthDate: string;
  birthCity: DefaultString;
  birthStateProvince: DefaultString;
  birthCountry: string;
  careerTotals: CareerTotals;
  draftDetails: DraftDetails;
}

export default function IndividualStats() {
  const params = useParams();
  const id = params.id;

  const [stats, setState] = useState({} as GoalieStats);

  const [showCareerPlayoffStats, setShowCareerPlayoffState] = useState(false)

  useEffect(() => {
    const fetchStats = async () => {
      const response = await fetch(`/api/stats/${id}`);

      setState(await response.json());
    };

    fetchStats().catch(console.error);
  }, []);

  if (Object.keys(stats).length === 0) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      </>
    );
  }

  const renderDraftDetails = () => {
    if (stats.draftDetails === undefined) {
      return <p>Undrafted</p>;
    } else {
      return (
        <div className="flex flex-row items-center">
          <p>
            Drafted: {stats.draftDetails.year}, Round {stats.draftDetails.round}
            , Pick #{stats.draftDetails.pickInRound} (#
            {stats.draftDetails.overallPick} Overall) by{" "}
          </p>

          <Icon
            teamAbbrev={stats.draftDetails.teamAbbrev}
            teamFullName=""
            classes="w-8 h-8"
          />
        </div>
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="px-6 py-18 flex flex-row items-center gap-4 bg-gray-800 text-white">
        <img
          src={stats.headshot}
          alt=""
          className="w-48 h-48 rounded-full bg-gray-900"
        />
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold">
            {stats.firstName && stats.firstName.default
              ? stats.firstName.default
              : ""}{" "}
            {stats.lastName && stats.lastName.default}
          </h1>
          <p className="text-2xl flex flex-row items-center">
            <Icon
              teamAbbrev={stats.currentTeamAbbrev}
              teamFullName={stats.fullTeamName && stats.fullTeamName.default}
              classes="w-20 h-20"
            />{" "}
            #{stats.sweaterNumber}
          </p>
          {renderDraftDetails()}
          <p>
            Born: {stats.birthCity.default}
            {stats.birthStateProvince &&
              `, ${stats.birthStateProvince.default}`}
            , {stats.birthCountry}
          </p>
        </div>
        <div className="flex flex-row items-center gap-4 ml-auto">
          <Box class="bg-white text-black rounded-2xl flex flex-col">
            <p className="text-2xl font-bold mb-2">Career Stats:</p>
            <div className="flex flex-row">
              <button className={showCareerPlayoffStats ?
                "px-2 py-2 text-lg cursor-pointer bg-gray-300 rounded-tl-md" :
                "px-2 py-2 text-lg cursor-pointer bg-gray-100 border-b-2 border-blue-400 rounded-tl-md"
              } onClick={() => setShowCareerPlayoffState(false)}>Regular Season</button>
              <button className={showCareerPlayoffStats ?
                "px-2 py-2 text-lg cursor-pointer bg-gray-100 border-b-2 border-blue-400 rounded-tr-md" :
                "px-2 py-2 text-lg cursor-pointer bg-gray-300 rounded-tr-md"
              } onClick={() => setShowCareerPlayoffState(true)}>Playoffs</button>
            </div>
            <div className="flex flex-row gap-8 bg-gray-100 p-2 rounded-b-md rounded-tr-md">
              <div>
                <p className="text-2xl font-bold">{`${showCareerPlayoffStats ? stats.careerTotals.playoffs.gamesPlayed : stats.careerTotals.regularSeason.gamesPlayed}`}</p>
                <p className="text-md">Games Played</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{`${showCareerPlayoffStats ? stats.careerTotals.playoffs.gamesStarted : stats.careerTotals.regularSeason.gamesStarted}`}</p>
                <p className="text-md">Games Started</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{`${showCareerPlayoffStats ? stats.careerTotals.playoffs.wins : stats.careerTotals.regularSeason.wins}-${showCareerPlayoffStats ? stats.careerTotals.playoffs.losses : stats.careerTotals.regularSeason.losses}-${showCareerPlayoffStats ? stats.careerTotals.playoffs.otLosses : stats.careerTotals.regularSeason.otLosses}`}</p>
                <p className="text-md">All Time Record</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {String(
                    showCareerPlayoffStats ? stats.careerTotals.playoffs.savePctg.toFixed(3) : stats.careerTotals.regularSeason.savePctg.toFixed(3)
                  ).substring(1) + "%"}
                </p>
                <p className="text-md">SV%</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {
                    showCareerPlayoffStats ?
                      (
                        (stats.careerTotals.playoffs.wins /
                          stats.careerTotals.playoffs.gamesPlayed) *
                        100
                      ).toFixed(1) : (
                        (stats.careerTotals.regularSeason.wins /
                          stats.careerTotals.regularSeason.gamesPlayed) *
                        100
                      ).toFixed(1)

                  }
                  %
                </p>
                <p className="text-md">Win%</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {showCareerPlayoffStats ? stats.careerTotals.playoffs.goalsAgainstAvg.toFixed(2) : stats.careerTotals.regularSeason.goalsAgainstAvg.toFixed(2)}
                </p>
                <p className="text-md">GAA</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {showCareerPlayoffStats ? stats.careerTotals.playoffs.shutouts : stats.careerTotals.regularSeason.shutouts}
                </p>
                <p className="text-md">Shutouts</p>
              </div>
            </div>
          </Box>
        </div>
      </div>
    </>
  );
}
