import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignupInput } from './dto/signup/signup.input';
import * as argon2 from 'argon2';
import { SigninInput } from './dto/signin/signin.input';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async signup(signupInput: SignupInput) {
    const { email, password } = signupInput;

    await this.validateSignupUserExistence(email);
    const createdUser = await this.createNewUser(email, password);

    delete createdUser.password;
    return createdUser;
  }

  private async validateSignupUserExistence(email: string) {
    const userExist = await this.usersService.existByEmail(email);
    if (userExist) {
      throw new ForbiddenException('User already exists.');
    }
  }

  private async createNewUser(email: string, password: string) {
    const hash = await argon2.hash(password);
    return this.usersService.create(email, hash);
  }

  async signin(signinInput: SigninInput) {
    const { email, password } = signinInput;
    const user = await this.validateSigninUserExistence(email);
    await this.doSignin(user.password, password);
    return user;
  }

  private async validateSigninUserExistence(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }
    return user;
  }

  private async doSignin(hash: string, password: string) {
    const verified = await argon2.verify(hash, password);
    if (!verified) {
      throw new ForbiddenException('Invalid credentials');
    }
  }

  signToken(id: string, email: string) {
    const payload = {
      sub: id,
      email,
    };
    return this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: '30m',
    });
  }
}
