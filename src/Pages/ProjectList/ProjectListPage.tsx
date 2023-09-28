import React, { useCallback, useState } from "react";
import { FlatList, ListRenderItemInfo, Text, View } from "react-native";
import { Button } from "@components/Button";
import { ContentLoadIndicator } from "@components/ContentLoadIndicator";
import { Icon } from "@components/Icon";
import { TableRowSeparator } from "@components/TableRowSeparator";
import {
  Routes,
  useActiveProjectService,
  useAlertService,
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
  const alertService = useAlertService();

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
      if (
        activeProjectService.project?.id === project.id
        && activeProjectService.session
        && [SessionState.Paused, SessionState.Run].includes(activeProjectService.session.state)
      ) {
        alertService.show(
          localization.get("projectList.deleteConfirmation.title"),
          localization.get("projectList.deleteConfirmation.activeProjectMessage", { projectName: project.name }),
          [
            {
              text: localization.get("projectList.deleteConfirmation.cancel"),
              variant: "secondary",
            },
            {
              text: localization.get("projectList.deleteConfirmation.delete"),
              variant: "danger",
              onPress: (): void => {
                deleteProject(project.id);
              },
            },
          ]
        );
      } else {
        alertService.show(
          localization.get("projectList.deleteConfirmation.title"),
          localization.get("projectList.deleteConfirmation.message", { projectName: project.name }),
          [
            {
              text: localization.get("projectList.deleteConfirmation.cancel"),
              variant: "secondary",
            },
            {
              text: localization.get("projectList.deleteConfirmation.delete"),
              variant: "danger",
              onPress: (): void => {
                deleteProject(project.id);
              },
            },
          ]
        );
      }
    },
    [
      deleteProject,
      localization,
      activeProjectService,
      alertService,
    ]
  );

  const play = useCallback(
    async(project: GetAllResultItem): Promise<void> => {
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
          projectId: project.id,
        }
      );
    },
    [
      settingsService,
      activeProjectService,
      sessionService,
      navigation,
    ]
  );

  const playHandler = useCallback(
    async(project: GetAllResultItem): Promise<void> => {
      if (
        activeProjectService.session
        && activeProjectService.session.state !== SessionState.Finished
      ) {
        alertService.show(
          localization.get("projectList.activeSessionWarning.title"),
          localization.get(
            "projectList.activeSessionWarning.message",
            {
              activeProjectName: activeProjectService.project?.name,
              newProjectName: project.name,
            }
          ),
          [
            {
              text: localization.get("projectList.activeSessionWarning.no"),
              variant: "secondary",
            },
            {
              text: localization.get("projectList.activeSessionWarning.yes"),
              variant: "primary",
              onPress: (): Promise<void> => {
                return play(project);
              },
            },
          ]
        );
      } else {
        return play(project);
      }
    },
    [
      activeProjectService,
      localization,
      alertService,
      play,
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
              onPress={(): Promise<void> => {
                return playHandler(x);
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
      navigation,
      requestToDeleteProject,
      playHandler,
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
