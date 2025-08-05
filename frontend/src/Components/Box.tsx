interface BoxProps {
  children: React.ReactNode;
  class: string;
}

function Box(props: BoxProps) {
  return <div className={`p-6 shadow-md ${props.class}`}>{props.children}</div>;
}

export default Box;
