import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { ColorPalette } from "../Enums";
import { ActionInProject } from "./ActionInProject";

@Entity({ name: "Actions" })
export class Action {

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

  @OneToMany(() => ActionInProject, (x) => x.action)
  public actionsInProjects?: Array<ActionInProject>;

}
