@model({
  name: 'auth_clients',
})
export class AuthClient extends Entity implements IAuthClient {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    name: 'client_id',
  })
  clientId: string;

  @property({
    type: 'string',
    required: true,
    name: 'client_secret',
  })
  clientSecret: string;

  @property({
    type: 'array',
    itemType: 'number',
    name: 'user_ids',
  })
  userIds: number[];

  constructor(data?: Partial<AuthClient>) {
    super(data);
  }
}