import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text, useWindowDimensions,View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { ActivityIndicator } from "@components/ActivityIndicator";
import { Button } from "@components/Button";
import { Routes, ServiceIdentifier, serviceProvider } from "@config";
import { SessionState } from "@data";
import { useFocusEffect } from "@react-navigation/native";
import { ActiveProjectServiceEventArgs, IActiveProjectService } from "@services/ActiveProject";
import { ILoggerService } from "@services/Logger";
import { IProjectService } from "@services/Projects";
import { useNavigation, useRoute } from "@utils/NavigationUtils";
import { ActiveProjectView } from "@views/ActiveProject";
import { ReportView, ReportViewProps } from "@views/Report";
import { homePageStyles } from "./HomePageStyles";

const projectService = serviceProvider.get<IProjectService>(ServiceIdentifier.ProjectService);
const activeProjectService = serviceProvider.get<IActiveProjectService>(ServiceIdentifier.ActiveProjectService);
const loggerService = serviceProvider.get<ILoggerService>(ServiceIdentifier.LoggerService);

export function HomePage(): JSX.Element {
  const { width } = useWindowDimensions();

  const navigation = useNavigation();
  const route = useRoute<Routes.Home>();

  const reportViewRef = useRef<ReportViewProps>();

  const [projectId, setProjectId] = useState<string | undefined>(route.params?.projectId);
  const [sessionId, setSessionId] = useState<string | undefined>(route.params?.sessionId);
  const [loading, setLoading] = useState<boolean>(true);
  const [canOpenProject, setCanOpenProject] = useState<boolean>(false);

  const load = useCallback(
    async(): Promise<void> => {
      loggerService.debug(
        HomePage.name,
        "load",
        "projectId",
        projectId,
        "sessionId",
        sessionId
      );

      if (sessionId) {
        await activeProjectService.useSessionId(sessionId);
      }

      if (!sessionId && projectId) {
        await activeProjectService.useProjectId(projectId);
      }

      if (!sessionId && !projectId && !activeProjectService.session) {
        await activeProjectService.useLastSessionId();
      }

      const projects = await projectService.getAll();

      setCanOpenProject(projects.items.length > 0);
      setLoading(false);
    },
    [
      projectId,
      sessionId,
    ]
  );

  useEffect(
    (): { (): void } => {
      const sessionStartedSubscription = activeProjectService.addEventListener(
        "session-loaded",
        (): void => {
          activeProjectService.session && setSessionId(activeProjectService.session.id);
          activeProjectService.project && setProjectId(activeProjectService.project.id);
        }
      );

      const sessionFinishedSubscription = activeProjectService.addEventListener(
        "session-finished",
        (e: ActiveProjectServiceEventArgs): void => {
          navigation.navigate(
            Routes.Report,
            {
              sessionId: e.sessionId,
            }
          );
        }
      );

      const projectLoadedSubscription = activeProjectService.addEventListener(
        "project-loaded",
        (): void => {
          navigation.setOptions({
            title: activeProjectService.project?.name,
          });
        }
      );

      return async(): Promise<void> => {
        sessionStartedSubscription.remove();
        sessionFinishedSubscription.remove();
        projectLoadedSubscription.remove();

        if (
          activeProjectService.session
          && activeProjectService.session.state === SessionState.Run
        ) {
          await activeProjectService.pause();
        }

        await activeProjectService.reset();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  if (loading) {
    return (
      <ActivityIndicator />
    );
  }

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
    <ActiveProjectView />
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
