import { Svg, Path } from "@react-pdf/renderer";
import { TEXT } from "../styles";

type PdfIconProps = { d: string; size?: number; color?: string };

export function PdfIcon({ d, size = 10, color = TEXT }: PdfIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 256 256">
      <Path d={d} fill={color} />
    </Svg>
  );
}
