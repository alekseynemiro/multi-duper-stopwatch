import { Validator } from "fluentvalidation-ts";
import { ProjectModel } from "../Models";
import { ActionModelValidator } from "./ActionModelValidator";

export class ProjectModelValidator extends Validator<ProjectModel> {

  constructor() {
    super();

    this.ruleFor("name")
      .notEmpty()
      .withMessage("Project name is required.");

    this.ruleFor("actions")
      .notNull()
      .withMessage("At least one action is required.");

    this.ruleForEach("actions")
      .setValidator(() => new ActionModelValidator());
  }

}
