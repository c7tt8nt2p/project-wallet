import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import spyOn = jest.spyOn;
import { SignupInput } from './dto/signup/signup.input';
import { SigninInput } from './dto/signin/signin.input';
import { ForbiddenException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        PrismaService,
        JwtService,
        ConfigService,
        UsersService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    const signupInputMock: SignupInput = {
      email: 'test@test.com',
      password: '123',
    };

    it('should throw an exception when user already exists', async () => {
      spyOn(usersService, 'existByEmail').mockResolvedValue(true);
      const wrapper = async () => await service.signup(signupInputMock);

      await expect(wrapper).rejects.toThrow(
        new ForbiddenException('User already exists.'),
      );
    });

    it('should create a new user if not exist', async () => {
      const hashMock = '$argon2';
      spyOn(argon2, 'hash').mockResolvedValue(hashMock);
      spyOn(usersService, 'existByEmail').mockResolvedValue(false);
      const createdUserMock = { email: 'mock' };
      spyOn(usersService, 'create').mockResolvedValue(createdUserMock as any);

      const result = await service.signup(signupInputMock);
      expect(usersService.create).toHaveBeenCalledWith(
        signupInputMock.email,
        hashMock,
      );
      expect(result).toEqual(createdUserMock);
    });
  });

  describe('signin', () => {
    const signinInputMock: SigninInput = {
      email: 'hello@test.com',
      password: '456',
    };

    it('should throw an exception when user does not exist', async () => {
      spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);

      const wrapper = async () => await service.signin(signinInputMock);

      await expect(wrapper).rejects.toThrow(
        new ForbiddenException('Invalid credentials'),
      );
    });

    it('should throw an exception when the password hash verification failed', async () => {
      const userMock = { email: 'mock' };
      spyOn(usersService, 'findOneByEmail').mockResolvedValue(userMock as any);
      spyOn(argon2, 'verify').mockResolvedValue(true);

      const result = await service.signin(signinInputMock);
      expect(result).toEqual(userMock);
    });
  });
});
