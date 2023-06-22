import { Column, Entity, PrimaryColumn } from "typeorm";
import { InfoKey } from "../Enums";

@Entity({ name: "Infos" })
export class Info {

  @PrimaryColumn({
    name: "Key",
    type: "int",
    nullable: false,
    enum: InfoKey,
  })
  public key!: InfoKey;

  @Column({
    name: "Value",
    type: "blob",
    nullable: true,
  })
  value?: ArrayBuffer;

  /**
   * Indicates that the value must not be changed after initialization.
   *
   * Changing the value after initialization can lead to incorrect data handling.
   */
  @Column({
    name: "ReadOnly",
    nullable: false,
  })
  public readOnly!: boolean;

}
