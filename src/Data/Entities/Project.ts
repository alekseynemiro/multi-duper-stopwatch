import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { ActivityInProject } from "./ActivityInProject";

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

  @OneToMany(() => ActivityInProject, x => x.project)
  public activitiesInProjects?: Array<ActivityInProject>;

}
