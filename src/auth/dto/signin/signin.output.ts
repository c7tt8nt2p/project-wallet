import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SigninOutput {
  token: string;
}
