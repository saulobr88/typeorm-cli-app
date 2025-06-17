// src/database/seeds/factories/CategoryFactory.ts
import { faker } from '@faker-js/faker';
import { Category } from 'entities/Category';
import { setSeederFactory } from 'typeorm-extension';

/**
 * Factory que gera categorias com nomes curtos (1 – 2 palavras),
 * capitalizando a primeira letra de cada palavra.
 */
export default setSeederFactory(Category, () => {
  const category = new Category();

  // gera 1 ou 2 palavras, depois coloca a inicial maiúscula
  category.name = faker.word
    .words({ count: { min: 1, max: 2 } })
    .replace(/\b\w/g, l => l.toUpperCase());

  return category;
});
