import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {UserCredentialDataSource} from '../datasources';
import {UserCredential, UserCredentialRelations} from '../models';

export class UserCredentialRepository extends DefaultCrudRepository<
  UserCredential,
  typeof UserCredential.prototype.id,
  UserCredentialRelations
> {
  constructor(
    @inject('datasources.userCredential') dataSource: UserCredentialDataSource,
  ) {
    super(UserCredential, dataSource);
  }
}
