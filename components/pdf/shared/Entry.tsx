import { View, Text } from "@react-pdf/renderer";
import type { ReactNode } from "react";
import { styles } from "../styles";

interface EntryProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  children?: ReactNode;
}

export default function Entry({ title, subtitle, right, children }: EntryProps) {
  return (
    <View>
      <View style={styles.entryRow}>
        <Text style={styles.entryTitle}>{title}</Text>
        {right}
      </View>
      {subtitle && <Text style={styles.entrySubtitle}>{subtitle}</Text>}
      {children}
    </View>
  );
}
