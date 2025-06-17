// src/database/seeds/PostSeeder.ts
import { faker } from '@faker-js/faker';
import { Category } from 'entities/Category';
import { Post } from 'entities/Post';
import { Tag } from 'entities/Tag';
import { User } from 'entities/User';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

/**
 * Cria 30 posts, ligando-os a usuários, categorias e 1–4 tags aleatórias.
 * Se já há posts na tabela, o seeder é ignorado para evitar duplicação.
 */
export default class PostSeeder implements Seeder {
  async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const postRepo = dataSource.getRepository(Post);
    const userRepo = dataSource.getRepository(User);
    const catRepo = dataSource.getRepository(Category);
    const tagRepo = dataSource.getRepository(Tag);

    // Evita duplicação
    if (await postRepo.count()) {
      console.log('➡️  Posts já existem – PostSeeder ignorado');
      return;
    }

    /* ------------------------------------------------------------------
       1 ▸ Garante que existam dados-base: usuários, categorias, tags
       ------------------------------------------------------------------ */
    if (!(await userRepo.count())) await factoryManager.get(User).saveMany(5);
    if (!(await catRepo.count()))
      await catRepo.save(['Tech', 'News', 'Life'].map(name => catRepo.create({ name })));
    if (!(await tagRepo.count())) await factoryManager.get(Tag).saveMany(10);

    const users = await userRepo.find();
    const categories = await catRepo.find();
    const tags = await tagRepo.find();

    /* ------------------------------------------------------------------
       2 ▸ Cria 30 posts usando a PostFactory para título/conteúdo
       ------------------------------------------------------------------ */
    const postFactory = factoryManager.get(Post);
    const posts: Post[] = [];

    for (let i = 0; i < 30; i++) {
      const post = await postFactory.make();
      post.user = faker.helpers.arrayElement(users);
      post.category = faker.helpers.arrayElement(categories);
      post.tags = faker.helpers.arrayElements(tags, { min: 1, max: 4 });
      posts.push(post);
    }

    await postRepo.save(posts);

    console.log('✅  PostSeeder populou 30 posts');
  }
}
