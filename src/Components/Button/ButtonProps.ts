export type ButtonProps = {

  variant?: "default" | "primary" | "secondary" | "warning" | "danger" | "success" | "info";

  title: string | JSX.Element;

  onPress(): void;

};
