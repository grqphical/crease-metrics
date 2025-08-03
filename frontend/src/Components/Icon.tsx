function Icon(props: { team: string }) {
  return (
    <span>
      <img className=" w-14 h-14" src={"/icons/" + props.team + ".svg"} />
    </span>
  );
}

export default Icon;
