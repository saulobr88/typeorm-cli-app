// src/entities/User.ts
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Post } from './Post';
import { Profile } from './Profile';

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
  @OneToMany(() => Post, post => post.user)
  posts: Post[];
}
