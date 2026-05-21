import { Text, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";
import { styles } from "../styles";

interface SectionTitleProps {
  title: string;
  first?: boolean;
  sidebar?: boolean;
}

interface SectionProps {
  title: string;
  sidebar?: boolean;
  first?: boolean;
  dense?: boolean;
  children: ReactNode;
}

function SectionTitle({ title, first, sidebar }: SectionTitleProps) {
  const style = [
    styles.sectionTitle,
    ...(sidebar ? [styles.sectionTitleSidebar] : []),
    ...(first ? [styles.sectionTitleFirst] : []),
  ];
  return <Text style={style}>{title.toUpperCase()}</Text>;
}

export default function Section({ title, sidebar, first, dense, children }: SectionProps) {
  return (
    <View>
      <SectionTitle title={title} sidebar={sidebar} first={first} />
      <View style={dense ? styles.sectionWrapperDense : styles.sectionWrapper}>{children}</View>
    </View>
  );
}
