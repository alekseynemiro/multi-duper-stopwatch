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
    { color: "#faaaaa", contrast: "#60100b" },
    { color: "#f08080", contrast: "#2a0806" },
    { color: "#f55c5c", contrast: "#000000" },
    { color: "#e3242b", contrast: "#ffffff" },
    { color: "#990f02", contrast: "#fff8f8" },
    { color: "#670900", contrast: "#fff8f8" },

    { color: "#ffdab9", contrast: "#542a0c" },
    { color: "#f4a460", contrast: "#3d1d06" },
    { color: "#fc851e", contrast: "#1d0c01" },
    { color: "#d2691e", contrast: "#000000" },
    { color: "#8b4513", contrast: "#ffffff" },
    { color: "#542a0c", contrast: "#f8e4d2" },

    { color: "#ffebcd", contrast: "#604607" },
    { color: "#e6ce81", contrast: "#443106" },
    { color: "#ffd700", contrast: "#473407" },
    { color: "#daa520", contrast: "#1d1500" },
    { color: "#b8860b", contrast: "#000000" },
    { color: "#7d5b09", contrast: "#ffffff" },

    { color: "#98fb98", contrast: "#013d01" },
    { color: "#00ff00", contrast: "#013d01" },
    { color: "#32cd32", contrast: "#002a00" },
    { color: "#008000", contrast: "#ffffff" },
    { color: "#006400", contrast: "#effcef" },
    { color: "#013d01", contrast: "#effcef" },

    { color: "#92f9fc", contrast: "#01484a" },
    { color: "#05f5fc", contrast: "#01484a" },
    { color: "#02d5db", contrast: "#003638" },
    { color: "#02b7bd", contrast: "#001c1d" },
    { color: "#018d91", contrast: "#000000" },
    { color: "#006C6F", contrast: "#ffffff" },

    { color: "#a6b8ff", contrast: "#000e47" },
    { color: "#6181ff", contrast: "#000000" },
    { color: "#0033ff", contrast: "#fcfcff" },
    { color: "#002ad1", contrast: "#ededfa" },
    { color: "#022099", contrast: "#c6d1ff" },
    { color: "#000e47", contrast: "#bfcbfc" },

    { color: "#f9b8ff", contrast: "#38003d" },
    { color: "#ee6bfa", contrast: "#250229" },
    { color: "#ea00ff", contrast: "#020002" },
    { color: "#b600c7", contrast: "#ffffff" },
    { color: "#6c0275", contrast: "#f7d1fa" },
    { color: "#38003d", contrast: "#f9c5fd" },

    { color: "#ffffff", contrast: "#333333" },
    { color: "#e6e6e6", contrast: "#333333" },
    { color: "#cccccc", contrast: "#333333" },
    { color: "#777777", contrast: "#000000" },
    { color: "#333333", contrast: "#ffffff" },
    { color: "#000000", contrast: "#ffffff" },
  ] as Array<{ color: string, contrast: string }>,
};
