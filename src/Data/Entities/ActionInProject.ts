import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Action } from "./Action";
import { Project } from "./Project";

@Entity({ name: "ActionsInProjects" })
export class ActionInProject {

  @PrimaryColumn({
    name: "Id",
    type: "text",
    nullable: false,
  })
  public id!: string;

  @Column({
    name: "ActionId",
    nullable: false,
  })
  public actionId!: string;

  @Column({
    name: "ProjectId",
    nullable: false,
  })
  public projectId!: string;

  @ManyToOne(
    () => Action,
    x => x.actionsInProjects,
    {
      eager: true,
    }
  )
  public action!: Action;

  @ManyToOne(
    () => Project,
    x => x.actionsInProjects,
    {
      eager: true,
    }
  )
  public project!: Project;

  @Column({
    name: "Position",
    nullable: false,
  })
  public position!: number;

}
