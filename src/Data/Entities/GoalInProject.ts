import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Goal } from "./Goal";
import { Project } from "./Project";

@Entity({ name: "GoalsInProjects" })
export class GoalInProject {

  @PrimaryColumn({
    name: "Id",
    type: "text",
    nullable: false,
  })
  public id!: string;

  @Column({
    name: "GoalId",
    nullable: false,
  })
  public goalId!: string;

  @Column({
    name: "ProjectId",
    nullable: false,
  })
  public projectId!: string;

  @ManyToOne(
    () => Goal,
    x => x.goalsInProjects,
    {
      eager: true,
    }
  )
  public goal!: Goal;

  @ManyToOne(
    () => Project,
    x => x.goalsInProjects,
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
