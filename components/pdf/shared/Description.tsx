import { Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import { renderInlineBold } from "./RichText";

export default function Description({ text }: { text: string }) {
  return (
    <>
      {text
        .split("\n")
        .filter((l) => l.trim() !== "")
        .map((line, i) => (
          <Text key={i} style={styles.bodyText}>
            {renderInlineBold(line)}
          </Text>
        ))}
    </>
  );
}
