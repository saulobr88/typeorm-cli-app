// src/database/seeds/UserSeeder.ts
import { User } from 'entities/User';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

/**
 * Cria 10 usuários falsos usando a UserFactory registrada
 * (setSeederFactory) somente se ainda não houver registros.
 */
export default class UserSeeder implements Seeder {
  async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const userRepo = dataSource.getRepository(User);

    // evita duplicar seeder
    if (await userRepo.count()) {
      console.log('➡️  Users já existem – UserSeeder ignorado');
      return;
    }

    // factoryManager recupera a factory definida em UserFactory.ts
    await factoryManager.get(User).saveMany(10);

    console.log('✅  UserSeeder populou 10 usuários');
  }
}
