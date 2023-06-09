import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  create(createUserInput: CreateUserInput): User {
    console.log('creating a new user', { createUserInput });
    return {
      id: 1,
      email: 'New user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  findAll(): User[] {
    return [
      {
        id: 1,
        email: 'John',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  findOne(id: number) {
    return {
      id: 2,
      email: 'Jack',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
