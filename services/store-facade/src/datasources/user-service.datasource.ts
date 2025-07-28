import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'userService',
  connector: 'rest',
  baseURL: 'http://localhost:3002',
  crud: true
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class UserServiceDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'userService';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.userService', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
