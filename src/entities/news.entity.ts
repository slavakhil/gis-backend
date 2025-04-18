import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'news' })
export class News {
  @PrimaryKey()
  id!: number;

  @Property({ nullable: false })
  title!: string;

  @Property({ type: 'datetime', nullable: false })
  date!: Date;

  @Property({ nullable: false })
  author!: string;

  @Property({ type: 'text', nullable: false })
  content!: string;

  @Property({ fieldName: 'photo', type: 'json', nullable: true })
  photo?: string[];
}
