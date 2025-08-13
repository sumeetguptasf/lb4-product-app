import {repository} from '@loopback/repository';
import {post, requestBody, HttpErrors} from '@loopback/rest';
import {UserRepository, UserCredentialsRepository} from '../repositories';
import {v4 as uuidv4} from 'uuid';
import * as bcrypt from 'bcryptjs';
import {TokenService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {TokenServiceBindings} from '@sourceloop/authentication-service';

export class AuthController {
  constructor(
    @repository(UserRepository) public userRepo: UserRepository,
    @repository(UserCredentialsRepository) public credRepo: UserCredentialsRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE) public tokenService: TokenService,
  ) {}

  @post('/signup')
  async signup(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              username: {type: 'string'},
              password: {type: 'string'},
            },
            required: ['username', 'password'],
          },
        },
      },
    })
    creds: {username: string; password: string},
  ) {
    const userId = uuidv4();

    const user = await this.userRepo.create({
      id: userId,
      username: creds.username,
    });

    const hashed = await bcrypt.hash(creds.password, 10);
    await this.credRepo.create({
      id: uuidv4(),
      password: hashed,
      userId: userId,
    });

    return {message: 'User created successfully', user};
  }

  @post('/login')
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              username: {type: 'string'},
              password: {type: 'string'},
            },
            required: ['username', 'password'],
          },
        },
      },
    })
    creds: {username: string; password: string},
  ) {
    const user = await this.userRepo.findOne({where: {username: creds.username}});
    if (!user) {
      throw new HttpErrors.Unauthorized('Invalid username or password');
    }

    const storedCreds = await this.userRepo.userCredential(user?.username).get();
    const isMatch = await bcrypt.compare(creds.password, storedCreds.password);
    if (!isMatch) {
      throw new HttpErrors.Unauthorized('Invalid username or password');
    }

    const token = await this.tokenService.generateToken({id: user.id, username: user.username});
    return {token};
  }
}