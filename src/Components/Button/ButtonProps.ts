import { ReactNode } from "react";
import {
  AccessibilityState,
  AccessibilityValue,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";

export type ButtonProps = {

  variant?: "primary" | "secondary" | "warning" | "danger" | "success" | "info" | "light" | "transparent";

  title?: ReactNode;

  children?: ReactNode;

  style?: StyleProp<ViewStyle>;

  childWrapperStyle?: StyleProp<ViewStyle>;

  titleStyle?: StyleProp<TextStyle>;

  disabled?: boolean;

  /**
   * When true, indicates that the view is an accessibility element.
   * By default, all the touchable elements are accessible.
   */
  accessible?: boolean | undefined;

  /**
   * Overrides the text that's read by the screen reader when the user interacts with the element. By default, the
   * label is constructed by traversing all the children and accumulating all the Text nodes separated by space.
   */
  accessibilityLabel?: string | undefined;

  /**
   * Accessibility State tells a person using either VoiceOver on iOS or TalkBack on Android the state of the element currently focused on.
   */
  accessibilityState?: AccessibilityState | undefined;

  /**
   * An accessibility hint helps users understand what will happen when they perform an action on the accessibility element when that result is not obvious from the accessibility label.
   */
  accessibilityHint?: string | undefined;
  /**
   * Represents the current value of a component. It can be a textual description of a component's value, or for range-based components, such as sliders and progress bars,
   * it contains range information (minimum, current, and maximum).
   */
  accessibilityValue?: AccessibilityValue | undefined;

  /**
   * [Android] Controlling if a view fires accessibility events and if it is reported to accessibility services.
   */
  importantForAccessibility?: ("auto" | "yes" | "no" | "no-hide-descendants") | undefined;

  onPress(): void;

};
