import React, { useCallback, useState } from "react";
import { Alert, NativeModules, View } from "react-native";
import { Button } from "@components/Button";
import { ContentLoadIndicator } from "@components/ContentLoadIndicator";
import { FormRow } from "@components/FormRow";
import { HorizontalLine } from "@components/HorizontalLine";
import { Label } from "@components/Label";
import {
  useLocalizationService,
  useSettingsService,
} from "@config";
import { SettingKey } from "@data";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
import { applicationSettingsPageStyles } from "./ApplicationSettingsPageStyles";

export function ApplicationSettingsPage(): JSX.Element {
  const localization = useLocalizationService();
  const settings = useSettingsService();

  const [language, setLanguage] = useState<string>("en");
  const [showLoadingIndicator, setShowLoadingIndicator] = useState<boolean>(true);

  const load = useCallback(
    async(): Promise<void> => {
      const lang = await settings.get(SettingKey.Language)
        ?? NativeModules.I18nManager.localeIdentifier.substring(0, 2);

      setLanguage(lang ?? "en");
      setShowLoadingIndicator(false);
    },
    [
      settings,
    ]
  );

  const save = useCallback(
    async(): Promise<void> => {
      await settings.set(
        SettingKey.Language,
        language
      );

      Alert.alert(
        localization.get("applicationSettings.warningTitle"),
        localization.get("applicationSettings.warningMessage"),
        [
          {
            text: localization.get("applicationSettings.ok"),
            style: "cancel",
          },
        ]
      );
    },
    [
      language,
      localization,
      settings,
    ]
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

  if (showLoadingIndicator) {
    return (
      <ContentLoadIndicator />
    );
  }

  return (
    <View
      style={applicationSettingsPageStyles.container}
    >
      <FormRow>
        <Label>
          {localization.get("applicationSettings.language")}
        </Label>
        <View
          style={applicationSettingsPageStyles.languagePickerContainer}
        >
          <Picker
            mode="dialog"
            selectedValue={language}
            onValueChange={(itemValue): void => {
              setLanguage(itemValue);
            }}
          >
            <Picker.Item label="English" value="en" />
            <Picker.Item label="Русский (Russian)" value="ru" />
          </Picker>
        </View>
      </FormRow>
      <HorizontalLine />
      <FormRow
        style={applicationSettingsPageStyles.footer}
      >
        <Button
          title={localization.get("applicationSettings.save")}
          style={applicationSettingsPageStyles.saveButton}
          onPress={save}
        />
      </FormRow>
    </View>
  );
}
