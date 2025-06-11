// src/entities/Post.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany
} from "typeorm";
import { User } from "./User";
import { Category } from "./Category";
import { Tag } from "./Tag";
import { Comment } from "./Comment";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column("text")
  content: string;

  // Relacionamento com User (muitos Posts para um User)
  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  // Relacionamento com Category (muitos Posts para uma Category)
  @ManyToOne(() => Category, (category) => category.posts)
  category: Category;

  // Relacionamento com Tag (muitos-para-muitos)
  @ManyToMany(() => Tag, (tag) => tag.posts, { cascade: true })
  @JoinTable()
  tags: Tag[];

  // Relacionamento com Comment (um Post pode ter muitos Comments)
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
