import { useLocalizationService } from "@config";
import { Validator } from "fluentvalidation-ts";
import { ActivityEditModel } from "./ActivityEditModel";

export class ActivityEditModelValidator extends Validator<ActivityEditModel> {

  constructor() {
    super();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const localization = useLocalizationService();

    this.ruleFor("name")
      .notEmpty()
      .withMessage(localization.get("activeProject.activityEditModal.validation.activityNameIsRequired"));
  }

}
