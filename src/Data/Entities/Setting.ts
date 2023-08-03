import { Column, Entity, PrimaryColumn } from "typeorm";
import { SettingKey } from "../Enums";

@Entity({ name: "Settings" })
export class Setting {

  @PrimaryColumn({
    name: "Key",
    type: "int",
    nullable: false,
    enum: SettingKey,
  })
  key!: SettingKey;

  @Column({
    name: "Value",
    nullable: true,
  })
  value?: string | null;

}
