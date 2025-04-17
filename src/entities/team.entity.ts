import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'team_members' })
export class TeamMember {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'text' })
  position!: string;

  @Property({ fieldName: 'last_name', type: 'text' })
  lastName!: string;

  @Property({ fieldName: 'first_name', type: 'text' })
  firstName!: string;

  @Property({ fieldName: 'patronymic', type: 'text', nullable: true })
  patronymic?: string;

  @Property({ fieldName: 'email', type: 'text' })
  email!: string;

  @Property({ fieldName: 'photo', nullable: true })
  photo?: string;
}
