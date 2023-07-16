import React, { useEffect, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Alert } from "react-native-windows";
import { Button } from "@components/Button";
import { ContentLoadIndicator } from "@components/ContentLoadIndicator";
import { Icon } from "@components/Icon";
import { Routes, ServiceIdentifier, serviceProvider } from "@config";
import { GetAllResultItem } from "@dto/Projects";
import { IProjectService } from "@services/Projects";
import { styles } from "@styles";
import { ProjectListPageProps } from "./ProjectListPageProps";
import { ProjectListPageState } from "./ProjectListPageState";
import { projectListPageStyles } from "./ProjectListPageStyles";

const projectService = serviceProvider.get<IProjectService>(ServiceIdentifier.ProjectService);

export function ProjectListPage({ navigation }: ProjectListPageProps): JSX.Element {
  const mounted = useRef(false);
  const loaded = useRef(false);

  const [list, setList] = useState<ProjectListPageState["list"]>([]);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState<ProjectListPageState["showLoadingIndicator"]>(true);

  const load = async(): Promise<void> => {
    loaded.current = true;

    setShowLoadingIndicator(true);
    const data = await projectService.getAll();
    setList(data.items);
    setShowLoadingIndicator(false);
  };

  const requestToDeleteProject = (project: GetAllResultItem): void => {
    Alert.alert(
      "Confirmation",
      `Are you sure you want to delete project ${project.name}?`
      + "\n\n"
      + "It will be impossible to restore the project after deletion.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: (): void => {
            deleteProject(project.id);
          },
        },
      ]
    );
  };

  const deleteProject = async(projectId: string): Promise<void> => {
    setShowLoadingIndicator(true);

    await projectService.delete(projectId);
    await load();
  };

  if (!mounted.current) {
    !loaded.current && load();
  }

  useEffect(
    (): void => {
      mounted.current = true;
    },
    [mounted]
  );

  if (showLoadingIndicator) {
    return (
      <ContentLoadIndicator />
    );
  }

  return (
    <ScrollView style={styles.contentView}>
      <View>
        <View style={styles.table}>
          {
            list.map((x: GetAllResultItem, index: number): JSX.Element => {
              return (
                <View
                  key={x.id}
                  style={[
                    styles.tableRow,
                    index !== list.length - 1
                      ? projectListPageStyles.tableRow
                      : undefined,
                  ]}
                >
                  <View
                    style={[
                      styles.tableCell,
                      projectListPageStyles.projectNameCol,
                    ]}
                  >
                    <Text>
                      {x.name}
                    </Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Button
                      variant="primary"
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
                        variant="primary-contrast"
                      />
                    </Button>
                  </View>
                  <View style={styles.tableCell}>
                    <Button
                      variant="danger"
                      onPress={(): void => {
                        requestToDeleteProject(x);
                      }}
                    >
                      <Icon
                        name="delete"
                        variant="danger-contrast"
                      />
                    </Button>
                  </View>
                </View>
              );
            })
          }
        </View>
      </View>
    </ScrollView>
  );
}