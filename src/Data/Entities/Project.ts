import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { ActionInProject } from "./ActionInProject";

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
    name: "IsDeleted",
    nullable: false,
  })
  public isDeleted!: boolean;

  @Column({
    name: "CreatedDate",
    nullable: false,
  })
  public createdDate!: Date;

  @OneToMany(() => ActionInProject, x => x.project)
  public actionsInProjects?: Array<ActionInProject>;

}
