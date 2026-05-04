import { StyleSheet } from "@react-pdf/renderer";

// Background colors
export const HEADER_BG = "#2d2d2d";
export const SIDEBAR_BG = "#e8e8e8";

// Text colors
export const WHITE = "#ffffff";
export const HEADING = "#1a1a1a";
export const TEXT = "#333333";
export const MUTED = "#666666";
export const HEADER_SUBTITLE = "#bbbbbb";

// Border colors
export const BORDER = "#d8d8d8";
export const SIDEBAR_BORDER = "#c0c0c0";

// Layout dimensions
export const SIDEBAR_WIDTH = 160;
export const H_PAD = 22;

// Typography tokens
export const FONT_SIZE = 8.5;
export const LINE_HEIGHT = 1.5;

// Reusable style fragments
const bulletBase = {
  fontSize: FONT_SIZE,
  color: TEXT,
  lineHeight: 1.4,
};
const mutedLabel = {
  fontSize: 8,
  color: MUTED,
};

export const styles = StyleSheet.create({
  // Page
  page: {
    fontFamily: "Helvetica",
    fontSize: FONT_SIZE,
    color: TEXT,
  },

  // Shared
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    paddingBottom: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: HEADING,
  },
  sectionTitleFirst: { marginTop: 0 },

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
    paddingLeft: 14,
    paddingRight: 12,
  },
  sbRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 3,
    marginBottom: 3,
  },
  sbText: {
    fontSize: FONT_SIZE,
    color: TEXT,
    textDecoration: "none",
  },
  skillCat: {
    marginTop: 6,
    marginBottom: 2,
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: HEADING,
  },
  skillVal: {
    fontSize: FONT_SIZE,
    lineHeight: LINE_HEIGHT,
    color: TEXT,
  },
  customContent: {
    fontSize: FONT_SIZE,
    lineHeight: LINE_HEIGHT,
    color: TEXT,
  },
  sectionTitleSidebar: { borderBottomColor: SIDEBAR_BORDER },

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
    fontSize: 10,
    color: HEADER_SUBTITLE,
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
  entryDate: { fontSize: 7.5, color: MUTED },
  entrySubtitle: { ...mutedLabel, marginTop: 1, marginBottom: 2 },

  // Entry variants
  bodyText: { ...bulletBase, marginTop: 2 },
  bulletRow: { flexDirection: "row", marginTop: 2 },
  bulletDot: { ...bulletBase, marginRight: 4 },
  bulletText: { ...bulletBase, flex: 1 },
  techText: { ...mutedLabel, marginTop: 3, fontFamily: "Helvetica-Oblique" },
});
