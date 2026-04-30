import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";

export default function Description({ text }: { text: string }) {
  const lines = text.split("\n").filter((l) => l !== "");
  return (
    <View>
      {lines.map((line, i) => {
        if (line.startsWith("•")) {
          return (
            <View key={i} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{line.slice(1).trim()}</Text>
            </View>
          );
        }
        return (
          <Text key={i} style={styles.bodyText}>
            {line}
          </Text>
        );
      })}
    </View>
  );
}
