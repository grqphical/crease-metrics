import Box from "./Box";

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
  return (
    <>
      <Box>
        <h1 className="text-3xl">{props.title}</h1>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <th></th>
              <th></th>
              <th>Name</th>
              <th>{props.metric}</th>
            </thead>
            <tbody>
              {props.leaderboard.map((value, index) => {
                return (
                  <tr>
                    <td>
                      <img
                        src={value.headshot}
                        alt=""
                        className="w-16 h-16 rounded-full"
                      />
                    </td>

                    <td className="text-xl">{index + 1}.</td>
                    <td>
                      <p className="text-xl">
                        {value.firstName.default} {value.lastName.default}
                      </p>
                    </td>
                    <td>
                      <p className="text-xl font-bold">{value.value}</p>
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
