import React, { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
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
  CreateProjectRequestGoal,
  GetResultGoal,
  UpdateProjectRequest,
  UpdateProjectRequestGoal,
} from "@dto/Projects";
import { IGuidService } from "@services/Guid";
import { IProjectService } from "@services/Projects";
import { styles } from "@styles";
import { useNavigation, useRoute } from "@utils/NavigationUtils";
import { Formik } from "formik";
import { Goal, GoalChangeEventArgs, SelectColorModal } from "./Components";
import { GoalModel, ProjectModel } from "./Models";
import { ProjectEditorPageState } from "./ProjectEditorPageState";
import { projectEditorPageStyles } from "./ProjectEditorPageStyles";
import { ProjectModelValidator } from "./Validators";

const guidService = serviceProvider.get<IGuidService>(ServiceIdentifier.GuidService);
const projectService = serviceProvider.get<IProjectService>(ServiceIdentifier.ProjectService);

export function ProjectEditorPage(): JSX.Element {
  const navigation = useNavigation();
  const route = useRoute<Routes.Project>();

  const mounted = useRef(false);
  const loaded = useRef(false);

  const [showLoadingIndicator, setShowLoadingIndicator] = useState<ProjectEditorPageState["showLoadingIndicator"]>(true);
  const [model, setModel] = useState<ProjectEditorPageState["model"]>({
    name: "",
    goals: [],
  });
  const [showSelectColor, setShowSelectColor] = useState<ProjectEditorPageState["showSelectColor"]>(false);
  const [activeCode, setActiveCode] = useState<ProjectEditorPageState["activeCode"]>();

  const showSelectColorModal = (goalCode: string): void => {
    setShowSelectColor(true);
    setActiveCode(goalCode);
  };

  const hideSelectColorModal = (): void => {
    setShowSelectColor(false);
    setActiveCode(undefined);
  };

  const validate = new ProjectModelValidator().validate;

  const load = async(): Promise<void> => {
    if (!route?.params?.projectId) {
      loaded.current = true;
      setShowLoadingIndicator(false);
      return;
    }

    const data = await projectService.get(route.params.projectId);

    setModel({
      name: data.name,
      goals: data.goals?.map((x: GetResultGoal): GoalModel => {
        return {
          id: x.id,
          code: x.id,
          color: x.color,
          name: x.name,
          isDeleted: false,
        };
      }),
    });

    loaded.current = true;
    setShowLoadingIndicator(false);
  };

  const save = async(values: ProjectModel): Promise<void> => {
    if (route?.params?.projectId) {
      const updateRequest: UpdateProjectRequest = {
        id: route.params.projectId,
        name: values.name as string,
        goals: (values.goals as Array<GoalModel>)
          .filter((x: GoalModel): boolean => {
            return !x.isDeleted;
          })
          .map((x: GoalModel): UpdateProjectRequestGoal => {
            return {
              id: x.id as string,
              name: x.name,
              color: x.color,
              position: 0, // TODO: position
            };
          }),
        goalsToDelete: (values.goals as Array<GoalModel>)
        .filter((x: GoalModel): boolean => {
          return x.isDeleted && !!x.id;
        })
        .map((x: GoalModel): string => {
          return x.id as string;
        }),
      };

      await projectService.update(updateRequest);
    } else {
      const createRequest: CreateProjectRequest = {
        id: guidService.newGuid(),
        name: values.name as string,
        goals: (values.goals as Array<GoalModel>)
          .filter((x: GoalModel): boolean => {
            return !x.isDeleted;
          })
          .map((x: GoalModel): CreateProjectRequestGoal => {
            return {
              name: x.name,
              color: x.color,
              position: 0, // TODO: position
            };
          }),
      };

      await projectService.create(createRequest);
    }

    navigation.goBack();
  };

  const findGoalIndexByCode = (goals: Array<GoalModel> | undefined, code: string): number => {
    if (!goals) {
      throw new Error("Goals are expected.");
    }

    return goals.findIndex((x: GoalModel): boolean => {
      return x.code === code;
    });
  };

  if (!mounted.current && !loaded.current) {
    load();
  }

  useEffect(
    (): void => {
      mounted.current = true;
    },
    []
  );


  if (showLoadingIndicator) {
    return (
      <ContentLoadIndicator />
    );
  }

  return (
    <ScrollView style={styles.contentView}>
      <Formik<ProjectModel>
        initialValues={model}
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
              <View>
                <FormRow>
                  <TextInputField
                    label="Project Name:"
                    value={values.name}
                    error={touched.name && errors.name}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                  />
                </FormRow>
                <FormRow>
                  <Label>
                    Goals:
                  </Label>
                  <View
                    style={[
                      styles.table,
                    ]}
                  >
                    {
                      values.goals
                        ?.filter((goal: GoalModel): boolean => {
                          return !goal.isDeleted;
                        })
                        .map((goal: GoalModel, index: number): JSX.Element => {
                          return (
                            <Goal
                              key={goal.code}
                              goalCode={goal.code}
                              goalId={goal?.id}
                              goalName={goal.name}
                              goalColor={goal.color}
                              error={touched.goals && (errors.goals?.[index] as unknown as GoalModel)?.name}
                              onSelectColorClick={(): void => {
                                showSelectColorModal(goal.code);
                              }}
                              onChange={(e: GoalChangeEventArgs): void => {
                                const goalIndex = findGoalIndexByCode(values?.goals, e.code);
                                setFieldValue(`goals[${goalIndex}].${e.fieldName}`, e.value);
                              }}
                              onDelete={(goalCode: string): void => {
                                const goalIndex = findGoalIndexByCode(values?.goals, goalCode);
                                setFieldValue(`goals[${goalIndex}].isDeleted`, true);
                              }}
                            />
                          );
                        })
                    }
                  </View>
                  <Button
                    title="Add goal"
                    onPress={(): void => {
                      setFieldValue(
                        "goals",
                        [
                          ...values?.goals || [],
                          {
                            code: guidService.newGuid(),
                            name: "",
                            color: "",
                            isDeleted: false,
                          },
                        ]
                      );
                    }}
                  />
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
                    goalCode={activeCode}
                    show={showSelectColor}
                    onClose={hideSelectColorModal}
                    onSelect={(goalCode: string, color: ColorPalette): void => {
                      const goalIndex = findGoalIndexByCode(values?.goals, goalCode);
                      setFieldValue(`goals[${goalIndex}].color`, color);
                      hideSelectColorModal();
                    }}
                  />
                </FormRow>
              </View>
            );
          }
        }
      </Formik>
    </ScrollView>
  );
}
