import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignupOutput {
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
