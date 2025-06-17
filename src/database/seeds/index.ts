// src/database/seeds/index.ts
import 'reflect-metadata';
// 🔽  IMPORTA AS FACTORIES UMA ÚNICA VEZ
import 'database/seeds/factories/CategoryFactory';
import 'database/seeds/factories/TagFactory';
import 'database/seeds/factories/UserFactory';
import 'database/seeds/factories/PostFactory';
import 'database/seeds/factories/CommentFactory';

import { AppDataSource } from 'database/data-source';
// Seeders (e paths absolutos, sem '@')
import CategorySeeder from 'database/seeds/CategorySeeder';
import CommentSeeder from 'database/seeds/CommentSeeder';
import PostSeeder from 'database/seeds/PostSeeder';
import TagSeeder from 'database/seeds/TagSeeder';
import UserSeeder from 'database/seeds/UserSeeder';
import { runSeeders } from 'typeorm-extension';

void (async () => {
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
