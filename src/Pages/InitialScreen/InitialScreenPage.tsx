import { useCallback, useState } from "react";
import React, { View } from "react-native";
import { ActivityIndicator } from "@components/ActivityIndicator";
import { Routes, ServiceIdentifier, serviceProvider } from "@config";
import { useFocusEffect } from "@react-navigation/native";
import { IActiveProjectService } from "@services/ActiveProject";
import { useNavigation } from "@utils/NavigationUtils";
import { initialScreenPageStyles } from "./InitialScreenPageStyles";

const activeProjectService = serviceProvider.get<IActiveProjectService>(ServiceIdentifier.ActiveProjectService);

export function InitialScreenPage(): JSX.Element {
  const [loaded] = useState(false);

  const navigation = useNavigation();

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
