import ComposedChart from './Charts/ComposedChart/ComposedChart';

interface Props {
  className?: string;
  style?: React.CSSProperties;
}

export default function Chart({ className, style }: Props) {
  return <ComposedChart className={className} style={style} />;
}
