import { InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class SignupInput {
  @IsEmail()
  email: string;
  password: string;
}
