import React from "react";
import { Text, View } from "react-native";
import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import { DrawerHeaderProps } from "@react-navigation/drawer";
import { appHeaderStyles } from "./AppHeaderStyles";

export function AppHeader(props: DrawerHeaderProps): JSX.Element {
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
