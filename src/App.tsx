import React, { useCallback, useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppHeader } from "@components/AppHeader";
import { ContentLoadIndicator } from "@components/ContentLoadIndicator";
import { Routes, ServiceIdentifier, serviceProvider } from "@config";
import { SessionState } from "@data";
import { ApplicationSettingsPage } from "@pages/ApplicationSettings";
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

export function App(): JSX.Element {
  const [showLoadingIndicator, setShowLoadingIndicator] = useState<boolean>(true);

  const appHeader = useCallback(
    (props: DrawerHeaderProps): JSX.Element => {
      return (
        <AppHeader {...props} />
      );
    },
    []
  );

  useEffect(
    (): void => {
      const initLang = async(): Promise<void> => {
        await localizationService.init();
        setShowLoadingIndicator(false);
      };

      initLang();
    },
    [
      setShowLoadingIndicator,
    ]
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

  if (showLoadingIndicator) {
    return (
      <ContentLoadIndicator />
    );
  }

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
          <Drawer.Screen
            name={Routes.ApplicationSettings}
            component={ApplicationSettingsPage}
            options={{
              title: localizationService.get("menu.applicationSettings"),
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
