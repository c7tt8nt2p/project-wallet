import { Args, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from '../auth/strategy/graphql-auth.guard';
import { CurrentUser, Me } from '../auth/decorator/user.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // @Mutation(() => User)
  // createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
  //   return this.usersService.create(createUserInput);
  // }
  //
  // @Query(() => [User], { name: 'users' })
  // findAll() {
  //   return this.usersService.findAll();
  // }
  //

  @UseGuards(GraphqlAuthGuard)
  @Query(() => User)
  me(@Me() currentUser: CurrentUser) {
    console.log('me == ', currentUser);
    return this.usersService.findOneByEmail('test@gmail.com');
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('email', { type: () => String }) email: string) {
    return this.usersService.findOneByEmail(email);
  }

  //
  // @Mutation(() => User)
  // removeUser(@Args('id', { type: () => Int }) id: number) {
  //   return this.usersService.remove(id);
  // }
}
