import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text, useWindowDimensions, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { CarouselRenderItemInfo } from "react-native-reanimated-carousel/lib/typescript/types";
import { ActivityIndicator } from "@components/ActivityIndicator";
import { Button } from "@components/Button";
import {
  Routes,
  useActiveProjectService,
  useLocalizationService,
  useLoggerService,
  useProjectService,
} from "@config";
import { SessionState } from "@data";
import { ActivityLoggedResult } from "@dto/ActiveProject";
import { useFocusEffect } from "@react-navigation/native";
import { ActiveProjectServiceEventArgs } from "@services/ActiveProject";
import { styles } from "@styles";
import { useNavigation, useRoute } from "@utils/NavigationUtils";
import { ActiveProjectView } from "@views/ActiveProject";
import { ReportView, ReportViewProps } from "@views/Report";
import { homePageStyles } from "./HomePageStyles";


export function HomePage(): JSX.Element {
  const { width } = useWindowDimensions();

  const navigation = useNavigation();
  const route = useRoute<Routes.Home>();
  const localization = useLocalizationService();
  const projectService = useProjectService();
  const activeProjectService = useActiveProjectService();
  const loggerService = useLoggerService();

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
        sessionId,
        "activeProjectId",
        activeProjectService.project?.id,
        "activeSessionId",
        activeProjectService.session?.id,
      );

      if (activeProjectService.project) {
        setProjectId(activeProjectService.project.id);

        if (activeProjectService.session) {
          setSessionId(activeProjectService.session.id);
        }

        navigation.setOptions({
          title: activeProjectService.project.name,
        });
      }

      if (!activeProjectService.project) {
        if (sessionId) {
          await activeProjectService.useSessionId(sessionId);
        }

        if (!sessionId && projectId) {
          await activeProjectService.useProjectId(projectId);
        }

        if (!sessionId && !projectId) {
          await activeProjectService.useLastSessionId();
        }

        if (activeProjectService.session?.state === SessionState.Finished) {
          navigation.navigate(
            Routes.Home,
            {
              projectId,
            }
          );
        }
      }

      await reportViewRef.current?.load?.apply(reportViewRef.current);

      const projects = await projectService.getAll();

      setCanOpenProject(projects.items.length > 0);
      setLoading(false);
    },
    [
      navigation,
      projectId,
      sessionId,
      activeProjectService,
      loggerService,
      projectService,
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

      const activityLoggedSubscription = activeProjectService.addEventListener<ActivityLoggedResult>(
        "activity-logged",
        (e: ActivityLoggedResult): void => {
          reportViewRef.current?.addItem?.apply(
            reportViewRef.current,
            [{
              id: e.id,
              activityId: e.activityId,
              name: e.activityName,
              color: e.activityColor,
              maxSpeed: e.maxSpeed,
              avgSpeed: e.avgSpeed,
              distance: e.distance,
              elapsedTime: e.elapsedTime,
              startDate: e.startDate,
              finishDate: e.finishDate,
            }]
          );
        }
      );

      return async(): Promise<void> => {
        sessionStartedSubscription.remove();
        sessionFinishedSubscription.remove();
        projectLoadedSubscription.remove();
        activityLoggedSubscription.remove();
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
          title={localization.get("home.createProject")}
          style={homePageStyles.createProjectButton}
          onPress={(): void => {
            navigation.navigate(Routes.Project);
          }}
        />
        <Text
          style={homePageStyles.text}
        >
          - {localization.get("home.or")} -
        </Text>
        <Button
          variant="secondary"
          title={localization.get("home.openProject")}
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
    : (
      <View
        style={styles.contentView}
      >
        <Text
          style={styles.textCenter}
        >
          {localization.get("home.noReport")}
        </Text>
      </View>
    );

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
      renderItem={({ item }: CarouselRenderItemInfo<JSX.Element>) => {
        return item;
      }}
    />
  );
}
