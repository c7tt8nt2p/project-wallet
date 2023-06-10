import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignupInput } from './dto/signup/signup.input';
import * as argon2 from 'argon2';
import e from 'express';
import { SigninInput } from './dto/signin/signin.input';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signup(signupInput: SignupInput) {
    const { email, password } = signupInput;

    await this.validateSignupUserExistence(email);
    const createdUser = await this.createNewUser(email, password);

    delete createdUser.password;
    return createdUser;
  }

  private async validateSignupUserExistence(email: string) {
    const userExist = await this.prisma.user
      .findUnique({
        where: {
          email,
        },
      })
      .then((r) => !!r);
    if (userExist) {
      throw new ForbiddenException('User already exists.');
    }
  }

  private async createNewUser(email: string, password: string) {
    const hash = await argon2.hash(password);
    return this.prisma.user.create({
      data: {
        email,
        password: hash,
      },
    });
  }

  async signin(signinInput: SigninInput) {
    const { email, password } = signinInput;
    const user = await this.validateSigninUserExistence(email);
    await this.doSignin(user.password, password);
    return user;
  }

  private async validateSigninUserExistence(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
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
}
