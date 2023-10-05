import React from "react";
import { BackHandler, SafeAreaView, ScrollView, View } from "react-native";
import { HorizontalLine } from "@components/HorizontalLine";
import { Icon } from "@components/Icon";
import { Routes, ServiceIdentifier, serviceProvider } from "@config";
import { DrawerItem } from "@react-navigation/drawer";
import { ILocalizationService } from "@services/Localization";
import { useNavigation } from "@utils/NavigationUtils";
import { appNavigationStyles } from "./AppNavigationStyles";

const localizationService = serviceProvider.get<ILocalizationService>(ServiceIdentifier.LocalizationService);

export function AppNavigation(): JSX.Element {
  const navigation = useNavigation();

  const iconWrapper = (icon: JSX.Element): JSX.Element => {
    return (
      <View
        style={appNavigationStyles.iconContainer}
      >
        {icon}
      </View>
    );
  };

  const homeIcon = (): JSX.Element => iconWrapper(<Icon name="home" size={32} />);
  const createProjectIcon = (): JSX.Element => iconWrapper(<Icon name="create-project" size={32} />);
  const projectListIcon = (): JSX.Element => iconWrapper(<Icon name="project-list" size={32} />);
  const reportsIcon = (): JSX.Element => iconWrapper(<Icon name="statistics" size={32} />);
  const applicationSettingsIcon = (): JSX.Element => iconWrapper(<Icon name="application-settings" size={32} />);
  const aboutIcon = (): JSX.Element => iconWrapper(<Icon name="info" size={32} />);
  const exitIcon = (): JSX.Element => iconWrapper(<Icon name="exit" size={32} />);

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
            navigation.navigate(Routes.ApplicationSettings);
          }}
        />
        <DrawerItem
          label={localizationService.get("menu.about")}
          icon={aboutIcon}
          onPress={(): void => {
            navigation.navigate(Routes.About);
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
