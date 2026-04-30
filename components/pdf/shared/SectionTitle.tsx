import { Text } from "@react-pdf/renderer";
import { styles } from "../styles";

interface SectionTitleProps {
  title: string;
  first?: boolean;
  sidebar?: boolean;
}

export default function SectionTitle({ title, first, sidebar }: SectionTitleProps) {
  const style = [
    styles.sectionTitle,
    ...(sidebar ? [styles.sectionTitleSidebar] : []),
    ...(first ? [styles.sectionTitleFirst] : []),
  ];
  return <Text style={style}>{title.toUpperCase()}</Text>;
}
