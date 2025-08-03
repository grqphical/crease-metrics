import Box from "./Box";
import Icon from "./Icon";

export interface Name {
  default: string;
}

export interface LeaderboardGoalie {
  id: number;
  firstName: Name;
  lastName: Name;
  sweaterNumber: number;
  headshot: string;
  teamAbbrev: string;
  teamLogo: string;
  value: number;
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

  return (
    <>
      <Box>
        <h1 className="text-3xl">{props.title}</h1>
        <div className="relative overflow-x-auto pt-3">
          <table className="w-full text-sm text-left">
            <thead>
              <tr>
                <th></th>
                <th></th>
                <th>Name</th>
                <th>{props.metric}</th>
              </tr>
            </thead>
            <tbody>
              {props.leaderboard.map((value, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <img
                        src={value.headshot}
                        alt=""
                        className="w-16 h-16 rounded-full"
                      />
                    </td>

                    <td className="text-xl">
                      <Icon team={value.teamAbbrev} />
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
        </div>
      </Box>
    </>
  );
}

export default Leaderboard;
