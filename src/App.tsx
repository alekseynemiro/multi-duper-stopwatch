import React, { useCallback, useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { AlertProvider } from "@components/Alert";
import { AppHeader } from "@components/AppHeader";
import { ContentLoadIndicator } from "@components/ContentLoadIndicator";
import { appStore, Routes, ServiceIdentifier, serviceProvider } from "@config";
import { IMigrationRunner, SessionState } from "@data";
import { AboutPage } from "@pages/About";
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
import { ILoggerService } from "@services/Logger";
import { AppTheme, styles } from "@styles";
import { AppNavigation } from "./AppNavigation";

const Drawer = createDrawerNavigator();

const migrationRunner = serviceProvider.get<IMigrationRunner>(ServiceIdentifier.MigrationRunner);
const localizationService = serviceProvider.get<ILocalizationService>(ServiceIdentifier.LocalizationService);
const activeProjectService = serviceProvider.get<IActiveProjectService>(ServiceIdentifier.ActiveProjectService);
const loggerService = serviceProvider.get<ILoggerService>(ServiceIdentifier.LoggerService);

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
      const initApp = async(): Promise<void> => {
        loggerService.debug(
          App.name,
          "initApp"
        );

        await migrationRunner.run();
        await localizationService.init();
        setShowLoadingIndicator(false);
      };

      initApp();
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
          loggerService.debug(
            App.name,
            "nextAppState",
            nextAppState
          );

          if (nextAppState === "inactive") {
            if (
              activeProjectService.session
              && activeProjectService.session.state === SessionState.Run
            ) {
              await activeProjectService.pause();
            }
          } else {
            if (nextAppState !== "active") {
              await activeProjectService.keep();
            }
          }
        }
      );

      return (): void => {
        loggerService.debug(
          App.name,
          "unmount"
        );

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
    <Provider store={appStore}>
      <GestureHandlerRootView
        style={styles.fullFlex}
      >
        <NavigationContainer
          theme={AppTheme}
        >
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
              options={{
                title: localizationService.get("menu.home"),
              }}
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
            <Drawer.Screen
              name={Routes.About}
              component={AboutPage}
              options={{
                title: localizationService.get("menu.about"),
              }}
            />
          </Drawer.Navigator>
        </NavigationContainer>
        <AlertProvider />
      </GestureHandlerRootView>
    </Provider>
  );
}
