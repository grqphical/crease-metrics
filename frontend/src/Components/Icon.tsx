function Icon(props: {
  teamAbbrev: string;
  teamFullName: string;
  classes: string;
}) {
  return (
    <span>
      <img
        className={props.classes}
        src={"/icons/" + props.teamAbbrev + ".svg"}
        alt={props.teamFullName}
        title={props.teamFullName}
      />
    </span>
  );
}

export default Icon;
