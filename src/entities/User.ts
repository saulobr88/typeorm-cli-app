// src/entities/User.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn
} from "typeorm";
import { Profile } from "./Profile";
import { Post } from "./Post";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  // Um User possui um Profile (OneToOne)
  @OneToOne(() => Profile, { cascade: true })
  @JoinColumn() // Cria a coluna profileId na tabela user
  profile: Profile;

  // Um User pode possuir muitos Posts (OneToMany)
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
