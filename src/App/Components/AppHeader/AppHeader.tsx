import React from "react";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import {
  AppState,
  Routes,
  useAppActions,
  useAppDispatch,
  useLocalizationService,
} from "@config";
import { ColorPalette } from "@data";
import { DrawerHeaderProps } from "@react-navigation/drawer";
import { getColorCode, getContrastColorCode, isNotEmptyColor } from "@utils/ColorPaletteUtils";
import { useRoute } from "@utils/NavigationUtils";
import { appHeaderStyles } from "./AppHeaderStyles";

export function AppHeader(props: DrawerHeaderProps): JSX.Element {
  const route = useRoute();
  const localization = useLocalizationService();
  const showConfigButton = useSelector((x: AppState): boolean => x.common.showConfigButton);
  const colorized = useSelector((x: AppState): boolean => x.common.colorized);
  const color = useSelector((x: AppState): ColorPalette | null => x.common.color);
  const appDispatch = useAppDispatch();

  const {
    showConfigModal,
  } = useAppActions();

  const headerTextColor = colorized && isNotEmptyColor(color)
    ? {
      color: getContrastColorCode(color!),
    }
    : undefined;

  const headerBackgroundColor = colorized && isNotEmptyColor(color)
    ? {
      backgroundColor: getColorCode(color!),
    }
    : undefined;

  return (
    <View
      style={[
        appHeaderStyles.container,
        headerBackgroundColor,
      ]}
    >
      <Button
        variant="transparent"
        style={appHeaderStyles.button}
        accessibilityLabel={localization.get("header.accessibility.menu")}
        onPress={props.navigation.toggleDrawer}
      >
        <Icon
          name="menu"
          style={[
            appHeaderStyles.menuIcon,
            headerTextColor,
          ]}
        />
      </Button>
      {
        props.navigation.canGoBack()
        && route.name !== Routes.Home
        && (
          <Button
            variant="transparent"
            style={appHeaderStyles.button}
            accessibilityLabel={localization.get("header.accessibility.back")}
            onPress={props.navigation.goBack}
          >
            <Icon
              name="back"
              style={[
                appHeaderStyles.backIcon,
                headerTextColor,
              ]}
            />
          </Button>
        )
      }
      <Text
        lineBreakMode="tail"
        numberOfLines={1}
        style={[
          appHeaderStyles.title,
          headerTextColor,
        ]}
      >
        {props.options.title ?? props.route.name}
      </Text>
      {
        showConfigButton
        && (
          <View
            style={appHeaderStyles.config}
          >
            <Button
              variant="transparent"
              style={appHeaderStyles.configButton}
              onPress={(): void => {
                appDispatch(showConfigModal());
              }}
            >
              <Icon
                name="layout"
                style={[
                  appHeaderStyles.configButtonIcon,
                  headerTextColor,
                ]}
              />
            </Button>
          </View>
        )
      }
    </View>
  );
}
