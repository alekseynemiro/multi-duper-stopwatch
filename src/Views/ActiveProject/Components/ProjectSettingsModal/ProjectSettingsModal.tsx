import React, { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { Button } from "@components/Button";
import { HorizontalLine } from "@components/HorizontalLine";
import { Icon } from "@components/Icon";
import { Label } from "@components/Label";
import { Modal } from "@components/Modal";
import { Radio } from "@components/Radio";
import {
  AppState,
  useAppDispatch,
  useAppHeaderActions,
  useLocalizationService,
  useSettingsService,
} from "@config";
import { LayoutMode, SettingKey } from "@data";
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { projectSettingsModalStyles } from "./ProjectSettingsModalStyles";

export function ProjectSettingsModal(): JSX.Element {
  const localization = useLocalizationService();
  const settings = useSettingsService();
  const layoutMode = useSelector((x: AppState): LayoutMode => x.header.layoutMode);
  const appDispatch = useAppDispatch();

  const [initialLayoutMode] = useState(layoutMode);

  const {
    setLayoutModeToDefault,
    setLayoutModeToStack,
    setLayoutModeToTiles,
    hideConfigModal,
  } = useAppHeaderActions();

  const handleSave = useCallback(
    (): void => {
      settings.set(SettingKey.LayoutMode, layoutMode);
      appDispatch(hideConfigModal());
    },
    [
      settings,
      layoutMode,
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
      <View>
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
