import React from "react";
import { BackHandler, SafeAreaView, ScrollView } from "react-native";
import { HorizontalLine } from "@components/HorizontalLine";
import { Icon } from "@components/Icon";
import { Routes } from "@config";
import { DrawerItem } from "@react-navigation/drawer";
import { useNavigation } from "@utils/NavigationUtils";

export function AppNavigation(): JSX.Element {
  const navigation = useNavigation();

  const createProjectIcon = (): JSX.Element => <Icon name="create-project" />;
  const projectListIcon = (): JSX.Element => <Icon name="project-list" />;
  const actionListIcon = (): JSX.Element => <Icon name="action-list" />;
  const reportsIcon = (): JSX.Element => <Icon name="statistics" />;
  const applicationSettingsIcon = (): JSX.Element => <Icon name="application-settings" />;
  const exitIcon = (): JSX.Element => <Icon name="exit" />;

  return (
    <SafeAreaView>
      <ScrollView>
        <DrawerItem
          label="Home"
          onPress={(): void => {
            navigation.navigate(Routes.Home);
          }}
        />
        <DrawerItem
          label="Create project"
          icon={createProjectIcon}
          onPress={(): void => {
            navigation.navigate(Routes.Project, undefined);
          }}
        />
        <DrawerItem
          label="Project list"
          icon={projectListIcon}
          onPress={(): void => {
            navigation.navigate(Routes.ProjectList);
          }}
        />
        <DrawerItem
          label="Action list"
          icon={actionListIcon}
          onPress={(): void => {
            // TODO:
          }}
        />
        <DrawerItem
          label="Reports"
          icon={reportsIcon}
          onPress={(): void => {
            navigation.navigate(Routes.ReportList);
          }}
        />
        <HorizontalLine />
        <DrawerItem
          label="Application settings"
          icon={applicationSettingsIcon}
          onPress={(): void => {
            // TODO:
          }}
        />
        <HorizontalLine />
        <DrawerItem
          label="Exit"
          icon={exitIcon}
          onPress={(): void => {
            BackHandler.exitApp();
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
