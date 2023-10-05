const white = "#ffffff";
const black = "#000000";
const primary = "#1458b1";
const secondary = "#555555";
const danger = "#a92532";
const warning = "#ffc107";
const success = "#14653f";
const info = "#0dcaf0";
const light = "#f8f9fa";
const transparent = "transparent";
const background = "#f2f2f2";
const border = "#666666";
const borderLight = "#e9ecef";
const text = "#3f3f3f";
const headerText = "#666666";
const link = primary;
const error = danger;
const overlay = "rgba(0, 0, 0, 0.5)";

export const colors = {
  transparent,
  white,
  black,

  primary,
  secondary,
  danger,
  warning,
  success,
  info,
  light,

  background,
  overlay,

  border,
  borderLight,

  text,
  headerText,
  link,
  error,

  primaryContrast: white,
  secondaryContrast: white,
  dangerContrast: white,
  warningContrast: black,
  successContrast: white,
  infoContrast: black,
  lightContrast: black,

  shadowColor: black,

  palette: [
    { color: "#faaaaa", contrast: "#60100b", backdrop: "#ffeaea" },
    { color: "#f08080", contrast: "#2a0806", backdrop: "#ffeaea" },
    { color: "#f55c5c", contrast: "#000000", backdrop: "#ffeaea" },
    { color: "#e3242b", contrast: "#ffffff", backdrop: "#ffeaea" },
    { color: "#990f02", contrast: "#fff8f8", backdrop: "#ffeaea"},
    { color: "#670900", contrast: "#fff8f8", backdrop: "#ffeaea" },

    { color: "#ffdab9", contrast: "#542a0c", backdrop: "#ffead8" },
    { color: "#f4a460", contrast: "#3d1d06", backdrop: "#ffead8" },
    { color: "#fc851e", contrast: "#1d0c01", backdrop: "#ffead8" },
    { color: "#d2691e", contrast: "#000000", backdrop: "#ffead8" },
    { color: "#8b4513", contrast: "#ffffff", backdrop: "#ffead8" },
    { color: "#542a0c", contrast: "#f8e4d2", backdrop: "#ffead8" },

    { color: "#ffebcd", contrast: "#604607", backdrop: "#fff3e1" },
    { color: "#e6ce81", contrast: "#443106", backdrop: "#fff3e1" },
    { color: "#ffd700", contrast: "#473407", backdrop: "#fff3e1" },
    { color: "#daa520", contrast: "#1d1500", backdrop: "#fff3e1" },
    { color: "#b8860b", contrast: "#000000", backdrop: "#fff3e1" },
    { color: "#7d5b09", contrast: "#ffffff", backdrop: "#fff3e1" },

    { color: "#98fb98", contrast: "#013d01", backdrop: "#ddffdd" },
    { color: "#00ff00", contrast: "#013d01", backdrop: "#ddffdd" },
    { color: "#32cd32", contrast: "#002a00", backdrop: "#ddffdd" },
    { color: "#008000", contrast: "#ffffff", backdrop: "#ddffdd" },
    { color: "#006400", contrast: "#effcef", backdrop: "#ddffdd" },
    { color: "#013d01", contrast: "#effcef", backdrop: "#ddffdd" },

    { color: "#92f9fc", contrast: "#01484a", backdrop: "#d2fdff" },
    { color: "#05f5fc", contrast: "#01484a", backdrop: "#d2fdff" },
    { color: "#02d5db", contrast: "#003638", backdrop: "#d2fdff" },
    { color: "#02b7bd", contrast: "#001c1d", backdrop: "#d2fdff" },
    { color: "#018d91", contrast: "#000000", backdrop: "#d2fdff" },
    { color: "#006C6F", contrast: "#ffffff", backdrop: "#d2fdff" },

    { color: "#a6b8ff", contrast: "#000e47", backdrop: "#cfd8ff" },
    { color: "#6181ff", contrast: "#000000", backdrop: "#cfd8ff" },
    { color: "#0033ff", contrast: "#fcfcff", backdrop: "#cfd8ff" },
    { color: "#002ad1", contrast: "#ededfa", backdrop: "#cfd8ff" },
    { color: "#022099", contrast: "#c6d1ff", backdrop: "#cfd8ff" },
    { color: "#000e47", contrast: "#bfcbfc", backdrop: "#cfd8ff" },

    { color: "#f9b8ff", contrast: "#38003d", backdrop: "#f9e2fc" },
    { color: "#ee6bfa", contrast: "#250229", backdrop: "#f9e2fc" },
    { color: "#ea00ff", contrast: "#020002", backdrop: "#f9e2fc" },
    { color: "#b600c7", contrast: "#ffffff", backdrop: "#f9e2fc" },
    { color: "#6c0275", contrast: "#f7d1fa", backdrop: "#f9e2fc" },
    { color: "#38003d", contrast: "#f9c5fd", backdrop: "#f9e2fc" },

    { color: "#ffffff", contrast: "#333333", backdrop: "#ffffff" },
    { color: "#e6e6e6", contrast: "#333333", backdrop: "#ffffff" },
    { color: "#cccccc", contrast: "#333333", backdrop: "#ffffff" },
    { color: "#777777", contrast: "#000000", backdrop: "#ffffff" },
    { color: "#333333", contrast: "#ffffff", backdrop: "#ffffff" },
    { color: "#000000", contrast: "#ffffff", backdrop: "#ffffff" },
  ] as Array<{ color: string, contrast: string, backdrop: string }>,
};
