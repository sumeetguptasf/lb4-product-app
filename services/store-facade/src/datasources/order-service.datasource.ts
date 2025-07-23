import { inject, lifeCycleObserver, LifeCycleObserver } from "@loopback/core";
import { juggler } from "@loopback/repository";
import * as dotenv from 'dotenv';
dotenv.config(); // Load .env before anything else

@lifeCycleObserver('datasource')
export class OrderServiceDataSource extends juggler.DataSource implements LifeCycleObserver {
  static dataSourceName = 'orderService';

  constructor(
    @inject('datasources.config.orderService', {optional: true})
    dsConfig: object = {
      name: 'orderService',
      connector: 'rest',
      baseUrl: process.env.DB_URL || 'https://localhost:3000',
      ssl: process.env.DB_SSL === 'true' ? {rejectUnauthorized: false} : false,
    },
  ) {
    super(dsConfig);
  }
}