import React from "react";
import {
  Text,
  useWindowDimensions,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Routes } from "@config";
import { ActiveProjectPage } from "@pages/ActiveProject";
import { useRoute } from "@utils/NavigationUtils";
import { homePageStyles } from "./HomePageStyles";

export function HomePage(): JSX.Element {
  const { width } = useWindowDimensions();

  const route = useRoute<Routes.Home>();
  const projectId = route.params?.projectId;

  return (
    <Carousel
      loop
      width={width}
      style={homePageStyles.container}
      autoPlay={false}
      data={[...new Array(2).keys()]}
      scrollAnimationDuration={1000}
      panGestureHandlerProps={{

      }}
      renderItem={({ index }) => {
        if (index === 0) {
          return (
            <ActiveProjectPage
              projectId={projectId}
            />
          );
        } else if (index === 1) {
          return (
            <Text>TODO: {index}</Text>
          );
        } else {
          throw new Error(`The value ${index} is not supported.`);
        }
      }}
    />
  );
}
