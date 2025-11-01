import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import path from 'node:path';
import { DatabaseModule } from 'src/database/database.module';
import { ProductResolver } from './graphql/resolvers/products.resolver';
import { ProductsService } from 'src/services/products.service';
import { PurchaseResolver } from './graphql/resolvers/purchase.resolver';
import { PurchasesService } from 'src/services/purchases.service';
import { CustomerService } from 'src/services/customer.service';
import { CustomerResolver } from './graphql/resolvers/customer.resolver';
import { MessagingModule } from 'src/messaging/messaging.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    MessagingModule,
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        path: path.resolve(process.cwd(), 'src/schema.graphql'),
        federation: 2,
      },
    }),
  ],
  providers: [
    ProductResolver,
    ProductsService,

    PurchaseResolver,
    PurchasesService,

    CustomerResolver,
    CustomerService,
  ],
})
export class HttpModule {}
