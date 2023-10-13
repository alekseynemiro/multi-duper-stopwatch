import React, { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { Button } from "@components/Button";
import { HorizontalLine } from "@components/HorizontalLine";
import { Icon } from "@components/Icon";
import { Label } from "@components/Label";
import { Modal } from "@components/Modal";
import { SelectColorModal } from "@components/SelectColorModal";
import { TextInputField } from "@components/TextInputField";
import { useLocalizationService } from "@config";
import { ColorPalette } from "@data";
import { getColorCode, isNotEmptyColor } from "@utils/ColorPaletteUtils";
import { Formik } from "formik";
import { ActivityEditModalProps } from "./ActivityEditModalProps";
import { activityEditModalStyles } from "./ActivityEditModalStyles";
import { ActivityEditModel } from "./ActivityEditModel";
import { ActivityEditModelValidator } from "./ActivityEditModelValidator";

export function ActivityEditModal(props: ActivityEditModalProps): JSX.Element {
  const localization = useLocalizationService();

  const {
    activity,
    onSave,
    onCancel,
  } = props;

  const validate = new ActivityEditModelValidator().validate;

  const [showSelectColor, setShowSelectColor] = useState<boolean>(false);

  const showSelectColorModal = useCallback(
    (): void => {
      setShowSelectColor(true);
    },
    []
  );

  const hideSelectColorModal = useCallback(
    (): void => {
      setShowSelectColor(false);
    },
    []
  );

  return (
    <Modal
      show={true}
    >
      <Formik<ActivityEditModel>
        initialValues={activity}
        enableReinitialize={true}
        validate={validate}
        onSubmit={(values: ActivityEditModel): void => {
          onSave({
            id: values.id,
            color: values.color,
            name: values.name,
          });
        }}
      >
        {
          ({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            errors,
            touched,
            values,
          }): JSX.Element => {
            return (
              <>
                <View
                  style={activityEditModalStyles.formRow}
                >
                  <View
                    style={activityEditModalStyles.activityNameContainer}
                  >
                    <Label>
                      {localization.get("activeProject.activityEditModal.activityName")}
                    </Label>
                    <TextInputField
                      value={values.name}
                      accessibilityHint={localization.get("activeProject.activityEditModal.accessibility.enterActivityName")}
                      error={touched.name && errors.name}
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                    />
                  </View>
                  <View
                    style={activityEditModalStyles.selectColorButtonContainer}
                  >
                    <Button
                      accessible={false}
                      accessibilityLabel={localization.get("activeProject.activityEditModal.accessibility.pressToSelectColor")}
                      style={[
                        activityEditModalStyles.selectColorButton,
                        {
                          backgroundColor: isNotEmptyColor(values.color)
                            ? getColorCode(values.color!)
                            : activityEditModalStyles.selectColorButton.backgroundColor,
                        },
                        touched.name && errors.name ? activityEditModalStyles.selectColorButtonError : undefined,
                      ]}
                      onPress={showSelectColorModal}
                    >
                      {
                        !values.color
                          ? (
                            <Icon
                              name="color"
                            />
                          )
                          : (
                            <Text />
                          )
                      }
                    </Button>
                  </View>
                </View>
                <HorizontalLine size="sm" />
                <View style={activityEditModalStyles.footer}>
                  <Button
                    variant="primary"
                    title={localization.get("activeProject.activityEditModal.save")}
                    style={activityEditModalStyles.buttonSave}
                    onPress={handleSubmit}
                  />
                  <Button
                    variant="secondary"
                    title={localization.get("activeProject.activityEditModal.cancel")}
                    style={activityEditModalStyles.buttonCancel}
                    onPress={onCancel}
                  />
                </View>
                {
                  showSelectColor
                  && (
                    <SelectColorModal
                      activityCode={undefined}
                      onSelect={(activityCode: string, color: ColorPalette): void => {
                        setFieldValue("color", color);
                        hideSelectColorModal();
                      }}
                      onClose={hideSelectColorModal}
                    />
                  )
                }
              </>
            );
          }
        }
      </Formik>
    </Modal>
  );
}
