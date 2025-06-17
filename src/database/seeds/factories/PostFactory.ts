// src/database/seeds/factories/PostFactory.ts
import { faker } from '@faker-js/faker';
import { Post } from 'entities/Post';
import { setSeederFactory } from 'typeorm-extension';

/**
 * Factory básica que gera um Post com título e conteúdo.
 * Relacionamentos (user, category, tags) são adicionados
 * no PostSeeder, não aqui.
 */
export default setSeederFactory(Post, () => {
  const post = new Post();

  // Título estilo frase “hacker” (ex.: “Reboot the neural interface”)
  post.title = faker.hacker.phrase();

  // 2–5 parágrafos separados por linha em branco
  post.content = faker.lorem.paragraphs({ min: 2, max: 5 }, '\n\n');

  return post;
});
