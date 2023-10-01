import React, { useState } from "react";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import { PopupMenu, PopupMenuItem } from "@components/PopupMenu";
import {
  AppState,
  Routes,
  useAppDispatch,
  useAppHeaderActions,
  useLocalizationService,
  useSettingsService,
} from "@config";
import { LayoutMode, SettingKey } from "@data";
import { DrawerHeaderProps } from "@react-navigation/drawer";
import { useRoute } from "@utils/NavigationUtils";
import { appHeaderStyles } from "./AppHeaderStyles";

export function AppHeader(props: DrawerHeaderProps): JSX.Element {
  const route = useRoute();
  const localization = useLocalizationService();
  const settings = useSettingsService();
  const showConfigButton = useSelector((x: AppState): boolean => x.header.showConfigButton);
  const layoutMode = useSelector((x: AppState): LayoutMode => x.header.layoutMode);
  const appDispatch = useAppDispatch();

  const {
    setLayoutModeToDefault,
    setLayoutModeToStack,
    setLayoutModeToTiles,
  } = useAppHeaderActions();

  const [showConfig, setShowConfig] = useState<boolean>(false);

  return (
    <View
      style={appHeaderStyles.container}
    >
      <Button
        variant="transparent"
        style={appHeaderStyles.button}
        accessibilityLabel={localization.get("header.accessibility.menu")}
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
            accessibilityLabel={localization.get("header.accessibility.back")}
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
        lineBreakMode="tail"
        numberOfLines={1}
        style={appHeaderStyles.title}
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
                setShowConfig(true);
              }}
            >
              <Icon
                name="layout"
              />
            </Button>
          </View>
        )
      }
      {
        showConfigButton
        && showConfig
        && (
          <PopupMenu
            backdrop={false}
            style={appHeaderStyles.configMenu}
            cancelTitle={localization.get("header.layoutMenu.close")}
            onCancel={(): void => {
              setShowConfig(false);
            }}
          >
            <PopupMenuItem
              icon="layout-default"
              text={localization.get("header.layoutMenu.default")}
              checked={layoutMode === LayoutMode.Default}
              onPress={(): void => {
                appDispatch(setLayoutModeToDefault());
                settings.set(SettingKey.LayoutMode, LayoutMode.Default);
              }}
            />
            <PopupMenuItem
              icon="layout-tiles"
              text={localization.get("header.layoutMenu.tiles")}
              checked={layoutMode === LayoutMode.Tiles}
              onPress={(): void => {
                appDispatch(setLayoutModeToTiles());
                settings.set(SettingKey.LayoutMode, LayoutMode.Tiles);
              }}
            />
            <PopupMenuItem
              icon="layout-stack"
              text={localization.get("header.layoutMenu.stack")}
              checked={layoutMode === LayoutMode.Stack}
              onPress={(): void => {
                appDispatch(setLayoutModeToStack());
                settings.set(SettingKey.LayoutMode, LayoutMode.Stack);
              }}
            />
          </PopupMenu>
        )
      }
    </View>
  );
}
