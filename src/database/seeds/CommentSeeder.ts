// src/database/seeds/CommentSeeder.ts
import { faker } from '@faker-js/faker';
import { Comment } from 'entities/Comment';
import { Post } from 'entities/Post';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class CommentSeeder implements Seeder {
  async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const commentRepo = dataSource.getRepository(Comment);
    const postRepo = dataSource.getRepository(Post);

    /* não duplica se já houver comentários */
    if (await commentRepo.count()) {
      console.log('➡️  Comments já existem – CommentSeeder ignorado');
      return;
    }

    const posts = await postRepo.find();
    if (!posts.length) {
      console.log('⚠️  Nenhum post encontrado — crie posts antes de rodar CommentSeeder');
      return;
    }

    const commentFactory = factoryManager.get(Comment);

    for (const post of posts) {
      /* 2–5 comentários raiz */
      const roots: Comment[] = [];
      const numRoots = faker.number.int({ min: 2, max: 5 });
      for (let i = 0; i < numRoots; i++) {
        const root = await commentFactory.make();
        root.post = post;
        roots.push(root);
      }
      await commentRepo.save(roots);

      /* 0–2 respostas para cada raiz */
      for (const root of roots) {
        const replies: Comment[] = [];
        const numReplies = faker.number.int({ min: 0, max: 2 });
        for (let j = 0; j < numReplies; j++) {
          const reply = await commentFactory.make();
          reply.post = post;
          reply.parent = root;
          replies.push(reply);
        }
        if (replies.length) await commentRepo.save(replies);
      }
    }

    console.log('✅  CommentSeeder criou comentários para todos os posts');
  }
}
