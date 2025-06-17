import 'reflect-metadata';

import chalk from 'chalk';
import { AppDataSource } from 'database/data-source';
import { Category } from 'entities/Category';
import { Comment } from 'entities/Comment';
import { Post } from 'entities/Post';
import { Tag } from 'entities/Tag';
import { User } from 'entities/User';
import inquirer from 'inquirer';
import { printComments } from 'utils/commentTree';

async function bootstrap() {
  console.clear();
  await AppDataSource.initialize();
  console.log(chalk.green('\n📚 Blog CLI conectado ao banco!\n'));
  await mainMenu();
}

async function mainMenu(): Promise<void> {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      loop: false,
      name: 'action',
      message: 'Escolha uma ação:',
      choices: [
        'Criar usuário',
        'Criar categoria',
        'Criar post',
        'Listar posts',
        'Ler post (comentar)',
        new inquirer.Separator(),
        'Sair',
      ],
    },
  ]);

  switch (answers.action) {
    case 'Criar usuário':
      await createUser();
      break;
    case 'Criar categoria':
      await createCategory();
      break;
    case 'Criar post':
      await createPost();
      break;
    case 'Listar posts':
      await listPosts();
      break;
    case 'Ler post (comentar)':
      await readPost();
      break;
    default:
      console.log('Até logo!');
      process.exit(0);
  }

  await mainMenu(); // loop
}

async function createUser(): Promise<void> {
  const { username, email, firstName, lastName } = await inquirer.prompt<{
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  }>([
    { type: 'input', name: 'username', message: 'Username:' },
    { type: 'input', name: 'email', message: 'Email:' },
    { type: 'input', name: 'firstName', message: 'Primeiro nome:' },
    { type: 'input', name: 'lastName', message: 'Sobrenome:' },
  ]);

  const repo = AppDataSource.getRepository(User);
  const user = repo.create({
    username,
    email,
    profile: { firstName, lastName },
  });
  await repo.save(user);
  console.log(chalk.green('Usuário criado!\n'));
}

async function createCategory(): Promise<void> {
  const { name } = await inquirer.prompt<{ name: string }>([
    { type: 'input', name: 'name', message: 'Nome da categoria:' },
  ]);
  const repo = AppDataSource.getRepository(Category);
  await repo.save(repo.create({ name }));
  console.log(chalk.green('Categoria criada!\n'));
}

async function createPost(): Promise<void> {
  const userRepo = AppDataSource.getRepository(User);
  const catRepo = AppDataSource.getRepository(Category);
  const tagRepo = AppDataSource.getRepository(Tag);

  const users = await userRepo.find();
  const cats = await catRepo.find();
  const tags = await tagRepo.find();

  if (!users.length || !cats.length) {
    console.log(chalk.red('Crie pelo menos um usuário e uma categoria antes!\n'));
    return;
  }

  const answers = await inquirer.prompt<{
    userId: number;
    catId: number;
    title: string;
    content: string;
    tagIds: number[];
    newTags: string;
  }>([
    {
      type: 'list',
      loop: false,
      name: 'userId',
      message: 'Autor:',
      choices: users.map(u => ({ name: u.username, value: u.id })),
    },
    {
      type: 'list',
      loop: false,
      name: 'catId',
      message: 'Categoria:',
      choices: cats.map(c => ({ name: c.name, value: c.id })),
    },
    { type: 'input', name: 'title', message: 'Título do post:' },
    { type: 'input', name: 'content', message: 'Conteúdo:' },
    {
      type: 'checkbox',
      name: 'tagIds',
      message: 'Selecione tags (opcional):',
      choices: tags.map(t => ({ name: t.name, value: t.id })),
      pageSize: 10,
    },
    {
      type: 'input',
      name: 'newTags',
      message: 'Adicionar novas tags (separadas por vírgula, deixe em branco para nenhuma):',
    },
  ]);

  const newTagNames: string[] = answers.newTags
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean);

  const newTagEntities = await tagRepo.save(newTagNames.map(name => tagRepo.create({ name })));

  const tagsForPost = [...tags.filter(t => answers.tagIds.includes(t.id)), ...newTagEntities];

  const postRepo = AppDataSource.getRepository(Post);
  const post = postRepo.create({
    title: answers.title,
    content: answers.content,
    user: { id: answers.userId },
    category: { id: answers.catId },
    tags: tagsForPost,
  });

  await postRepo.save(post);
  console.log(chalk.green('Post criado!\n'));
}

