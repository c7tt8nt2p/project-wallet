import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignupOutput {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
