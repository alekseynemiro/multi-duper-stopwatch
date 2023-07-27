/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useLayoutEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Routes, ServiceIdentifier, serviceProvider } from "@config";
import { IMigrationRunner } from "@data";
import { HomePage } from "@pages/Home";
import { ProjectEditorPage } from "@pages/ProjectEditor";
import { ProjectListPage } from "@pages/ProjectList";
import { ReportPage } from "@pages/Report";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { AppNavigation } from "./AppNavigation";

const Drawer = createDrawerNavigator();

const migrationRunner = serviceProvider.get<IMigrationRunner>(ServiceIdentifier.MigrationRunner);

export function App(): JSX.Element {
  useLayoutEffect(
    (): void => {
      // TODO:
      migrationRunner.run();
    },
    []
  );

  return (
    <GestureHandlerRootView
      style={{ flex: 1 }}
    >
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName={Routes.Home}
          drawerContent={AppNavigation}
        >
          <Drawer.Screen
            name={Routes.Home}
            component={HomePage}
          />
          <Drawer.Screen
            name={Routes.ProjectList}
            component={ProjectListPage}
            options={{
              title: "Project list",
            }}
          />
          <Drawer.Screen
            name={Routes.Project}
            component={ProjectEditorPage}
          />
          <Drawer.Screen
            name={Routes.Report}
            component={ReportPage}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
