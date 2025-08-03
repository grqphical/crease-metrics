interface BoxProps {
  children: React.ReactNode;
}

function Box(props: BoxProps) {
  return <div className="p-6 shadow-md">{props.children}</div>;
}

export default Box;
