import React, { useCallback, useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppHeader } from "@components/AppHeader";
import { Routes, ServiceIdentifier, serviceProvider } from "@config";
import { SessionState } from "@data";
import { HomePage } from "@pages/Home";
import { InitialScreenPage } from "@pages/InitialScreen";
import { ProjectEditorPage } from "@pages/ProjectEditor";
import { ProjectListPage } from "@pages/ProjectList";
import { ReportPage } from "@pages/Report";
import { ReportListPage } from "@pages/ReportList";
import { createDrawerNavigator,DrawerHeaderProps } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { IActiveProjectService } from "@services/ActiveProject";
import { ILocalizationService } from "@services/Localization";
import { styles } from "@styles";
import { AppNavigation } from "./AppNavigation";

const Drawer = createDrawerNavigator();

const activeProjectService = serviceProvider.get<IActiveProjectService>(ServiceIdentifier.ActiveProjectService);
const localizationService = serviceProvider.get<ILocalizationService>(ServiceIdentifier.LocalizationService);

localizationService.init();

export function App(): JSX.Element {
  const appHeader = useCallback(
    (props: DrawerHeaderProps): JSX.Element => {
      return (
        <AppHeader {...props} />
      );
    },
    []
  );

  useEffect(
    (): { (): void } => {
      const subscription = AppState.addEventListener(
        "change",
        async(nextAppState: AppStateStatus): Promise<void> => {
          if (nextAppState.match(/inactive/)) {
            if (
              activeProjectService.session
              && activeProjectService.session.state === SessionState.Run
            ) {
              await activeProjectService.pause();
            }
          }
        }
      );

      return (): void => {
        subscription.remove();
      };
    },
    []
  );

  return (
    <GestureHandlerRootView
      style={styles.fullFlex}
    >
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName={Routes.Init}
          drawerContent={AppNavigation}
          backBehavior="history"
          screenOptions={{
            header: appHeader,
            unmountOnBlur: true,
          }}
        >
          <Drawer.Screen
            name={Routes.Init}
            component={InitialScreenPage}
            options={{
              headerShown: false,
            }}
          />
          <Drawer.Screen
            name={Routes.Home}
            component={HomePage}
          />
          <Drawer.Screen
            name={Routes.ProjectList}
            component={ProjectListPage}
            options={{
              title: localizationService.get("menu.projectList"),
            }}
          />
          <Drawer.Screen
            name={Routes.Project}
            component={ProjectEditorPage}
          />
          <Drawer.Screen
            name={Routes.Report}
            component={ReportPage}
            options={{
              title: localizationService.get("report.pageTitle"),
            }}
          />
          <Drawer.Screen
            name={Routes.ReportList}
            component={ReportListPage}
            options={{
              title: localizationService.get("menu.reports"),
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
