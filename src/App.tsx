/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useCallback } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppHeader } from "@components/AppHeader";
import { Routes } from "@config";
import { HomePage } from "@pages/Home";
import { ProjectEditorPage } from "@pages/ProjectEditor";
import { ProjectListPage } from "@pages/ProjectList";
import { ReportPage } from "@pages/Report";
import { ReportListPage } from "@pages/ReportList";
import { createDrawerNavigator,DrawerHeaderProps } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { InitialScreen } from "@views/InitialScreen";
import { AppNavigation } from "./AppNavigation";

const Drawer = createDrawerNavigator();

export function App(): JSX.Element {
  const appHeader = useCallback(
    (props: DrawerHeaderProps): JSX.Element => {
      return (
        <AppHeader {...props} />
      );
    },
    []
  );

  return (
    <GestureHandlerRootView
      style={{ flex: 1 }}
    >
      <NavigationContainer>
        <InitialScreen />
        <Drawer.Navigator
          initialRouteName={Routes.Home}
          drawerContent={AppNavigation}
          backBehavior="history"
          screenOptions={{
            header: appHeader,
            unmountOnBlur: true,
          }}
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
          <Drawer.Screen
            name={Routes.ReportList}
            component={ReportListPage}
            options={{
              title: "Reports",
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
