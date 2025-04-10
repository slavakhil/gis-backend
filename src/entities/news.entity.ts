import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { File } from './file.entity.js';

@Entity({ tableName: 'news' })
export class News {
  @PrimaryKey()
  id!: number;

  @Property()
  date!: Date;

  @Property()
  author!: string;

  @Property()
  content!: string;

  @ManyToOne(() => File, { nullable: true })
  image?: File;
}
