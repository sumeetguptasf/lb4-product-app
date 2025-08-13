import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {UserDataSource} from '../datasources';
import {User, UserRelations, UserCredential} from '../models';
import {UserCredentialRepository} from './user-credential.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.username,
  UserRelations
> {

  public readonly userCredential: HasOneRepositoryFactory<UserCredential, typeof User.prototype.username>;

  constructor(
    @inject('datasources.user') dataSource: UserDataSource, @repository.getter('UserCredentialRepository') protected userCredentialRepositoryGetter: Getter<UserCredentialRepository>,
  ) {
    super(User, dataSource);
    this.userCredential = this.createHasOneRepositoryFactoryFor('userCredential', userCredentialRepositoryGetter);
    this.registerInclusionResolver('userCredential', this.userCredential.inclusionResolver);
  }
}
