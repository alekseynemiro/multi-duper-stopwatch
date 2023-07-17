import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Goal } from "./Goal";
import { Session } from "./Session";

@Entity({ name: "SessionLogs" })
export class SessionLog {

  @PrimaryColumn({ name: "Id" })
  public id!: string;

  @Column({
    name: "ElapsedTime",
    nullable: false,
  })
  public elapsedTime!: number;

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
    name: "StartDate",
    nullable: false,
  })
  public startDate!: Date;

  @Column({
    name: "FinishDate",
    nullable: false,
  })
  public finishDate!: Date;

  @Column({
    name: "CreatedDate",
    nullable: false,
  })
  public createdDate!: Date;

  @OneToOne(() => Session, (x) => x.id)
  @JoinColumn({ name: "SessionId" })
  public session!: Session;

  @OneToOne(() => Goal, (x) => x.id)
  @JoinColumn({ name: "GoalId" })
  public goal!: Goal;

}
