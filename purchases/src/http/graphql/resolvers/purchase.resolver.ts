import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PurchasesService } from 'src/services/purchases.service';
import { Purchase } from '../models/purchase';
import { UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from 'src/http/authorization/authorization.guard';
import { ProductsService } from 'src/services/products.service';
import { CreatePurchaseInput } from '../inputs/create-purchase-input';
import { AuthUser, CurrentUser } from 'src/http/authorization/current-user';
import { CustomerService } from 'src/services/customer.service';

@Resolver(() => Purchase)
export class PurchaseResolver {
  constructor(
    private purchaseService: PurchasesService,
    private productService: ProductsService,
    private customerService: CustomerService,
  ) {}

  @Query(() => [Purchase])
  @UseGuards(AuthorizationGuard)
  async purchases() {
    return await this.purchaseService.listAllPurchases();
  }

  @ResolveField()
  product(@Parent() purchase: Purchase) {
    return this.productService.getProductById(purchase.productId);
  }

  @Mutation(() => Purchase)
  @UseGuards(AuthorizationGuard)
  async createPurchase(
    @Args('data') data: CreatePurchaseInput,
    @CurrentUser() user: AuthUser,
  ) {
    const customer = await this.customerService.getCustomerByAuthUserId(
      user.sub,
    );

    if (!customer) {
      await this.customerService.createCustomerService({
        authUserId: user.sub,
      });
    }

    return await this.purchaseService.createPurchase({
      productId: data.productId,
      customerId: customer.id,
    });
  }
}
