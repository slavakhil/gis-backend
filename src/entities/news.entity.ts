import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { File } from './file.entity.js';

@Entity({ tableName: 'news' })
export class News {
  @PrimaryKey()
  id!: number;

  @Property()
  title!: string;

  @Property()
  date!: Date;

  @Property()
  author!: string;

  @Property({ type: 'text' })
  content!: string;

  @Property({ fieldName: 'photo', type: 'text', nullable: true })
  photo?: string;
}
