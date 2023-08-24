import React, { useCallback, useEffect, useRef, useState } from "react";
import { Keyboard, useWindowDimensions, View } from "react-native";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { Button } from "@components/Button";
import { ContentLoadIndicator } from "@components/ContentLoadIndicator";
import { FormRow } from "@components/FormRow";
import { HorizontalLine } from "@components/HorizontalLine";
import { Label } from "@components/Label";
import { SelectColorModal } from "@components/SelectColorModal";
import { TextInputField } from "@components/TextInputField";
import {
  Routes,
  useGuidService,
  useLocalizationService,
  useProjectService,
} from "@config";
import { ColorPalette } from "@data";
import {
  CreateProjectRequest,
  CreateProjectRequestActivity,
  GetResultActivity,
  UpdateProjectRequest,
  UpdateProjectRequestActivity,
} from "@dto/Projects";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation, useRoute } from "@utils/NavigationUtils";
import { Formik } from "formik";
import {
  Activity,
  ActivityChangeEventArgs,
  ActivityNameModal,
  ActivityNameModalEventArgs,
} from "./Components";
import { ActivityModel, ProjectModel } from "./Models";
import { projectEditorPageStyles } from "./ProjectEditorPageStyles";
import { ProjectModelValidator } from "./Validators";

export function ProjectEditorPage(): JSX.Element {
  const navigation = useNavigation();
  const route = useRoute<Routes.Project>();
  const localization = useLocalizationService();
  const guidService = useGuidService();
  const projectService = useProjectService();

  const { width, height } = useWindowDimensions();

  const isLandscape = width > height;

  const initialModel = useRef<ProjectModel>({
    name: "",
    activities: [],
  });

  const [showLoadingIndicator, setShowLoadingIndicator] = useState<boolean>(true);
  const [model, setModel] = useState<ProjectModel>(initialModel.current);
  const [showSelectColor, setShowSelectColor] = useState<boolean>(false);
  const [activeCode, setActiveCode] = useState<string | undefined>();
  const [showActivityNameModal, setShowActivityNameModal] = React.useState<{ activityCode: string, activityName: string } | undefined>(undefined);
  const [keyboardIsOpen, setKeyboardIsOpen] = React.useState(false);

  const showSelectColorModal = (activityCode: string): void => {
    setShowSelectColor(true);
    setActiveCode(activityCode);
  };

  const hideSelectColorModal = (): void => {
    setShowSelectColor(false);
    setActiveCode(undefined);
  };

  const validate = new ProjectModelValidator().validate;

  const load = useCallback(
    async(): Promise<void> => {
      if (!route.params?.projectId) {
        setModel(initialModel.current);
        setShowLoadingIndicator(false);

        navigation.setOptions({
          title: localization.get("projectEditor.createProject"),
        });

        return;
      }

      navigation.setOptions({
        title: localization.get("projectEditor.editProject"),
      });

      setShowLoadingIndicator(true);

      const data = await projectService.get(route.params.projectId);

      setModel({
        name: data.name,
        activities: data.activities?.map((x: GetResultActivity): ActivityModel => {
          return {
            id: x.id,
            code: x.id,
            color: x.color ?? null,
            name: x.name,
            position: x.position,
            isDeleted: false,
          };
        }),
      });

      setShowLoadingIndicator(false);
    },
    [
      route,
      initialModel,
      localization,
      navigation,
      projectService,
    ]
  );

  const save = async(values: ProjectModel): Promise<void> => {
    if (route?.params?.projectId) {
      const updateRequest: UpdateProjectRequest = {
        id: route.params.projectId,
        name: values.name as string,
        activities: (values.activities as Array<ActivityModel>)
          .filter((x: ActivityModel): boolean => {
            return !x.isDeleted;
          })
          .map((x: ActivityModel): UpdateProjectRequestActivity => {
            return {
              id: x.id as string,
              name: x.name,
              color: x.color,
              position: x.position,
            };
          }),
        activitiesToDelete: (values.activities as Array<ActivityModel>)
          .filter((x: ActivityModel): boolean => {
            return x.isDeleted && !!x.id;
          })
          .map((x: ActivityModel): string => {
            return x.id as string;
          }),
      };

      await projectService.update(updateRequest);
    } else {
      const createRequest: CreateProjectRequest = {
        id: guidService.newGuid(),
        name: values.name as string,
        activities: (values.activities as Array<ActivityModel>)
          .filter((x: ActivityModel): boolean => {
            return !x.isDeleted;
          })
          .map((x: ActivityModel): CreateProjectRequestActivity => {
            return {
              name: x.name,
              color: x.color,
              position: x.position,
            };
          }),
      };

      await projectService.create(createRequest);
    }

    navigation.goBack();
  };

  const findActivityIndexByCode = (activities: Array<ActivityModel> | undefined, code: string): number => {
    if (!activities) {
      throw new Error("Activities are expected.");
    }

    return activities.findIndex((x: ActivityModel): boolean => {
      return x.code === code;
    });
  };

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

  useEffect(
    (): { (): void } => {
      const keyboardDidShowSubscription = Keyboard.addListener(
        "keyboardDidShow",
        (): void => {
          setKeyboardIsOpen(true);
        }
      );

      const keyboardDidHideSubscription = Keyboard.addListener(
        "keyboardDidHide",
        (): void => {
          setKeyboardIsOpen(false);
        }
      );


      return (): void => {
        keyboardDidShowSubscription.remove();
        keyboardDidHideSubscription.remove();
      };
    },
    []
  );

  if (showLoadingIndicator) {
    return (
      <ContentLoadIndicator />
    );
  }

  return (
    <View
      style={projectEditorPageStyles.container}
    >
      <Formik<ProjectModel>
        initialValues={model}
        enableReinitialize={true}
        validate={validate}
        onSubmit={save}
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
              <View style={projectEditorPageStyles.form}>
                <FormRow style={projectEditorPageStyles.projectName}>
                  <TextInputField
                    label={localization.get("projectEditor.projectName")}
                    accessibilityHint={localization.get("projectEditor.accessibility.enterProjectName")}
                    value={values.name}
                    error={touched.name && errors.name}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                  />
                </FormRow>
                <FormRow style={projectEditorPageStyles.activities}>
                  <Label>
                    {localization.get("projectEditor.activities")}
                  </Label>
                  {
                    typeof errors.activities === "string"
                    && touched.activities
                    && (
                      <Label
                        variant="danger"
                      >
                        {errors.activities}
                      </Label>
                    )
                  }
                  <View
                    style={projectEditorPageStyles.activitiesTable}
                  >
                    <DraggableFlatList
                      scrollEnabled={true}
                      keyboardDismissMode="on-drag"
                      bounces={false}
                      data={
                        values.activities
                          ?.filter((activity: ActivityModel): boolean => {
                            return !activity.isDeleted;
                          }) ?? []
                      }
                      onDragEnd={({ data }): void => {
                        setFieldValue(
                          "activities",
                          [
                            ...data.map(
                              (x: ActivityModel, index: number): ActivityModel => {
                                return {
                                  ...x,
                                  // here we need to take into account the removed elements
                                  // but I don't think it's a significant problem
                                  position: index,
                                };
                              }
                            ),
                            ...values.activities
                            ?.filter((activity: ActivityModel): boolean => {
                              return activity.isDeleted;
                            }) ?? [],
                          ]
                        );
                      }}
                      keyExtractor={(item: ActivityModel): string => {
                        return item.code;
                      }}
                      renderItem={({ item: activity, drag, getIndex }: RenderItemParams<ActivityModel>) => {
                        const index = getIndex() as number;

                        return (
                          <Activity
                            key={activity.code}
                            activityCode={activity.code}
                            activityId={activity.id}
                            activityName={activity.name}
                            activityColor={activity.color}
                            error={touched.activities && (errors.activities?.[index] as unknown as ActivityModel)?.name}
                            onSelectColorClick={(): void => {
                              showSelectColorModal(activity.code);
                            }}
                            onChange={(e: ActivityChangeEventArgs): void => {
                              const activityIndex = findActivityIndexByCode(values?.activities, e.code);
                              setFieldValue(`activities[${activityIndex}].${e.fieldName}`, e.value);
                            }}
                            onDelete={(activityCode: string): void => {
                              const activityIndex = findActivityIndexByCode(values?.activities, activityCode);
                              setFieldValue(`activities[${activityIndex}].isDeleted`, true);
                            }}
                            onInputNamePressIn={(): void => {
                              if (isLandscape) {
                                setShowActivityNameModal({
                                  activityCode: activity.code,
                                  activityName: activity.name,
                                });
                              }
                            }}
                            onDrag={drag}
                          />
                        );
                      }}
                    />
                  </View>
                  {
                    (
                      !isLandscape
                      || (isLandscape && !keyboardIsOpen)
                    )
                    && (
                      <View
                        style={projectEditorPageStyles.addActivityButtonContainer}
                      >
                        <Button
                          title={localization.get("projectEditor.addActivity")}
                          onPress={(): void => {
                            setFieldValue(
                              "activities",
                              [
                                ...values?.activities || [],
                                {
                                  code: guidService.newGuid(),
                                  name: "",
                                  color: "",
                                  position: values.activities?.length ?? 0,
                                  isDeleted: false,
                                },
                              ]
                            );
                          }}
                        />
                      </View>
                    )
                  }
                </FormRow>
                {
                  (
                    !isLandscape
                    || (isLandscape && !keyboardIsOpen)
                  )
                  && (
                    <FormRow style={projectEditorPageStyles.footer}>
                      <HorizontalLine />
                      <View style={projectEditorPageStyles.footerButtons}>
                        <Button
                          variant="primary"
                          title={localization.get("projectEditor.save")}
                          style={projectEditorPageStyles.footerButton}
                          onPress={handleSubmit}
                        />
                        <Button
                          variant="secondary"
                          title={localization.get("projectEditor.cancel")}
                          onPress={navigation.goBack}
                        />
                      </View>
                    </FormRow>
                  )
                }
                {
                  showSelectColor
                  && (
                    <SelectColorModal
                      activityCode={activeCode}
                      onClose={hideSelectColorModal}
                      onSelect={(activityCode: string, color: ColorPalette): void => {
                        const activityIndex = findActivityIndexByCode(values?.activities, activityCode);

                        setFieldValue(`activities[${activityIndex}].color`, color);
                        hideSelectColorModal();
                      }}
                    />
                  )
                }
                {
                  !!showActivityNameModal
                  && (
                    <ActivityNameModal
                      activityCode={showActivityNameModal?.activityCode}
                      activityName={showActivityNameModal?.activityName}
                      onSet={(e: ActivityNameModalEventArgs): void => {
                        const activityIndex = findActivityIndexByCode(values?.activities, e.activityCode);

                        setFieldValue(`activities[${activityIndex}].name`, e.activityName);
                        setShowActivityNameModal(undefined);
                      }}
                      onCancel={(): void => {
                        setShowActivityNameModal(undefined);
                      }}
                    />
                  )
                }
              </View>
            );
          }
        }
      </Formik>
    </View>
  );
}
