import React, { useRef, useState } from "react";
import {
  Text,
  useWindowDimensions,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Routes } from "@config";
import { useRoute } from "@utils/NavigationUtils";
import { ActiveProjectView } from "@views/ActiveProject";
import { homePageStyles } from "./HomePageStyles";

export function HomePage(): JSX.Element {
  const { width } = useWindowDimensions();

  const route = useRoute<Routes.Home>();
  const projectId = route.params?.projectId;

  const [sessionId, setSessionId] = useState<string | undefined>();

  const activeProjectView = (
    <ActiveProjectView
      projectId={projectId}
      onSessionStart={setSessionId}
    />
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
        <Text>TODO:</Text>,
      ]}
      renderItem={({ item }) => {
        return item;
      }}
    />
  );
}
