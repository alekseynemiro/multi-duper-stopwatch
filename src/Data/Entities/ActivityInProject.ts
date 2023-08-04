import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Activity } from "./Activity";
import { Project } from "./Project";

@Entity({ name: "ActivitiesInProjects" })
export class ActivityInProject {

  @PrimaryColumn({
    name: "Id",
    type: "text",
    nullable: false,
  })
  public id!: string;

  @Column({
    name: "ActivityId",
    nullable: false,
  })
  public activityId!: string;

  @Column({
    name: "ProjectId",
    nullable: false,
  })
  public projectId!: string;

  @ManyToOne(
    () => Activity,
    x => x.activitiesInProjects,
    {
      eager: true,
    }
  )
  public activity!: Activity;

  @ManyToOne(
    () => Project,
    x => x.activitiesInProjects,
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

  @Column({
    name: "PlayListPath",
    nullable: false,
  })
  public playListPath?: string | undefined;

}
