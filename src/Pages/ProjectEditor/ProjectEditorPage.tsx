import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button } from "@components/Button";
import { FormRow } from "@components/FormRow";
import { HorizontalLine } from "@components/HorizontalLine";
import { Label } from "@components/Label";
import { TextInputField } from "@components/TextInputField";
import { ServiceIdentifier, serviceProvider } from "@config";
import { ColorPalette } from "@data";
import { CreateProjectRequest, CreateProjectRequestGoal } from "@dto/Projects";
import { IGuidService } from "@services/Guid";
import { IProjectService } from "@services/Projects";
import { styles } from "@styles";
import { Formik } from "formik";
import { Goal, GoalChangeEventArgs, SelectColorModal } from "./Components";
import { GoalModel, ProjectModel } from "./Models";
import { ProjectEditorPageProps } from "./ProjectEditorPageProps";
import { ProjectEditorPageState } from "./ProjectEditorPageState";
import { projectEditorPageStyles } from "./ProjectEditorPageStyles";
import { ProjectModelValidator } from "./Validators";

const guidService = serviceProvider.get<IGuidService>(ServiceIdentifier.GuidService);
const projectService = serviceProvider.get<IProjectService>(ServiceIdentifier.ProjectService);

export function ProjectEditorPage({ navigation }: ProjectEditorPageProps): JSX.Element {
  const [model] = useState<ProjectEditorPageState["model"]>({
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

  const save = async(values: ProjectModel): Promise<void> => {
    const createRequest: CreateProjectRequest = {
      id: guidService.newGuid(),
      name: values.name as string,
      goals: (values.goals as Array<GoalModel>)
        .map((x: GoalModel): CreateProjectRequestGoal => {
          return {
            name: x.name,
            color: x.color,
            position: 0, // TODO: position
          };
        }),
    };

    await projectService.create(createRequest);

    navigation.goBack();
  };

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
                      values.goals?.map((goal: GoalModel, index: number): JSX.Element => {
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
                              setFieldValue(`goals[${index}].${e.fieldName}`, e.value);
                            }}
                            onDelete={(code: string): void => {
                              const goals = values.goals?.filter(
                                (currentValue: GoalModel): boolean => {
                                  return currentValue.code !== code;
                                }
                              );

                              setFieldValue("goals", goals);
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
                      const index = values.goals?.findIndex((x: GoalModel): boolean => {
                        return x.code === goalCode;
                      });

                      setFieldValue(`goals[${index}].color`, color);
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
