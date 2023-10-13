import React, { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { Button } from "@components/Button";
import { CheckBox } from "@components/CheckBox";
import { HorizontalLine } from "@components/HorizontalLine";
import { Icon } from "@components/Icon";
import { Label } from "@components/Label";
import { Modal } from "@components/Modal";
import { Radio } from "@components/Radio";
import {
  AppState,
  useAppActions,
  useAppDispatch,
  useLocalizationService,
  useSettingsService,
} from "@config";
import { LayoutMode, SettingKey } from "@data";
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { projectSettingsModalStyles } from "./ProjectSettingsModalStyles";

export function ProjectSettingsModal(): JSX.Element {
  const localization = useLocalizationService();
  const settings = useSettingsService();
  const layoutMode = useSelector((x: AppState): LayoutMode => x.common.layoutMode);
  const colorized = useSelector((x: AppState): boolean => x.common.colorized);
  const appDispatch = useAppDispatch();

  const [initialLayoutMode] = useState(layoutMode);
  const [newColorized, setNewColorized] = useState(colorized);

  const {
    setLayoutModeToDefault,
    setLayoutModeToStack,
    setLayoutModeToTiles,
    enableColorizedMode,
    disableColorizedMode,
    hideConfigModal,
  } = useAppActions();

  const handleSave = useCallback(
    async(): Promise<void> => {
      await Promise.all([
        settings.set(SettingKey.LayoutMode, layoutMode),
        settings.set(SettingKey.Colorized, newColorized ? "1" : "0"),
      ]);

      if (newColorized) {
        appDispatch(enableColorizedMode());
      } else {
        appDispatch(disableColorizedMode());
      }

      appDispatch(hideConfigModal());
    },
    [
      settings,
      layoutMode,
      newColorized,
      enableColorizedMode,
      disableColorizedMode,
      hideConfigModal,
      appDispatch,
    ]
  );

  const setLayoutMode = useCallback(
    (value: LayoutMode): void => {
      switch (value) {
        case LayoutMode.Default: {
          appDispatch(setLayoutModeToDefault());
          break;
        }

        case LayoutMode.Tiles: {
          appDispatch(setLayoutModeToTiles());
          break;
        }

        case LayoutMode.Stack: {
          appDispatch(setLayoutModeToStack());
          break;
        }

        default:
          throw new Error(`Layout mode ${LayoutMode[value]} is not supported.`);
      }
    },
    [
      appDispatch,
      setLayoutModeToDefault,
      setLayoutModeToTiles,
      setLayoutModeToStack,
    ]
  );

  const handleCancel = useCallback(
    (): void => {
      setLayoutMode(initialLayoutMode);
      appDispatch(hideConfigModal());
    },
    [
      initialLayoutMode,
      hideConfigModal,
      appDispatch,
      setLayoutMode,
    ]
  );

  const makeSetLayoutModeHandler = useCallback(
    (action: ActionCreatorWithoutPayload<any>): { (): void } => {
      return (): void => {
        appDispatch(action());
      };
    },
    [
      appDispatch,
    ]
  );

  return (
    <Modal
      show={true}
    >
      <View style={projectSettingsModalStyles.group}>
        <Label bold>
          {localization.get("activeProject.projectSettingsModal.layout.title")}
        </Label>
        <TouchableOpacity
          style={projectSettingsModalStyles.formRow}
          onPress={makeSetLayoutModeHandler(setLayoutModeToDefault)}
        >
          <Radio
            checked={layoutMode === LayoutMode.Default}
          />
          <Icon
            name="layout-default"
          />
          <Text>
            {localization.get("activeProject.projectSettingsModal.layout.default")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={projectSettingsModalStyles.formRow}
          onPress={makeSetLayoutModeHandler(setLayoutModeToTiles)}
        >
          <Radio
            checked={layoutMode === LayoutMode.Tiles}
          />
          <Icon
            name="layout-tiles"
          />
          <Text>
            {localization.get("activeProject.projectSettingsModal.layout.tiles")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={projectSettingsModalStyles.formRow}
          onPress={makeSetLayoutModeHandler(setLayoutModeToStack)}
        >
          <Radio
            checked={layoutMode === LayoutMode.Stack}
          />
          <Icon
            name="layout-stack"
          />
          <Text>
            {localization.get("activeProject.projectSettingsModal.layout.stack")}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={projectSettingsModalStyles.lastGroup}>
        <Label bold>
          {localization.get("activeProject.projectSettingsModal.style.title")}
        </Label>
        <TouchableOpacity
          style={projectSettingsModalStyles.formRow}
          onPress={(): void => {
            setNewColorized(!newColorized);
          }}
        >
          <CheckBox
            value={newColorized}
            onValueChange={(value: boolean): void => {
              setNewColorized(value);
            }}
          />
          <Label>
            {localization.get("activeProject.projectSettingsModal.style.colorized")}
          </Label>
        </TouchableOpacity>
      </View>
      <HorizontalLine size="sm" />
      <View style={projectSettingsModalStyles.footer}>
        <Button
          variant="primary"
          title={localization.get("activeProject.projectSettingsModal.save")}
          style={projectSettingsModalStyles.buttonSave}
          onPress={handleSave}
        />
        <Button
          variant="secondary"
          title={localization.get("activeProject.projectSettingsModal.cancel")}
          style={projectSettingsModalStyles.buttonCancel}
          onPress={handleCancel}
        />
      </View>
    </Modal>
  );
}
