import { ReactNode } from "react";
import { StyleProp, TextStyle } from "react-native";

export type PluralFormatterProps = {

  value: number;

  other: ReactNode;

  zero?: ReactNode;

  one?: ReactNode;

  few?: ReactNode;

  style?: StyleProp<TextStyle> | undefined;

};
