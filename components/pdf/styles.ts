import { StyleSheet } from "@react-pdf/renderer";

// Background colors
export const HEADER_BG = "#2d2d2d";
export const SIDEBAR_BG = "#e8e8e8";

// Text colors
export const TEXT = "#333333";
export const HEADING = "#1a1a1a";
export const WHITE = "#ffffff";
export const MUTED = "#666666";

// Border colors
export const BORDER = "#d8d8d8";
export const SIDEBAR_BORDER = "#c0c0c0";

// Layout dimensions
export const SIDEBAR_WIDTH = 160;
export const H_PAD = 22;

// Typography tokens
export const FONT_SIZE_SECTION_TITLE = 9;
export const FONT_SIZE = 8.5;
export const FONT_SIZE_SMALL = 8;

// Reusable style fragments
const entryBase = {
  fontSize: FONT_SIZE,
  color: TEXT,
};
const mutedLabel = {
  fontSize: FONT_SIZE_SMALL,
  color: MUTED,
};

export const styles = StyleSheet.create({
  // Page
  page: {
    fontFamily: "Helvetica",
    color: TEXT,
  },

  // Sections
  sectionTitle: {
    marginTop: 16,
    marginBottom: 9,
    paddingBottom: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
    fontFamily: "Helvetica-Bold",
    fontSize: FONT_SIZE_SECTION_TITLE,
    color: HEADING,
  },
  sectionTitleFirst: { marginTop: 0 },
  sectionTitleSidebar: { borderBottomColor: SIDEBAR_BORDER },

  // Sidebar
  sidebarBackground: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: SIDEBAR_BG,
  },
  sidebarContent: {
    position: "absolute",
    left: 0,
    top: 0,
    width: SIDEBAR_WIDTH,
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 12,
    paddingRight: 12,
  },

  // Sidebar - Personal Info
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
    marginBottom: 3,
  },
  infoText: {
    fontSize: FONT_SIZE,
    color: TEXT,
    textDecoration: "none",
  },

  // Sidebar - Skills
  skillCat: {
    marginBottom: 2,
    fontFamily: "Helvetica-Bold",
    fontSize: FONT_SIZE,
  },
  skillVal: {
    fontSize: FONT_SIZE,
    color: TEXT,
    marginBottom: 5,
  },

  // Sidebar - Languages
  langRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  langName: {
    fontFamily: "Helvetica-Bold",
    fontSize: FONT_SIZE,
  },
  langProf: {
    fontSize: FONT_SIZE,
    color: TEXT,
  },

  // Main
  main: { marginLeft: SIDEBAR_WIDTH },
  nameHeader: {
    paddingTop: 22,
    paddingBottom: 18,
    paddingLeft: H_PAD,
    paddingRight: H_PAD,
    backgroundColor: HEADER_BG,
  },
  nameText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 22,
    color: WHITE,
  },
  jobTitleText: {
    marginTop: 4,
    fontSize: 12,
    color: "#bbbbbb",
  },
  content: {
    paddingTop: 10,
    paddingLeft: H_PAD,
    paddingRight: H_PAD,
    paddingBottom: 22,
  },

  // Entry
  entry: { marginBottom: 9 },
  entryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  entryTitle: {
    flex: 1,
    marginRight: 8,
    fontFamily: "Helvetica-Bold",
    fontSize: FONT_SIZE,
    color: HEADING,
  },
  entryDate: mutedLabel,
  entrySubtitle: { ...mutedLabel, marginTop: 1, marginBottom: 2 },

  // Entry variants
  bodyText: { ...entryBase, marginTop: 2 },
  bulletRow: { flexDirection: "row", marginTop: 2 },
  bulletDot: { ...entryBase, marginRight: 4 },
  bulletText: { ...entryBase, flex: 1 },
  techText: { ...mutedLabel, marginTop: 3, fontFamily: "Helvetica-Oblique" },
});
