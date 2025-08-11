import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import path from 'path';
import { MySequence } from './sequence';
import { inMemoryRateLimiter } from './middleware/rate-limiter.middleware';
import { RateLimiterComponent, RateLimitSecurityBindings } from 'loopback4-ratelimiter';
import RedisClient from 'ioredis';

export { ApplicationConfig };

export class StoreFacadeApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);


    const redisClient = new RedisClient({
      host: '127.0.0.1',
      port: 6379,
      password: 'redispassword', // replace with your Redis password if needed
      enableOfflineQueue: false,
    });
    // this.middleware(inMemoryRateLimiter);
    this.component(RateLimiterComponent as any);
    this.bind(RateLimitSecurityBindings.CONFIG).to({
        name: 'redis',
        type: 'RedisStore',
        storeClient: redisClient,   // IMPORTANT
        points: 2,                 // max requests
        duration: 60,               // per 60 seconds
    });

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
