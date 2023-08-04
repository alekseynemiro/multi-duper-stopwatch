import React from "react";
import { BackHandler, SafeAreaView, ScrollView } from "react-native";
import { HorizontalLine } from "@components/HorizontalLine";
import { Icon } from "@components/Icon";
import { Routes, ServiceIdentifier, serviceProvider } from "@config";
import { DrawerItem } from "@react-navigation/drawer";
import { ILocalizationService } from "@services/Localization";
import { useNavigation } from "@utils/NavigationUtils";

const localizationService = serviceProvider.get<ILocalizationService>(ServiceIdentifier.LocalizationService);

export function AppNavigation(): JSX.Element {
  const navigation = useNavigation();

  const homeIcon = (): JSX.Element => <Icon name="home" />;
  const createProjectIcon = (): JSX.Element => <Icon name="create-project" />;
  const projectListIcon = (): JSX.Element => <Icon name="project-list" />;
  const reportsIcon = (): JSX.Element => <Icon name="statistics" />;
  const applicationSettingsIcon = (): JSX.Element => <Icon name="application-settings" />;
  const exitIcon = (): JSX.Element => <Icon name="exit" />;

  return (
    <SafeAreaView>
      <ScrollView>
        <DrawerItem
          label={localizationService.get("menu.home")}
          icon={homeIcon}
          onPress={(): void => {
            navigation.navigate(Routes.Home);
          }}
        />
        <DrawerItem
          label={localizationService.get("menu.createProject")}
          icon={createProjectIcon}
          onPress={(): void => {
            navigation.navigate(Routes.Project, undefined);
          }}
        />
        <DrawerItem
          label={localizationService.get("menu.projectList")}
          icon={projectListIcon}
          onPress={(): void => {
            navigation.navigate(Routes.ProjectList);
          }}
        />
        <DrawerItem
          label={localizationService.get("menu.reports")}
          icon={reportsIcon}
          onPress={(): void => {
            navigation.navigate(Routes.ReportList);
          }}
        />
        <HorizontalLine />
        <DrawerItem
          label={localizationService.get("menu.applicationSettings")}
          icon={applicationSettingsIcon}
          onPress={(): void => {
            // TODO:
          }}
        />
        <HorizontalLine />
        <DrawerItem
          label={localizationService.get("menu.exit")}
          icon={exitIcon}
          onPress={(): void => {
            BackHandler.exitApp();
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
