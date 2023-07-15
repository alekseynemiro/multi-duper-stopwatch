import { Validator } from "fluentvalidation-ts";
import { ProjectModel } from "../Models";
import { GoalModelValidator } from "./GoalModelValidator";

export class ProjectModelValidator extends Validator<ProjectModel> {

  constructor() {
    super();

    this.ruleFor("name")
      .notEmpty()
      .withMessage("Project name is required.");

    this.ruleFor("goals")
      .notNull()
      .withMessage("At least one goal is required.");

    this.ruleForEach("goals")
      .setValidator(() => new GoalModelValidator());
  }

}
