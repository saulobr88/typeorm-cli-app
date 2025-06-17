// src/entities/Comment.ts
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Post } from './Post';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  // Relacionamento com Post
  @ManyToOne(() => Post, post => post.comments)
  post: Post;

  // Autorrelação: Um Comment pode ter vários "filhos"
  @ManyToOne(() => Comment, comment => comment.children, { nullable: true })
  parent: Comment;

  @OneToMany(() => Comment, comment => comment.parent)
  children: Comment[];
}
