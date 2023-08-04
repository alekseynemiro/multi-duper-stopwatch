import React, { useCallback, useRef, useState } from "react";
import { View } from "react-native";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { Button } from "@components/Button";
import { ContentLoadIndicator } from "@components/ContentLoadIndicator";
import { FormRow } from "@components/FormRow";
import { HorizontalLine } from "@components/HorizontalLine";
import { Label } from "@components/Label";
import { TextInputField } from "@components/TextInputField";
import { Routes, ServiceIdentifier, serviceProvider } from "@config";
import { ColorPalette } from "@data";
import {
  CreateProjectRequest,
  CreateProjectRequestAction,
  GetResultAction,
  UpdateProjectRequest,
  UpdateProjectRequestAction,
} from "@dto/Projects";
import { useFocusEffect } from "@react-navigation/native";
import { IGuidService } from "@services/Guid";
import { IProjectService } from "@services/Projects";
import { useNavigation, useRoute } from "@utils/NavigationUtils";
import { Formik } from "formik";
import { Action, ActionChangeEventArgs, SelectColorModal } from "./Components";
import { ActionModel, ProjectModel } from "./Models";
import { projectEditorPageStyles } from "./ProjectEditorPageStyles";
import { ProjectModelValidator } from "./Validators";

const guidService = serviceProvider.get<IGuidService>(ServiceIdentifier.GuidService);
const projectService = serviceProvider.get<IProjectService>(ServiceIdentifier.ProjectService);

export function ProjectEditorPage(): JSX.Element {
  const navigation = useNavigation();
  const route = useRoute<Routes.Project>();

  const initialModel = useRef<ProjectModel>({
    name: "",
    actions: [],
  });

  const [showLoadingIndicator, setShowLoadingIndicator] = useState<boolean>(true);
  const [model, setModel] = useState<ProjectModel>(initialModel.current);
  const [showSelectColor, setShowSelectColor] = useState<boolean>(false);
  const [activeCode, setActiveCode] = useState<string | undefined>();

  const showSelectColorModal = (actionCode: string): void => {
    setShowSelectColor(true);
    setActiveCode(actionCode);
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
        return;
      }

      setShowLoadingIndicator(true);

      const data = await projectService.get(route.params.projectId);

      setModel({
        name: data.name,
        actions: data.actions?.map((x: GetResultAction): ActionModel => {
          return {
            id: x.id,
            code: x.id,
            color: x.color,
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
    ]
  );

  const save = async(values: ProjectModel): Promise<void> => {
    if (route?.params?.projectId) {
      const updateRequest: UpdateProjectRequest = {
        id: route.params.projectId,
        name: values.name as string,
        actions: (values.actions as Array<ActionModel>)
          .filter((x: ActionModel): boolean => {
            return !x.isDeleted;
          })
          .map((x: ActionModel): UpdateProjectRequestAction => {
            return {
              id: x.id as string,
              name: x.name,
              color: x.color,
              position: x.position,
            };
          }),
        actionsToDelete: (values.actions as Array<ActionModel>)
          .filter((x: ActionModel): boolean => {
            return x.isDeleted && !!x.id;
          })
          .map((x: ActionModel): string => {
            return x.id as string;
          }),
      };

      await projectService.update(updateRequest);
    } else {
      const createRequest: CreateProjectRequest = {
        id: guidService.newGuid(),
        name: values.name as string,
        actions: (values.actions as Array<ActionModel>)
          .filter((x: ActionModel): boolean => {
            return !x.isDeleted;
          })
          .map((x: ActionModel): CreateProjectRequestAction => {
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

  const findActionIndexByCode = (actions: Array<ActionModel> | undefined, code: string): number => {
    if (!actions) {
      throw new Error("Actions are expected.");
    }

    return actions.findIndex((x: ActionModel): boolean => {
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
                <FormRow>
                  <TextInputField
                    label="Project Name:"
                    value={values.name}
                    error={touched.name && errors.name}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                  />
                </FormRow>
                <FormRow style={projectEditorPageStyles.actions}>
                  <Label>
                    Actions:
                  </Label>
                  <View
                    style={projectEditorPageStyles.actionsTable}
                  >
                    <DraggableFlatList
                      scrollEnabled={true}
                      data={
                        values.actions
                          ?.filter((action: ActionModel): boolean => {
                            return !action.isDeleted;
                          }) ?? []
                      }
                      onDragEnd={({ data }): void => {
                        setFieldValue(
                          "actions",
                          [
                            ...data.map(
                              (x: ActionModel, index: number): ActionModel => {
                                return {
                                  ...x,
                                  // here we need to take into account the removed elements
                                  // but I don't think it's a significant problem
                                  position: index,
                                };
                              }
                            ),
                            ...values.actions
                            ?.filter((action: ActionModel): boolean => {
                              return action.isDeleted;
                            }) ?? [],
                          ]
                        );
                      }}
                      keyExtractor={(item: ActionModel): string => {
                        return item.code;
                      }}
                      renderItem={({ item: action, drag, getIndex }: RenderItemParams<ActionModel>) => {
                        const index = getIndex() as number;

                        return (
                          <Action
                            key={action.code}
                            actionCode={action.code}
                            actionId={action.id}
                            actionName={action.name}
                            actionColor={action.color}
                            error={touched.actions && (errors.actions?.[index] as unknown as ActionModel)?.name}
                            onSelectColorClick={(): void => {
                              showSelectColorModal(action.code);
                            }}
                            onChange={(e: ActionChangeEventArgs): void => {
                              const actionIndex = findActionIndexByCode(values?.actions, e.code);
                              setFieldValue(`actions[${actionIndex}].${e.fieldName}`, e.value);
                            }}
                            onDelete={(actionCode: string): void => {
                              const actionIndex = findActionIndexByCode(values?.actions, actionCode);
                              setFieldValue(`actions[${actionIndex}].isDeleted`, true);
                            }}
                            onDrag={drag}
                          />
                        );
                      }}
                    />
                  </View>
                  <View
                    style={projectEditorPageStyles.addActionButtonContainer}
                  >
                    <Button
                      title="Add action"
                      onPress={(): void => {
                        setFieldValue(
                          "actions",
                          [
                            ...values?.actions || [],
                            {
                              code: guidService.newGuid(),
                              name: "",
                              color: "",
                              position: values.actions?.length ?? 0,
                              isDeleted: false,
                            },
                          ]
                        );
                      }}
                    />
                  </View>
                </FormRow>
                <FormRow>
                  <HorizontalLine />
                  <View style={projectEditorPageStyles.buttons}>
                    <Button
                      variant="primary"
                      title="Save"
                      onPress={handleSubmit}
                    />
                    <Button
                      variant="secondary"
                      title="Cancel"
                      onPress={navigation.goBack}
                    />
                  </View>
                  <SelectColorModal
                    actionCode={activeCode}
                    show={showSelectColor}
                    onClose={hideSelectColorModal}
                    onSelect={(actionCode: string, color: ColorPalette): void => {
                      const actionIndex = findActionIndexByCode(values?.actions, actionCode);
                      setFieldValue(`actions[${actionIndex}].color`, color);
                      hideSelectColorModal();
                    }}
                  />
                </FormRow>
              </View>
            );
          }
        }
      </Formik>
    </View>
  );
}
