import { inject , lifeCycleObserver, LifeCycleObserver } from "@loopback/core";
import { juggler } from "@loopback/repository";
import * as dotenv from 'dotenv';
dotenv.config(); // Load .env before anything else

@lifeCycleObserver('datasource')
export class ProductServiceDataSource extends juggler.DataSource implements LifeCycleObserver {
  static dataSourceName = 'productService';

  constructor(
    @inject('datasources.config.productService', {optional: true})
    dsConfig: object = {
      name: 'ProductService',
      connector: 'rest',
      baseUrl: process.env.DB_URL || 'https://localhost:3000',
      ssl: process.env.DB_SSL === 'true' ? {rejectUnauthorized: false} : false,
    },
  ) {
    super(dsConfig);
  }
}