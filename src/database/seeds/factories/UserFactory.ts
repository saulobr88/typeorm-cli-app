// src/database/seeds/factories/UserFactory.ts
import { faker } from '@faker-js/faker';
import { Profile } from 'entities/Profile';
import { User } from 'entities/User';
import { setSeederFactory } from 'typeorm-extension';

/**
 * Factory que gera instâncias de User completas,
 * incluindo o Profile aninhado, para uso em seeders.
 */
export default setSeederFactory(User, () => {
  // cria o profile
  const profile = new Profile();
  profile.firstName = faker.person.firstName();
  profile.lastName = faker.person.lastName();
  profile.bio = faker.person.bio();

  // cria o usuário
  const user = new User();
  user.username = faker.internet.username({
    firstName: profile.firstName,
    lastName: profile.lastName,
  });
  user.email = faker.internet.email({
    firstName: profile.firstName,
    lastName: profile.lastName,
  });
  user.profile = profile;

  return user;
});
