import { useCallback, useState } from "react";
import React, { View } from "react-native";
import { ActivityIndicator } from "@components/ActivityIndicator";
import { Routes, useActiveProjectService } from "@config";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@utils/NavigationUtils";
import { initialScreenPageStyles } from "./InitialScreenPageStyles";

export function InitialScreenPage(): JSX.Element {
  const [loaded] = useState(false);

  const navigation = useNavigation();
  const activeProjectService = useActiveProjectService();

  const load = useCallback(
    async(): Promise<void> => {
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

  if (loaded) {
    return (
      <></>
    );
  }

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
    </View>
  );
}
