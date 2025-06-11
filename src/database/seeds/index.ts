// src/database/seeds/index.ts
import 'reflect-metadata';
import { AppDataSource } from 'database/data-source';
import { runSeeders } from 'typeorm-extension';

// 🔽  IMPORTA AS FACTORIES UMA ÚNICA VEZ
import 'database/seeds/factories/CategoryFactory';
import 'database/seeds/factories/TagFactory';
import 'database/seeds/factories/UserFactory';
import 'database/seeds/factories/PostFactory';
import 'database/seeds/factories/CommentFactory';

// Seeders (e paths absolutos, sem '@')
import CategorySeeder from 'database/seeds/CategorySeeder';
import TagSeeder      from 'database/seeds/TagSeeder';
import UserSeeder     from 'database/seeds/UserSeeder';
import PostSeeder     from 'database/seeds/PostSeeder';
import CommentSeeder     from 'database/seeds/CommentSeeder';

(async () => {
  try {
    await AppDataSource.initialize();
    console.log('🎛️  Conexão estabelecida. Executando seeders…');

    await runSeeders(AppDataSource, {
      seeds: [CategorySeeder, TagSeeder, UserSeeder, PostSeeder, CommentSeeder],
    });

    console.log('🌱  Banco populado com sucesso!');
  } catch (err) {
    console.error('Erro ao rodar seeders:', err);
  } finally {
    await AppDataSource.destroy();
  }
})();
