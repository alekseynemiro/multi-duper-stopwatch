import { Validator } from "fluentvalidation-ts";
import { ActionModel } from "../Models";

export class ActionModelValidator extends Validator<ActionModel> {

  constructor() {
    super();

    this.ruleFor("name")
      .notEmpty()
      .withMessage("Action name is required.");
  }

}
