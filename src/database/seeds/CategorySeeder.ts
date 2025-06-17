import { Category } from 'entities/Category';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

/**
 * Cria três categorias fixas (Tech, News, Life) se ainda não existirem.
 */
export default class CategorySeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const categoryRepo = dataSource.getRepository(Category);

    // Verifica se já existem registros para evitar duplicação
    if (await categoryRepo.count()) {
      console.log('➡️  Categories já existem – CategorySeeder ignorado');
      return;
    }

    const defaultCategories = ['Tech', 'News', 'Life'].map(name => categoryRepo.create({ name }));

    await categoryRepo.save(defaultCategories);

    console.log('✅  CategorySeeder criou: Tech, News, Life');
  }
}
