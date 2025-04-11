import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ tableName: "modules" })
export class Module {
  @PrimaryKey()
  id!: number;

  @Property({ type: "text" })
  name!: string;

  @Property({ type: "text" })
  link!: string;
}
