import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import { renderInlineBold } from "./RichText";

export default function Bullets({ bullets }: { bullets: string[] }) {
  if (bullets.length === 0) return null;
  return (
    <>
      {bullets.map((bullet, i) => (
        <View key={i} style={styles.bulletRow}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>{renderInlineBold(bullet)}</Text>
        </View>
      ))}
    </>
  );
}
