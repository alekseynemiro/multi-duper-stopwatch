import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RadioProps } from "./RadioProps";
import { radioStyles } from "./RadioStyles";

export function Radio(props: RadioProps): JSX.Element {
  const {
    disabled,
    checked: initialChecked,
    style,
    onChecked,
  } = props;

  const [checked, setChecked] = useState<boolean>(initialChecked ?? false);

  useEffect(
    (): void => {
      setChecked(initialChecked ?? false);
    },
    [
      initialChecked,
    ]
  );

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        radioStyles.radio,
        style,
      ]}
      onPress={(): void => {
        if (disabled) {
          return;
        }

        const newChecked = !checked;
        setChecked(newChecked);
        onChecked && onChecked(newChecked);
      }}
    >
      {
        checked
        && (
          <View
            style={radioStyles.checked}
          />
        )
      }
    </TouchableOpacity>
  );
}
