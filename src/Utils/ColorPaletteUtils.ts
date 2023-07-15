import { ColorPalette } from "@data";
import { colors } from "@styles";

export const getColorByCode = (colorCode: string): ColorPalette => {
  const index = colors.palette.findIndex(
    (x: string): boolean => {
      return x === colorCode;
    }
  );

  return Object.keys(ColorPalette)[index] as unknown as ColorPalette;
};


export const getColorCode = (color: ColorPalette): string => {
  const index = Object.keys(ColorPalette).findIndex(
    (x: string): boolean => {
      return x === color.toString();
    }
  );

  return colors.palette[index];
};
