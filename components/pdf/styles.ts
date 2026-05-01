import { StyleSheet } from "@react-pdf/renderer";

export const SIDEBAR_WIDTH = 160;
export const SIDEBAR_BG = "#e8e8e8";
export const HEADER_BG = "#2d2d2d";
export const TEXT = "#333333";
export const MUTED = "#666666";
export const WHITE = "#ffffff";
export const HEADER_SUBTITLE = "#bbbbbb";
export const BORDER = "#d8d8d8";
export const SIDEBAR_BORDER = "#c0c0c0";
export const HEADING = "#1a1a1a";
export const H_PAD = 22;

const bulletBase = {
  fontSize: 8.5,
  color: TEXT,
  lineHeight: 1.4,
};

export const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    fontFamily: "Helvetica",
    fontSize: 8.5,
    color: TEXT,
  },

  // Sidebar
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: SIDEBAR_BG,
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 14,
    paddingRight: 12,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
    color: HEADING,
    paddingBottom: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitleFirst: { marginTop: 0 },
  sectionTitleSidebar: { borderBottomColor: SIDEBAR_BORDER },
  sbRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 3,
    marginBottom: 3,
  },
  sbText: {
    fontSize: 8.5,
    color: TEXT,
  },
  sbLink: {
    fontSize: 8,
    color: TEXT,
    textDecoration: "none",
  },
  skillCat: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: HEADING,
    marginTop: 6,
    marginBottom: 2,
  },
  skillVal: {
    fontSize: 8.5,
    color: TEXT,
    lineHeight: 1.5,
  },
  customContent: {
    fontSize: 8.5,
    color: TEXT,
    lineHeight: 1.6,
  },

  // Main
  main: { flex: 1 },
  nameHeader: {
    backgroundColor: HEADER_BG,
    paddingTop: 22,
    paddingBottom: 18,
    paddingLeft: H_PAD,
    paddingRight: H_PAD,
  },
  nameText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 22,
    color: WHITE,
  },
  jobTitleText: {
    fontSize: 10,
    color: HEADER_SUBTITLE,
    marginTop: 4,
  },
  content: {
    paddingTop: 10,
    paddingLeft: H_PAD,
    paddingRight: H_PAD,
    paddingBottom: 22,
  },
  entry: { marginBottom: 9 },
  entryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  entryTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: HEADING,
    flex: 1,
    marginRight: 8,
  },
  entryDate: { fontSize: 7.5, color: MUTED },
  entrySubtitle: {
    fontSize: 8,
    color: MUTED,
    marginTop: 1,
    marginBottom: 2,
  },
  bodyText: { ...bulletBase, marginTop: 2 },
  bulletRow: { flexDirection: "row", marginTop: 2 },
  bulletDot: { ...bulletBase, marginRight: 4 },
  bulletText: { ...bulletBase, flex: 1 },
  techText: {
    fontSize: 8,
    color: MUTED,
    marginTop: 3,
    fontFamily: "Helvetica-Oblique",
  },
});
