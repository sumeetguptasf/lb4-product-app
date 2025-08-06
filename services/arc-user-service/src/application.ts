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
import { UserTenantServiceComponent, UserTenantServiceComponentBindings } from '@sourceloop/user-tenant-service';
import { AuthenticationServiceComponent } from '@sourceloop/authentication-service';

export { ApplicationConfig };
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });


export class ArcUserServiceApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Bind the UserTenantServiceComponent
    this.component(UserTenantServiceComponent as any);

    this.bind(UserTenantServiceComponentBindings.Config).to({
      useCustomSequence: false,
      useSequelize: true,
    });

    // add Component for AuthenticationService
    this.component(AuthenticationServiceComponent as any);
    
    this.bind('authenticationService.config').to({
      useCustomSequence: false,
      useSequelize: true,
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
