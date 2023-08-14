import { useLocalizationService } from "@config";
import { Validator } from "fluentvalidation-ts";
import { ActivityModel } from "../Models";

export class ActivityModelValidator extends Validator<ActivityModel> {

  constructor() {
    super();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const localization = useLocalizationService();

    this.ruleFor("name")
      .notEmpty()
      .withMessage(localization.get("projectEditor.validation.activityNameIsRequired"))
      .when((x: ActivityModel): boolean => {
        return !x.isDeleted;
      });
  }

}
