import { useCallback, useState } from "react";
import React, { View } from "react-native";
import { ActivityIndicator } from "@components/ActivityIndicator";
import { Routes, useActiveProjectService } from "@config";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@utils/NavigationUtils";
import { ActivityRecoveryModal, RecoveryModel } from "./Components";
import { initialScreenPageStyles } from "./InitialScreenPageStyles";

export function InitialScreenPage(): JSX.Element {
  const navigation = useNavigation();
  const activeProjectService = useActiveProjectService();

  const [activityRecoveryModel, setActivityRecoveryModel] = useState<RecoveryModel | undefined>(undefined);

  const cancelRecovery = useCallback(
    async(): Promise<void> => {
      setActivityRecoveryModel(undefined);

      await activeProjectService.checkForCrash();
      await activeProjectService.reset();
      await activeProjectService.useLastSessionId();

      navigation.navigate(
        Routes.Home,
        {
          projectId: activeProjectService.project?.id,
          sessionId: activeProjectService.session?.id,
        }
      );
    },
    [
      navigation,
      activeProjectService,
    ]
  );

  const recovery = useCallback(
    async(): Promise<void> => {
      if (!activityRecoveryModel) {
        throw new Error("activityRecoveryModel is required.");
      }

      const date = activityRecoveryModel.currentDate;

      setActivityRecoveryModel(undefined);

      await activeProjectService.recovery(date);
      await activeProjectService.reset();
      await activeProjectService.useLastSessionId();

      navigation.navigate(
        Routes.Home,
        {
          projectId: activeProjectService.project?.id,
          sessionId: activeProjectService.session?.id,
        }
      );
    },
    [
      activityRecoveryModel,
      navigation,
      activeProjectService,
    ]
  );

  const load = useCallback(
    async(): Promise<void> => {
      const canRecovery = await activeProjectService.canRecovery();

      if (canRecovery) {
        setActivityRecoveryModel({
          color: canRecovery.activityColor,
          name: canRecovery.activityName,
          startDate: canRecovery.activityStartDate,
          currentDate: canRecovery.now,
        });
      } else {
        await cancelRecovery();
      }
    },
    [
      activeProjectService,
      cancelRecovery,
    ]
  );

  useFocusEffect(
    useCallback(
      (): void => {
        load();
      },
      [
        load,
      ]
    )
  );

  return (
    <View
      style={initialScreenPageStyles.container}
    >
      <View
        style={initialScreenPageStyles.loader}
      >
        <ActivityIndicator
          size="x-large"
        />
      </View>
      {
        !!activityRecoveryModel
        && (
          <ActivityRecoveryModal
            activity={activityRecoveryModel}
            onRecovery={recovery}
            onCancel={cancelRecovery}
          />
        )
      }
    </View>
  );
}
