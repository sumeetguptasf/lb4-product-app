import {Entity, model, property, hasOne} from '@loopback/repository';
import {UserCredential} from './user-credential.model';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id: string;

  @property({type: 'string', required: true})
  username: string;

  @property({
    type: 'date',
  })
  created_at?: string;

  @hasOne(() => UserCredential, {keyTo: 'userCredential'})
  userCredential?: UserCredential;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
