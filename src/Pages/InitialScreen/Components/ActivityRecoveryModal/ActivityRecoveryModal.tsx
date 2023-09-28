import React from "react";
import { Text, View } from "react-native";
import { Button } from "@components/Button";
import { HorizontalLine } from "@components/HorizontalLine";
import { Modal } from "@components/Modal";
import { useLocalizationService } from "@config";
import { colors } from "@styles";
import { getColorCode } from "@utils/ColorPaletteUtils";
import { getTimeSpan } from "@utils/TimeUtils";
import { ActivityRecoveryModalProps } from "./ActivityRecoveryModalProps";
import { activityRecoveryModalStyles } from "./ActivityRecoveryModalStyles";

export function ActivityRecoveryModal(props: ActivityRecoveryModalProps): JSX.Element {
  const localization = useLocalizationService();

  const {
    activity,
    onRecovery,
    onCancel,
  } = props;

  const timeSpan = getTimeSpan(activity.currentDate.getTime() - activity.startDate.getTime());

  const backgroundColor = activity.color
    ? getColorCode(activity.color)
    : colors.background;

  return (
    <Modal
      show={true}
    >
      <Text>
        {localization.get("initialScreen.activityRecoveryModal.introduction")}
      </Text>
      <Text>
        {localization.get("initialScreen.activityRecoveryModal.timePassed")}
      </Text>
      <Text
        style={activityRecoveryModalStyles.bold}
      >
        {timeSpan.displayValue}
      </Text>
      <Text>
        {localization.get("initialScreen.activityRecoveryModal.lastActivity")}
      </Text>
      <View
        style={activityRecoveryModalStyles.activity}
      >
        <View
          style={[
            activityRecoveryModalStyles.activityIcon,
            {
              backgroundColor,
            },
          ]}
        />
        <Text
          style={activityRecoveryModalStyles.bold}
        >
          {activity.name}
        </Text>
      </View>
      <Text>
        {localization.get("initialScreen.activityRecoveryModal.wouldYouLikeToAdd")}
      </Text>
      <View
        style={activityRecoveryModalStyles.row}
      >
        <HorizontalLine size="sm" />
      </View>
      <View
        style={activityRecoveryModalStyles.footer}
      >
        <Button
          variant="primary"
          title={localization.get("initialScreen.activityRecoveryModal.yes")}
          style={activityRecoveryModalStyles.buttonYes}
          onPress={onRecovery}
        />
        <Button
          variant="secondary"
          title={localization.get("initialScreen.activityRecoveryModal.no")}
          style={activityRecoveryModalStyles.buttonNo}
          onPress={onCancel}
        />
      </View>
    </Modal>
  );
}
