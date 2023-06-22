import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { ColorPalette } from "../Enums";
import { GoalInProject } from "./GoalInProject";

@Entity({ name: "Goals" })
export class Goal {

  @PrimaryColumn({ name: "Id" })
  public id!: string;

  @Column({
    type: "int",
    nullable: false,
    enum: ColorPalette,
    name: "Color",
  })
  public color!: ColorPalette;

  @Column({
    name: "Name",
    nullable: false,
  })
  public name!: string;

  @Column({
    name: "IsGlobal",
    nullable: false,
  })
  public isGlobal!: boolean;

  @Column({
    name: "CreatedDate",
    nullable: false,
  })
  public createdDate!: Date;

  @OneToMany(() => GoalInProject, (x) => x.goal)
  public goalsInProjects?: Array<GoalInProject>;

}
