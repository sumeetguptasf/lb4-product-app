import {AuthenticationStrategy} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import {compare} from 'bcryptjs';
import {UserRepository, UserCredentialRepository} from '../../repositories';
import {repository} from '@loopback/repository';

export class LocalUsernameStrategy implements AuthenticationStrategy {
  name = 'local';

  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialRepository)
    public userCredsRepository: UserCredentialRepository,
  ) {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const {username, password} = request.body;

    if (!username || !password) {
      throw new HttpErrors.BadRequest('Missing username or password.');
    }

    // Find user by username
    const user = await this.userRepository.findOne({
      where: {username: username},
    });

    if (!user) {
      throw new HttpErrors.Unauthorized('Invalid username or password.');
    }

    // Get stored credentials (hashed password)
    const creds = await this.userCredsRepository.findById(user.id);

    const passwordMatched = await compare(password, creds.password);
    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized('Invalid username or password.');
    }

    // Return UserProfile for JWT
    return {
      [securityId]: user.username,
      username: user.username,
      name: user.username, // optional alias
    };
  }
}