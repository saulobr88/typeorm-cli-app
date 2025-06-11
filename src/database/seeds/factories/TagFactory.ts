// src/database/seeds/factories/TagFactory.ts
import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker';
import { Tag } from 'entities/Tag';

/**
 * Factory que gera tags usando adjetivos simples em minúsculas
 * (ex.: “smart”, “secure”, “modern”).
 */
export default setSeederFactory(Tag, () => {
  const tag = new Tag();

  // gera um adjetivo curto e converte para minúsculas
  tag.name = faker.word.adjective({ length: { min: 3, max: 10 } }).toLowerCase();

  return tag;
});
