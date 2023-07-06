export type ButtonProps = {

  variant?: "primary" | "secondary" | "warning" | "danger" | "success" | "info";

  title: string | JSX.Element;

  onPress(): void;

};
