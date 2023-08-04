import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { SessionState } from "../Enums";
import { Activity } from "./Activity";
import { Project } from "./Project";

@Entity({ name: "Sessions" })
export class Session {

  @PrimaryColumn({ name: "Id" })
  public id!: string;

  @Column({
    name: "Name",
    nullable: true,
  })
  public name?: string | null;

  @Column({
    name: "State",
    type: "int",
    nullable: false,
    enum: SessionState,
  })
  public state!: SessionState;

  @Column({
    name: "ElapsedTime",
    nullable: false,
  })
  public elapsedTime!: number;

  @Column({
    name: "Steps",
    nullable: false,
  })
  public steps!: number;

  @Column({
    name: "Distance",
    nullable: false,
  })
  public distance!: number;

  @Column({
    name: "AvgSpeed",
    nullable: false,
  })
  public avgSpeed!: number;

  @Column({
    name: "MaxSpeed",
    nullable: false,
  })
  public maxSpeed!: number;

  @Column({
    name: "Events",
    nullable: false,
  })
  public events!: number;

  @Column({
    name: "StartDate",
    nullable: true,
  })
  public startDate!: Date;

  @Column({
    name: "FinishDate",
    nullable: true,
  })
  finishDate?: Date | null;

  @Column({
    name: "ActivityStartDate",
    nullable: false,
  })
  activityStartDate!: Date;

  @Column({
    name: "ActivityFinishDate",
    nullable: true,
  })
  activityFinishDate?: Date | null;

  @Column({
    name: "CreatedDate",
    nullable: false,
  })
  createdDate!: Date;

  @OneToOne(() => Project, x => x.id)
  @JoinColumn({ name: "ProjectId" })
  public project!: Project;

  @OneToOne(() => Activity, x => x.id)
  @JoinColumn({ name: "ActivityId" })
  public activity!: Activity;

}
