import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(email: string, hashPassword: string) {
    return this.prisma.user.create({
      data: {
        email,
        password: hashPassword,
      },
    });
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async existByEmail(email: string) {
    return this.prisma.user
      .findUnique({
        where: {
          email,
        },
      })
      .then((result) => !!result);
  }
}
