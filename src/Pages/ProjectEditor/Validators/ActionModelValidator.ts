import { useLocalization } from "@utils/LocalizationUtils";
import { Validator } from "fluentvalidation-ts";
import { ActionModel } from "../Models";

export class ActionModelValidator extends Validator<ActionModel> {

  constructor() {
    super();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const localization = useLocalization();

    this.ruleFor("name")
      .notEmpty()
      .withMessage(localization.get("projectEditor.validation.actionNameIsRequired"));
  }

}