async function listPosts(): Promise<void> {
  const posts = await AppDataSource.getRepository(Post).find({
    relations: ['user', 'category'],
  });

  if (!posts.length) {
    console.log(chalk.yellow('Nenhum post encontrado.\n'));
    return;
  }

  posts.forEach(p =>
    console.log(`[${p.id}] ${p.title} – autor: ${p.user.username} – categoria: ${p.category.name}`),
  );
  console.log();
}

async function readPost(): Promise<void> {
  const posts = await AppDataSource.getRepository(Post).find({ relations: ['user'] });

  if (!posts.length) {
    console.log(chalk.yellow('Nenhum post disponível.\n'));
    return;
  }

  const { postId } = await inquirer.prompt<{ postId: number }>([
    {
      type: 'list',
      loop: false,
      name: 'postId',
      message: 'Selecione um post:',
      choices: posts.map(p => ({
        name: `[${p.id}] ${p.title} (autor: ${p.user.username})`,
        value: p.id,
      })),
    },
  ]);

  await openPost(postId);
}

async function openPost(postId: number): Promise<void> {
  const postRepo = AppDataSource.getRepository(Post);
  const commentRepo = AppDataSource.getRepository(Comment);

  const post = await postRepo.findOne({
    where: { id: postId },
    relations: {
      comments: { children: true },
      tags: true,
      user: true,
      category: true,
    },
  });

  if (!post) {
    console.log(chalk.red('Post não encontrado.\n'));
    return;
  }

  console.log(chalk.cyan.bold(`\n${post.title}`));
  console.log(`Autor: ${post.user.username}`);
  console.log(`Categoria: ${post.category.name}`);
  console.log(`Tags: ${post.tags.map(t => t.name).join(', ') || '—'}`);
  console.log(chalk.whiteBright('\n' + post.content + '\n'));

  console.log(chalk.magenta('Comentários:'));
  printComments(post.comments);

  const { action } = await inquirer.prompt<{ action: string }>([
    {
      type: 'list',
      loop: false,
      name: 'action',
      message: 'O que deseja fazer?',
      choices: [
        'Adicionar comentário raiz',
        'Responder a comentário existente',
        'Voltar ao menu principal',
      ],
    },
  ]);

  if (action === 'Adicionar comentário raiz') {
    const { content } = await inquirer.prompt<{ content: string }>([
      { type: 'input', name: 'content', message: 'Conteúdo do comentário:' },
    ]);

    await commentRepo.save(commentRepo.create({ content, post: { id: postId } }));
    console.log(chalk.green('Comentário adicionado!\n'));
  }

  if (action === 'Responder a comentário existente') {
    const flat = await commentRepo.find({ where: { post: { id: postId } } });

    if (!flat.length) {
      console.log(chalk.yellow('Não há comentários ainda.'));
    } else {
      const { parentId, content } = await inquirer.prompt<{ parentId: number; content: string }>([
        {
          type: 'list',
          loop: false,
          name: 'parentId',
          message: 'Selecione o comentário a responder:',
          choices: flat.map(c => ({ name: `[${c.id}] ${c.content.slice(0, 50)}`, value: c.id })),
        },
        { type: 'input', name: 'content', message: 'Conteúdo da resposta:' },
      ]);

      await commentRepo.save(
        commentRepo.create({ content, post: { id: postId }, parent: { id: parentId } }),
      );
      console.log(chalk.green('Resposta adicionada!'));
    }
  }

  if (action !== 'Voltar ao menu principal') {
    await openPost(postId); // recarrega visão do post
  }
}

bootstrap().catch(err => console.error(err));
