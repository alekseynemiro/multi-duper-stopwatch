import React, { useCallback, useRef, useState } from "react";
import { Text, useWindowDimensions,View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Button } from "@components/Button";
import { Routes, ServiceIdentifier, serviceProvider } from "@config";
import { useFocusEffect } from "@react-navigation/native";
import { IProjectService } from "@services/Projects";
import { useNavigation, useRoute } from "@utils/NavigationUtils";
import { ActiveProjectView } from "@views/ActiveProject";
import { ReportView, ReportViewProps } from "@views/Report";
import { homePageStyles } from "./HomePageStyles";

const projectService = serviceProvider.get<IProjectService>(ServiceIdentifier.ProjectService);

export function HomePage(): JSX.Element {
  const { width } = useWindowDimensions();

  const navigation = useNavigation();
  const route = useRoute<Routes.Home>();
  const projectId = route.params?.projectId;

  const reportViewRef = useRef<ReportViewProps>();

  const [sessionId, setSessionId] = useState<string | undefined>();
  const [canOpenProject, setCanOpenProject] = useState<boolean>(false);

  const load = useCallback(
    async(): Promise<void> => {
      const projects = await projectService.getAll();

      setCanOpenProject(projects.items.length > 0);
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

  if (!projectId) {
    return (
      <View
        style={homePageStyles.openProject}
      >
        <Button
          variant="secondary"
          title="Create new project"
          style={homePageStyles.createProjectButton}
          onPress={(): void => {
            navigation.navigate(Routes.Project);
          }}
        />
        <Text
          style={homePageStyles.text}
        >
          - or -
        </Text>
        <Button
          variant="secondary"
          title="Open project"
          disabled={!canOpenProject}
          style={homePageStyles.openProjectButton}
          onPress={(): void => {
            navigation.navigate(Routes.ProjectList);
          }}
        />
      </View>
    );
  }

  const activeProjectView = (
    <ActiveProjectView
      projectId={projectId}
      onLoad={(projectName: string): void => {
        navigation.setOptions({
          title: projectName,
        });
      }}
      onSessionStart={setSessionId}
      onSessionFinished={() => {
        if (sessionId) {
          navigation.navigate(
            Routes.Report,
            {
              sessionId,
            }
          );
        } else {
          // TODO:
        }
      }}
    />
  );

  const reportView = sessionId
    ? (
      <ReportView
        ref={reportViewRef}
        sessionId={sessionId}
        autoScrollToBottom={true}
      />
    )
    : <></>;

  return (
    <Carousel
      width={width}
      style={homePageStyles.container}
      loop={false}
      autoPlay={false}
      overscrollEnabled={true}
      scrollAnimationDuration={1000}
      panGestureHandlerProps={{
        activeOffsetX: [-10, 10],
      }}
      data={[
        activeProjectView,
        reportView,
      ]}
      onSnapToItem={(index) => {
        if (index === 1 && reportViewRef.current) {
          reportViewRef.current?.load?.apply(reportViewRef.current);
        }
      }}
      renderItem={({ item }) => {
        return item;
      }}
    />
  );
}
