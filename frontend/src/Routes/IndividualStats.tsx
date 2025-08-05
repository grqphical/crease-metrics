import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Box from "../Components/Box";
import Icon from "../Components/Icon";
import Navbar from "../Components/Navbar";

interface DefaultString {
  default: string;
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
}

export default function IndividualStats() {
  const params = useParams();
  const id = params.id;

  const [stats, setState] = useState({} as GoalieStats);

  useEffect(() => {
    const fetchStats = async () => {
      const response = await fetch(`/api/stats/${id}`);

      setState(await response.json());
    };

    fetchStats().catch(console.error);
  }, []);

  return (
    <>
      <Navbar />
      <div className="px-6 py-18 flex flex-row items-center gap-4 bg-gray-800 text-white">
        <img
          src={stats.headshot}
          alt=""
          className="w-48 h-48 rounded-full bg-gray-900"
        />
        <div className="flex flex-col gap-4">
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
        </div>
        <div className="flex flex-row items-center gap-4 ml-auto">
          <Box class="bg-white text-black rounded-2xl aspect-square h-2/3 text-center">
            <p className="text-2xl font-bold">.911%</p>
            <p className="text-lg">SV%</p>
          </Box>
          <Box class="bg-white text-black rounded-2xl aspect-square h-2/3 text-center">
            <p className="text-2xl font-bold">.911%</p>
            <p className="text-lg">SV%</p>
          </Box>
          <Box class="bg-white text-black rounded-2xl aspect-square h-2/3 text-center">
            <p className="text-2xl font-bold">.911%</p>
            <p className="text-lg">SV%</p>
          </Box>
        </div>
      </div>
    </>
  );
}
