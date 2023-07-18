import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { SessionState } from "../Enums";
import { Goal } from "./Goal";
import { Project } from "./Project";

@Entity({ name: "Sessions" })
export class Session {

  @PrimaryColumn({ name: "Id" })
  public id!: string;

  @Column({
    name: "State",
    type: "int",
    nullable: false,
    enum: SessionState,
  })
  public state!: SessionState;

  @Column({
    name: "StartDate",
    nullable: true,
  })
  public startDate!: Date;

  @Column({
    name: "FinishDate",
    nullable: true,
  })
  finishDate?: Date;

  @Column({
    name: "GoalStartDate",
    nullable: false,
  })
  goalStartDate!: Date;

  @Column({
    name: "GoalFinishDate",
    nullable: true,
  })
  goalFinishDate?: Date;

  @Column({
    name: "CreatedDate",
    nullable: false,
  })
  createdDate!: Date;

  @OneToOne(() => Project, x => x.id)
  @JoinColumn({ name: "ProjectId" })
  public project!: Project;

  @OneToOne(() => Goal, x => x.id)
  @JoinColumn({ name: "GoalId" })
  public goal!: Goal;

}
