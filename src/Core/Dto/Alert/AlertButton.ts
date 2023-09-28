import { ButtonProps } from "@components/Button/ButtonProps";

export type AlertButton = {

  text: string;

  variant?: ButtonProps["variant"];

  onPress?: (() => void) | undefined;

};
