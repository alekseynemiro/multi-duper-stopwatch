import { useLocalizationService } from "@config";
import { Validator } from "fluentvalidation-ts";
import { ActivityModel, ProjectModel } from "../Models";
import { ActivityModelValidator } from "./ActivityModelValidator";

export class ProjectModelValidator extends Validator<ProjectModel> {

  constructor() {
    super();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const localization = useLocalizationService();

    this.ruleFor("name")
      .notEmpty()
      .withMessage(localization.get("projectEditor.validation.projectNameIsRequired"));

    this.ruleFor("activities")
      .must(
        (x: Array<ActivityModel> | undefined): boolean => {
          return !!x
            && x.length > 0
            && x.filter(
              (xx: ActivityModel): boolean => {
                return !xx.isDeleted;
              }
            ).length > 0;
        }
      )
      .withMessage(localization.get("projectEditor.validation.activitiesIsRequired"));

    this.ruleForEach("activities")
      .setValidator(() => new ActivityModelValidator());
  }

}
