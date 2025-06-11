// src/database/seeds/TagSeeder.ts
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Tag } from 'entities/Tag';

/**
 * Popula a tabela tags com 10 registros falsos gerados pela TagFactory.
 * Se já houver qualquer tag, o seeder é ignorado para evitar duplicação.
 */
export default class TagSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const tagRepo = dataSource.getRepository(Tag);

    // Se já existem tags, não cria novas
    if (await tagRepo.count()) {
      console.log('➡️  Tags já existem – TagSeeder ignorado');
      return;
    }

    // Cria e salva 10 tags fake usando a factory em factories/TagFactory.ts
    await factoryManager.get(Tag).saveMany(10);

    console.log('✅  TagSeeder populou 10 tags');
  }
}
