// src/database/seeds/factories/CommentFactory.ts
import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker';
import { Comment } from 'entities/Comment';

/**
 * Factory que gera um comentário simples (conteúdo de 6–16 palavras).
 * Relacionamentos (post, parent) são definidos no seeder, não aqui.
 */
export default setSeederFactory(Comment, () => {
  const comment = new Comment();

  // Frase curta para o conteúdo
  comment.content = faker.lorem.sentence({ min: 6, max: 16 });

  return comment;
});
