const white = "#ffffff";
const black = "#000000";
const primary = "#0d6efd";
const secondary = "#6c757d";
const danger = "#dc3545";
const warning = "#ffc107";
const success = "#198754";
const info = "#0dcaf0";
const light = "#f8f9fa";
const transparent = "transparent";
const background = white;
const border = black;
const borderLight = "#e9ecef";
const text = black;
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
    { color: "#faa0a0", contrast: "#60100b" },
    { color: "#f08080", contrast: "#60100b" },
    { color: "#ff0000", contrast: "#fcd7d7" },
    { color: "#e3242b", contrast: "#fcd7d7" },
    { color: "#990f02", contrast: "#fcd7d7" },
    { color: "#60100b", contrast: "#fcd7d7" },

    { color: "#ffdab9", contrast: "#542a0c" },
    { color: "#f4a460", contrast: "#542a0c" },
    { color: "#fc851e", contrast: "#542a0c" },
    { color: "#d2691e", contrast: "#ffdab9" },
    { color: "#8b4513", contrast: "#ffdab9" },
    { color: "#542a0c", contrast: "#ffdab9" },

    { color: "#ffebcd", contrast: "#7d5b09" },
    { color: "#e6ce81", contrast: "#7d5b09" },
    { color: "#ffd700", contrast: "#7d5b09" },
    { color: "#daa520", contrast: "#fae5b1" },
    { color: "#b8860b", contrast: "#ffebcd" },
    { color: "#7d5b09", contrast: "#ffebcd" },

    { color: "#98fb98", contrast: "#013d01" },
    { color: "#00ff00", contrast: "#013d01" },
    { color: "#32cd32", contrast: "#013d01" },
    { color: "#008000", contrast: "#98fb98" },
    { color: "#006400", contrast: "#deffde" },
    { color: "#013d01", contrast: "#deffde" },

    { color: "#92f9fc", contrast: "#01484a" },
    { color: "#05f5fc", contrast: "#01484a" },
    { color: "#02d5db", contrast: "#01484a" },
    { color: "#02b7bd", contrast: "#bef8fa" },
    { color: "#018d91", contrast: "#92f9fc" },
    { color: "#01484a", contrast: "#92f9fc" },

    { color: "#a6b8ff", contrast: "#000e47" },
    { color: "#6181ff", contrast: "#000e47" },
    { color: "#0033ff", contrast: "#a6b8ff" },
    { color: "#002ad1", contrast: "#a6b8ff" },
    { color: "#022099", contrast: "#a6b8ff" },
    { color: "#000e47", contrast: "#a6b8ff" },

    { color: "#f9b8ff", contrast: "#38003d" },
    { color: "#ee6bfa", contrast: "#38003d" },
    { color: "#ea00ff", contrast: "#38003d" },
    { color: "#b600c7", contrast: "#f9b8ff" },
    { color: "#6c0275", contrast: "#f9b8ff" },
    { color: "#38003d", contrast: "#f9b8ff" },

    { color: "#ffffff", contrast: "#333333" },
    { color: "#e6e6e6", contrast: "#333333" },
    { color: "#cccccc", contrast: "#333333" },
    { color: "#777777", contrast: "#e6e6e6" },
    { color: "#333333", contrast: "#ffffff" },
    { color: "#000000", contrast: "#ffffff" },
  ] as Array<{ color: string, contrast: string }>,
};
