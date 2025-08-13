import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'userCredentials',
  connector: 'postgresql',
  url: 'postgres://postgres:postgres@localhost:5432/auth-arc-db',
  host: '',
  port: 0,
  user: '',
  password: '',
  database: ''
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class UserCredentialDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'userCredential';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.userCredential', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
