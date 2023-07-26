import React, { useRef, useState } from "react";
import { useWindowDimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Routes } from "@config";
import { useNavigation, useRoute } from "@utils/NavigationUtils";
import { ActiveProjectView } from "@views/ActiveProject";
import { ReportView, ReportViewProps } from "@views/Report";
import { homePageStyles } from "./HomePageStyles";

export function HomePage(): JSX.Element {
  const { width } = useWindowDimensions();

  const navigation = useNavigation();
  const route = useRoute<Routes.Home>();
  const projectId = route.params?.projectId;

  const reportViewRef = useRef<ReportViewProps>();

  const [sessionId, setSessionId] = useState<string | undefined>();

  const activeProjectView = (
    <ActiveProjectView
      projectId={projectId}
      onLoad={(projectName: string): void => {
        navigation.setOptions({
          title: projectName,
        });
      }}
      onSessionStart={setSessionId}
    />
  );

  const reportView = sessionId
    ? (
      <ReportView
        ref={reportViewRef}
        sessionId={sessionId as string}
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
