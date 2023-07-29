import React from "react";
import { Text, View } from "react-native";
import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import { Routes } from "@config";
import { DrawerHeaderProps } from "@react-navigation/drawer";
import { useRoute } from "@utils/NavigationUtils";
import { appHeaderStyles } from "./AppHeaderStyles";

export function AppHeader(props: DrawerHeaderProps): JSX.Element {
  const route = useRoute();

  return (
    <View
      style={appHeaderStyles.container}
    >
      <Button
        variant="transparent"
        style={appHeaderStyles.button}
        onPress={props.navigation.toggleDrawer}
      >
        <Icon
          name="menu"
          style={appHeaderStyles.menuIcon}
        />
      </Button>
      {
        props.navigation.canGoBack()
        && route.name !== Routes.Home
        && (
          <Button
            variant="transparent"
            style={appHeaderStyles.button}
            onPress={props.navigation.goBack}
          >
            <Icon
              name="back"
              style={appHeaderStyles.backIcon}
            />
          </Button>
        )
      }
      <Text
        style={appHeaderStyles.title}
      >
        {props.options.title ?? props.route.name}
      </Text>
    </View>
  );
}
