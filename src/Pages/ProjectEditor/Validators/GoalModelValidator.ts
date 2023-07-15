import { Validator } from "fluentvalidation-ts";
import {  GoalModel } from "../Models";

export class GoalModelValidator extends Validator< GoalModel> {

  constructor() {
    super();

    this.ruleFor("name")
      .notEmpty()
      .withMessage("Goal name is required.");
  }

}
