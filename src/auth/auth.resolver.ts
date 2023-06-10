import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput } from './dto/signup/signup.input';
import { SignupOutput } from './dto/signup/signup.output';
import { SigninInput } from './dto/signin/signin.input';
import { SigninOutput } from './dto/signin/signin.output';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignupOutput)
  async signup(@Args('signupInput') signupInput: SignupInput) {
    const user = await this.authService.signup(signupInput);
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } as SignupOutput;
  }

  @Mutation(() => SigninOutput)
  async signin(@Args('signinInput') signinInput: SigninInput) {
    const user = await this.authService.signin(signinInput);
    const token = await this.authService.signToken(user.id, user.email);
    return {
      accessToken: token,
    } as SigninOutput;
  }
}
