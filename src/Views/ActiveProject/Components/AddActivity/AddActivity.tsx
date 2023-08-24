import React, { useEffect, useRef, useState } from "react";
import { Text } from "react-native";
import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import { useLocalizationService } from "@config";
import { AddActivityProps } from "./AddActivityProps";
import { addActivityStyles } from "./AddActivityStyles";

export function AddActivity(props: AddActivityProps): JSX.Element {
  const localization = useLocalizationService();
  const timer = useRef<number | undefined>(undefined);
  const [showHint, setShowHint] = useState<boolean>(false);

  const {
    onAddActivity,
  } = props;

  useEffect(
    (): void => {
      if (showHint) {
        if (timer.current !== undefined) {
          clearTimeout(timer.current);
        }

        timer.current = setTimeout(
          (): void => {
            setShowHint(false);
            timer.current = undefined;
          },
          3000
        );
      }
    },
    [
      showHint,
    ]
  );

  return (
    <Button
      variant="light"
      style={[
        addActivityStyles.addActivityButton,
        showHint && addActivityStyles.addActivityButtonHint,
      ]}
      childWrapperStyle={addActivityStyles.addActivityButtonChildContainer}
      onPress={(): void => {
        setShowHint(true);
      }}
      onLongPress={(): void => {
        if (timer.current !== undefined) {
          clearTimeout(timer.current);
        }

        setShowHint(false);
        onAddActivity();
      }}
    >
      {
        showHint
          &&
          (
            <Text
              style={addActivityStyles.addActivityButtonTextHint}
            >
              {localization.get("activeProject.addActivity.hold")}
            </Text>
          )
          || (
            <>
              <Icon
                name="add"
                style={addActivityStyles.addActivityButtonIcon}
              />
              <Text
                style={addActivityStyles.addActivityButtonText}
              >
                {localization.get("activeProject.addActivity.add")}
              </Text>
            </>
          )
      }
    </Button>
  );
}
