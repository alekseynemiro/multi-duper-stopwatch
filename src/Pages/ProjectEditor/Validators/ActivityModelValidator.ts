import { useLocalization } from "@utils/LocalizationUtils";
import { Validator } from "fluentvalidation-ts";
import { ActivityModel } from "../Models";

export class ActivityModelValidator extends Validator<ActivityModel> {

  constructor() {
    super();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const localization = useLocalization();

    this.ruleFor("name")
      .notEmpty()
      .withMessage(localization.get("projectEditor.validation.activityNameIsRequired"))
      .when((x: ActivityModel): boolean => {
        return !x.isDeleted;
      });
  }

}
