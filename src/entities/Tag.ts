// src/entities/Tag.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany
} from "typeorm";
import { Post } from "./Post";

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Uma Tag pode estar relacionada a muitos Posts (ManyToMany)
  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post[];
}
