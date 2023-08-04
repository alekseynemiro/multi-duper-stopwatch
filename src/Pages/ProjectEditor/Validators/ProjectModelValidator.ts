import { useLocalization } from "@utils/LocalizationUtils";
import { Validator } from "fluentvalidation-ts";
import { ProjectModel } from "../Models";
import { ActionModelValidator } from "./ActionModelValidator";

export class ProjectModelValidator extends Validator<ProjectModel> {

  constructor() {
    super();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const localization = useLocalization();

    this.ruleFor("name")
      .notEmpty()
      .withMessage(localization.get("projectEditor.validation.projectNameIsRequired"));

    this.ruleFor("actions")
      .notNull()
      .withMessage(localization.get("projectEditor.validation.actionsIsRequired"));

    this.ruleForEach("actions")
      .setValidator(() => new ActionModelValidator());
  }

}
