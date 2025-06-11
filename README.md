# Blog CLI – TypeScript + TypeORM

Uma aplicação **100 % linha‑de‑comando** que demonstra o uso do TypeORM fora de servidores web. Inclui migrations, seeders com Faker, aliases de import, ESLint + Prettier e build para produção.

> **Stack**  Node 22 · TypeScript 5 · pnpm · PostgreSQL · TypeORM 0.3 · inquirer · chalk 4 · dotenv · typeorm‑extension · faker

---

## Visão geral

| Recurso                 | Descrição                                                                   |
| ----------------------- | --------------------------------------------------------------------------- |
| **CRUD completo**       | Crie usuário, categoria, post; liste posts; leia post e comente (aninhado). |
| **Modelo relacional**   | User⇄Profile · User→Post · Category→Post · Post⇄Tag · Post→Comment→Comment. |
| **Migrations**          | Schema versionado (`migration:generate/run`).                               |
| **Seeders**             | Gera dados fake (User, Category, Tag, Post, Comment).                       |
| **Aliases de import**   | `entities/User`, `database/data-source`, `utils/commentTree`, etc.          |
| **Qualidade de código** | ESLint + Prettier integrados.                                               |

---

## Pré‑requisitos

```bash
# Node 22 (use nvm ou asdf)
nvm install 22
nvm use 22

# pnpm global
npm i -g pnpm
```

Crie e preencha um `.env` na raiz:

```dotenv
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=blog_cli
```

---

## Instalação & desenvolvimento local

```bash
pnpm install                 # dependências
pnpm run migration:run       # gera tabelas
pnpm run seed                # popula dados fake
pnpm start                   # abre o menu CLI
```

### Scripts úteis (dev)

| Comando                       | Ação                 |
| ----------------------------- | -------------------- |
| `pnpm start`                  | CLI com ts‑node.     |
| `pnpm run migration:generate` | Gera nova migration. |
| `pnpm run migration:run`      | Aplica migrations.   |
| `pnpm run seed`               | Executa seeders.     |
| `pnpm run lint` / `lint:fix`  | Lint do código.      |
| `pnpm run format`             | Prettier.            |

---

## Docker

O repositório já contém um **docker‑compose.yml** enxuto que sobe somente o Postgres para desenvolvimento:

### Subindo o banco e aplicação (dev)

```bash
cp .env.example .env        # edite o .env para as suas preferências

docker compose up -d    # inicia o Postgres

pnpm install
pnpm run migration:run
pnpm run seed
pnpm start
```

## Build & produção

```bash
pnpm run build               # tsc + tsc-alias  →  dist/

# aplica migrations e (opcional) seeders no JS compilado
pnpm run migration:run:prod
pnpm run seed:prod           # opcional

pnpm run start:prod          # CLI usando dist/
```

### Scripts de produção

| Comando                       | O que faz                     |
| ----------------------------- | ----------------------------- |
| `pnpm run migration:run:prod` | Aplica migrations em `dist/`. |
| `pnpm run seed:prod`          | Executa seeders JS.           |
| `pnpm run start:prod`         | Inicia o CLI compilado.       |

---

## Estrutura de pastas

```
src/
 ┣ entities/              # modelos
 ┣ database/
 ┃ ┣ migrations/         # arquivo .ts gerados
 ┃ ┣ seeds/
 ┃ ┃ ┣ factories/        # factories com Faker
 ┃ ┃ ┣ *Seeder.ts        # UserSeeder, PostSeeder…
 ┃ ┃ ┗ index.ts          # runner
 ┃ ┗ data-source.ts      # config TypeORM
 ┣ utils/commentTree.ts
 ┗ cli.ts                # entrada do app
```

---

## Menu do CLI (atalho)

```
✔ Criar usuário
✔ Criar categoria
✔ Criar post
✔ Listar posts
✔ Ler post (comentar)
    ↳ Adicionar comentário raiz
    ↳ Responder a comentário
```

Use as setas do teclado para navegar; **Enter** confirma.

---

✨ Pronto! Você tem um mini‑blog rodando direto no terminal, com banco versionado, dados fake e build pronto para contêiner ou servidor. Diverta‑se.
