import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
} from "react-native";
import { View } from "react-native";
import { ServiceIdentifier, serviceProvider } from "@config";
import { Action as ActionModel } from "@dto/ActiveProject";
import { IStopwatchService } from "@services/Stopwatch";
import { getColorCode, getContrastColorCode } from "@utils/ColorPaletteUtils";
import { ElapsedTime } from "./ElapsedTime";
import { StopwatchDisplayProps } from "./StopwatchDisplayProps";
import { stopwatchDisplayStyles } from "./StopwatchDisplayStyles";

const stopwatchService = serviceProvider.get<IStopwatchService>(ServiceIdentifier.StopwatchService);

export function StopwatchDisplay(props: StopwatchDisplayProps): JSX.Element {
  const {
    activeAction,
  } = props;

  const [showActiveAction, setShowActiveAction] = useState<boolean>();

  return (
    <TouchableOpacity
      style={stopwatchDisplayStyles.container}
      onPress={(): void => {
        if (showActiveAction) {
          stopwatchService.clearOffset();
          setShowActiveAction(false);
        } else {
          stopwatchService.setOffset();
          setShowActiveAction(true);
        }
      }}
    >
      <View
        style={stopwatchDisplayStyles.elapsedContainer}
      >
        {
          activeAction
          && (
            <View>
              {
                showActiveAction
                && (
                  <Text
                    style={[
                      stopwatchDisplayStyles.mode,
                      {
                        backgroundColor: getColorCode((activeAction as ActionModel).color),
                        color: getContrastColorCode((activeAction as ActionModel).color),
                      },
                    ]}
                  >
                    {activeAction?.name}
                  </Text>
                )
                || (
                  <Text
                    style={[
                      stopwatchDisplayStyles.mode,
                    ]}
                  >
                    Total
                  </Text>
                )
              }
            </View>
          )
          || (
            <Text
              style={[
                stopwatchDisplayStyles.mode,
              ]}
            >
              Total
            </Text>
          )
        }
        <ElapsedTime />
      </View>
    </TouchableOpacity>
  );
}
