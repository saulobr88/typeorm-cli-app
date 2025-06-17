// src/entities/Post.ts
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Category } from './Category';
import { Comment } from './Comment';
import { Tag } from './Tag';
import { User } from './User';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  // Relacionamento com User (muitos Posts para um User)
  @ManyToOne(() => User, user => user.posts)
  user: User;

  // Relacionamento com Category (muitos Posts para uma Category)
  @ManyToOne(() => Category, category => category.posts)
  category: Category;

  // Relacionamento com Tag (muitos-para-muitos)
  @ManyToMany(() => Tag, tag => tag.posts, { cascade: true })
  @JoinTable()
  tags: Tag[];

  // Relacionamento com Comment (um Post pode ter muitos Comments)
  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[];
}
