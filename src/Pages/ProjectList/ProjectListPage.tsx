import React, { useCallback, useState } from "react";
import { FlatList, ListRenderItemInfo, Text, View } from "react-native";
import { Alert } from "react-native";
import { Button } from "@components/Button";
import { ContentLoadIndicator } from "@components/ContentLoadIndicator";
import { Icon } from "@components/Icon";
import { TableRowSeparator } from "@components/TableRowSeparator";
import {
  Routes,
  useActiveProjectService,
  useLocalizationService,
  useProjectService,
  useSessionService,
  useSettingsService,
} from "@config";
import { SessionState, SettingKey } from "@data";
import { GetAllResultItem } from "@dto/Projects";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@utils/NavigationUtils";
import { projectListPageStyles } from "./ProjectListPageStyles";

export function ProjectListPage(): JSX.Element {
  const navigation = useNavigation();
  const localization = useLocalizationService();
  const projectService = useProjectService();
  const sessionService = useSessionService();
  const settingsService = useSettingsService();
  const activeProjectService = useActiveProjectService();

  // TODO: Use view model instead of DTO
  const [list, setList] = useState<Array<GetAllResultItem>>([]);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState<boolean>(true);

  const load = useCallback(
    async(): Promise<void> => {
      setShowLoadingIndicator(true);

      const data = await projectService.getAll();

      setList(data.items);
      setShowLoadingIndicator(false);
    },
    [
      projectService,
    ]
  );

  const deleteProject = useCallback(
    async(projectId: string): Promise<void> => {
      setShowLoadingIndicator(true);

      await projectService.delete(projectId);
      await load();
    },
    [
      projectService,
      load,
    ]
  );

  const requestToDeleteProject = useCallback(
    (project: GetAllResultItem): void => {
      Alert.alert(
        localization.get("projectList.confirmationTitle"),
        localization.get("projectList.confirmationMessage", { projectName: project.name }),
        [
          {
            text: localization.get("projectList.cancel"),
            style: "cancel",
          },
          {
            text: localization.get("projectList.delete"),
            onPress: (): void => {
              deleteProject(project.id);
            },
          },
        ]
      );
    },
    [
      deleteProject,
      localization,
    ]
  );

  const renderItem = useCallback(
    ({ item: x }: ListRenderItemInfo<GetAllResultItem>): React.ReactElement => {
      const projectName = x.name;
      const projectCode = x.id.substring(0, 5);

      return (
        <View
          key={x.id}
          style={projectListPageStyles.tableRow}
        >
          <View
            style={[
              projectListPageStyles.tableCell,
              projectListPageStyles.projectNameCol,
            ]}
          >
            <Text>
              {x.name}
            </Text>
          </View>
          <View
            style={projectListPageStyles.tableCell}
          >
            <Button
              variant="primary"
              style={projectListPageStyles.button}
              accessibilityLabel={localization.get(
                "projectList.accessibility.run",
                {
                  projectName,
                  projectCode,
                }
              )}
              onPress={async(): Promise<void> => {
                // TODO: Business logic service
                const lastSessionId = await settingsService.get(SettingKey.LastSessionId);

                if (lastSessionId) {
                  const session = await sessionService.get(lastSessionId);

                  if (session.state !== SessionState.Finished) {
                    await sessionService.finish({
                      sessionId: lastSessionId,
                      avgSpeed: 0,
                      distance: 0,
                      maxSpeed: 0,
                      date: undefined,
                    });
                  }

                  await settingsService.set(
                    SettingKey.LastSessionId,
                    null
                  );
                }

                await activeProjectService.reset();
                // --

                navigation.navigate(
                  Routes.Home,
                  {
                    projectId: x.id,
                  }
                );
              }}
            >
              <Icon
                name="play"
                variant="primary-contrast"
                style={projectListPageStyles.buttonIcon}
              />
            </Button>
          </View>
          <View
            style={projectListPageStyles.tableCell}
          >
            <Button
              variant="secondary"
              style={projectListPageStyles.button}
              accessibilityLabel={localization.get(
                "projectList.accessibility.edit",
                {
                  projectName,
                  projectCode,
                }
              )}
              onPress={(): void => {
                navigation.navigate(
                  Routes.Project,
                  {
                    projectId: x.id,
                  }
                );
              }}
            >
              <Icon
                name="edit"
                variant="secondary-contrast"
                style={projectListPageStyles.buttonIcon}
              />
            </Button>
          </View>
          <View
            style={projectListPageStyles.tableCell}
          >
            <Button
              variant="danger"
              style={projectListPageStyles.button}
              accessibilityLabel={localization.get(
                "projectList.accessibility.delete",
                {
                  projectName,
                  projectCode,
                }
              )}
              onPress={(): void => {
                requestToDeleteProject(x);
              }}
            >
              <Icon
                name="delete"
                variant="danger-contrast"
                style={projectListPageStyles.buttonIcon}
              />
            </Button>
          </View>
        </View>
      );
    },
    [
      localization,
      settingsService,
      activeProjectService,
      sessionService,
      navigation,
      requestToDeleteProject,
    ]
  );

  const keyExtractor = useCallback(
    (item: GetAllResultItem): string => {
      return item.id;
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

  if (showLoadingIndicator) {
    return (
      <ContentLoadIndicator />
    );
  }

  return (
    <View
      style={projectListPageStyles.contentView}
    >
      <View
        style={projectListPageStyles.table}
      >
        <FlatList
          data={list}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={TableRowSeparator}
        />
        {
          list.length === 0
            && (
              <View>
                <Text
                  style={projectListPageStyles.noProjects}
                >
                  {localization.get("projectList.noProjects")}
                </Text>
                <Button
                  title={localization.get("projectList.createProject")}
                  variant="primary"
                  style={projectListPageStyles.createProjectButton}
                  onPress={(): void => {
                    navigation.navigate(Routes.Project);
                  }}
                />
              </View>
            )
        }
      </View>
    </View>
  );
}
