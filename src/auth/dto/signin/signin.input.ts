import { InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class SigninInput {
  @IsEmail()
  email: string;
  password: string;
}
