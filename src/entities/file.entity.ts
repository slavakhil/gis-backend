import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'file' })
export class File {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property()
  path!: string;

  @Property()
  mimetype!: string;

  @Property()
  size!: number;

  @Property({ fieldName: 'created_at', defaultRaw: 'now()' })
  createdAt!: Date;
}
