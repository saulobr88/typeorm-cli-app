// src/entities/Category.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Post } from './Post';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Uma Category pode possuir muitos Posts
  @OneToMany(() => Post, post => post.category)
  posts: Post[];
}
