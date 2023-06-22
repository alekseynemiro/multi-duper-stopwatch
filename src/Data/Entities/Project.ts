import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { GoalInProject } from "./GoalInProject";

@Entity({ name: "Projects" })
export class Project {

  @PrimaryColumn({
    name: "Id",
  })
  public id!: string;

  @Column({
    name: "Name",
    nullable: false,
  })
  public name!: string;

  @Column({
    name: "CreatedDate",
    nullable: false,
  })
  public createdDate!: Date;

  @OneToMany(() => GoalInProject, x => x.project)
  public goalsInProjects?: Array<GoalInProject>;

}
