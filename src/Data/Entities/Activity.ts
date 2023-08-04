import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { ColorPalette } from "../Enums";
import { ActivityInProject } from "./ActivityInProject";

@Entity({ name: "Activities" })
export class Activity {

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
    name: "PlayListPath",
    nullable: false,
  })
  public playListPath?: string | undefined;

  @Column({
    name: "IsGlobal",
    nullable: false,
  })
  public isGlobal!: boolean;

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

  @OneToMany(() => ActivityInProject, (x) => x.activity)
  public activitiesInProjects?: Array<ActivityInProject>;

}
