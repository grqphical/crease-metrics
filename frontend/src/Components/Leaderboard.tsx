import { useNavigate } from "react-router";
import Box from "./Box";
import Icon from "./Icon";
import Loader from "./Loader";

export interface DefaultString {
  default: string;
}

export interface LeaderboardGoalie {
  id: number;
  firstName: DefaultString;
  lastName: DefaultString;
  sweaterNumber: number;
  headshot: string;
  teamAbbrev: string;
  teamLogo: string;
  value: number;
  teamName: DefaultString;
}

interface LeaderboardProps {
  leaderboard: Array<LeaderboardGoalie>;
  title: string;
  metric: string;
}

function Leaderboard(props: LeaderboardProps) {
  const renderValue = (value: number) => {
    switch (props.metric) {
      case "SV%":
        return String(value.toFixed(3)).substring(1) + "%";
      case "GAA":
        return value.toFixed(2);
      default:
        return value;
    }
  };

  let navigate = useNavigate();

  const renderTable = () => {
    return (
      <table className="w-full text-sm text-left">
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th>DefaultString</th>
            <th>{props.metric}</th>
          </tr>
        </thead>
        <tbody>
          {props.leaderboard.map((value, index) => {
            return (
              <tr
                key={index}
                className="hover:bg-slate-200 transition-all duration-200 ease-in-out cursor-pointer"
                onClick={() => {
                  navigate("/goalies/" + value.id);
                }}
              >
                <td>
                  <img
                    src={value.headshot}
                    alt=""
                    className="w-16 h-16 rounded-full"
                  />
                </td>

                <td className="text-xl">
                  <Icon
                    teamAbbrev={value.teamAbbrev}
                    teamFullName={value.teamName.default}
                    classes="w-16 h-16"
                  />
                </td>
                <td>
                  <p className="text-xl">
                    {value.firstName.default} {value.lastName.default}
                  </p>
                </td>
                <td>
                  <p className="text-xl font-bold">
                    {renderValue(value.value)}
                  </p>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <>
      <Box class="bg-white">
        <h1 className="text-3xl">{props.title}</h1>
        <div className="relative overflow-x-auto pt-3">
          {props.leaderboard.length === 0 ? <Loader /> : renderTable()}
        </div>
      </Box>
    </>
  );
}

export default Leaderboard;
