import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SigninOutput {
  accessToken: string;
}
