import { Text } from "@react-pdf/renderer";

type Segment = { text: string; bold: boolean };

/**
 * Breaks a string apart at `**bold**` markers so each piece can be rendered
 * as either plain or bold text.
 *
 * The regex has a capture group around the bold text, which makes `split`
 * keep those captured pieces in the result. So the array alternates:
 * outside, inside, outside, inside, ... and we can tag every other one
 * as bold.
 *
 * Example: `"hi **there** you"` becomes
 *   `[{ text: "hi ", bold: false }, { text: "there", bold: true }, { text: " you", bold: false }]`
 *
 * @param input - Raw string that may contain `**bold**` markers.
 * @returns Ordered segments, each tagged as bold or not.
 */
function parseInlineBold(input: string): Segment[] {
  return input
    .split(/\*\*([^*]+)\*\*/g)
    .map((text, i) => ({ text, bold: i % 2 === 1 }))
    .filter((s) => s.text.length > 0);
}

/**
 * Turns a string with `**bold**` markers into PDF nodes: bold parts become
 * `<Text>` with the bold font, plain parts stay as strings. Drop the result
 * inside a parent `<Text>`.
 *
 * @param input - Raw string that may contain `**bold**` markers.
 * @returns Array of strings and `<Text>` nodes, in order.
 */
export function renderInlineBold(input: string) {
  return parseInlineBold(input).map((segment, i) =>
    segment.bold ? (
      <Text key={i} style={{ fontFamily: "Helvetica-Bold" }}>
        {segment.text}
      </Text>
    ) : (
      segment.text
    )
  );
}
