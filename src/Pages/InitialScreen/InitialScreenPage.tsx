import { useCallback, useState } from "react";
import React, { View } from "react-native";
import { ActivityIndicator } from "@components/ActivityIndicator";
import { Routes, ServiceIdentifier, serviceProvider } from "@config";
import { IMigrationRunner } from "@data";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@utils/NavigationUtils";
import { initialScreenPageStyles } from "./InitialScreenPageStyles";

const migrationRunner = serviceProvider.get<IMigrationRunner>(ServiceIdentifier.MigrationRunner);

export function InitialScreenPage(): JSX.Element {
  const [loaded] = useState(false);

  const navigation = useNavigation();

  const load = useCallback(
    async(): Promise<void> => {
      await migrationRunner.run();

      navigation.navigate(Routes.Home);
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
