import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const dotenv = require('dotenv');
dotenv.config({path: '.env'});

const config = {
  name: 'AuthDB',
  connector: 'postgresql',
  url: process.env.DB_URL || 'postgres://postgres:postgres@localhost:5432/authdb',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  schema: process.env.DB_SCHEMA,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class AuthDBDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'AuthDB';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.AuthDB', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
