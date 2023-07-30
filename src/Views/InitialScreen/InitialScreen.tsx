import { useCallback, useState } from "react";
import React, { View } from "react-native";
import { ActivityIndicator } from "@components/ActivityIndicator";
import { ServiceIdentifier, serviceProvider } from "@config";
import { IMigrationRunner } from "@data";
import { useFocusEffect } from "@react-navigation/native";
import { initialScreenStyles } from "./InitialScreenStyles";

const migrationRunner = serviceProvider.get<IMigrationRunner>(ServiceIdentifier.MigrationRunner);

export function InitialScreen(): JSX.Element {
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(
    async(): Promise<void> => {
      await migrationRunner.run();
      setLoaded(true);
    },
    []
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
      style={initialScreenStyles.container}
    >
      <View
        style={initialScreenStyles.loader}
      >
        <ActivityIndicator
          size="x-large"
        />
      </View>
    </View>
  );
}
