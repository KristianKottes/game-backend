import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import envConfig from 'src/config/env.config';

import { User, UsersService } from '../users';

import { JwtTokens, SignUpDto } from './dto';
import { IJwtPayload } from './interfaces';
import { JwtRefreshService } from './jwt-refresh.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(envConfig.KEY)
    private config: ConfigType<typeof envConfig>,
    private usersService: UsersService,
    private jwtService: JwtService,
    private jwtRefreshService: JwtRefreshService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    try {
      const user = await this.usersService.findByUsername(username);

      const doPasswordsMatch = await bcrypt.compare(password, user.password);
      if (doPasswordsMatch) {
        return user;
      }
      return null;
    } catch (e) {
      if (e instanceof NotFoundException) {
        // User was not found
        return null;
      }
      throw e;
    }
  }

  async validateUserPayload(payload: IJwtPayload): Promise<User | null> {
    try {
      const user = await this.usersService.findOne(payload.sub);
      return user;
    } catch (e) {
      if (e instanceof NotFoundException) {
        // User was not found
        return null;
      }
      throw e;
    }
  }

  async createJwtTokenPair(user: User): Promise<JwtTokens> {
    const payload: IJwtPayload = { username: user.username, sub: user.id };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtRefreshService.signAsync({ sub: user.id }),
    };
  }

  async signIn(user: User) {
    return this.createJwtTokenPair(user);
  }

  async signUp({ username, password }: SignUpDto) {
    const doesUserExist = await this.usersService.doesUserExist(username);

    if (doesUserExist) {
      throw new BadRequestException('User already exists!');
    }

    const user = await this.usersService.create({
      password,
      username,
    });

    const tokens = await this.createJwtTokenPair(user);

    return { user, tokens };
  }

  async getUserProfile(id: string) {
    return this.usersService.findOne(id);
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const result: Pick<IJwtPayload, 'sub'> =
        await this.jwtRefreshService.verifyAsync(refreshToken);
      const user = await this.usersService.findOne(result.sub);
      return this.createJwtTokenPair(user);
    } catch {
      throw new BadRequestException();
    }
  }
}
