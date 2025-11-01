import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Purchase } from './purchase';

@ObjectType('User') // Entidade que representa a mesma coisa, mas em serviços diferentes.
@Directive('@key(fields: "authUserId")') // ApolloFederation
export class Customer {
  id: string;

  @Field(() => ID)
  authUserId: string;

  @Field(() => [Purchase])
  purchases: Purchase[];
}
