import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey()
  id!: number;

  @Property({unique: true})
  email!: string;

  @Property()
  password!: string;

  @Property({default: false, fieldName: 'is_admin'})
  isAdmin!: boolean;

  @Property({ fieldName: 'created_at', defaultRaw: 'now()' })
  createdAt!: Date;

  @Property({ fieldName: 'updated_at', defaultRaw: 'now()', onUpdate: () => 'now()' })
  updatedAt!: Date;
}
