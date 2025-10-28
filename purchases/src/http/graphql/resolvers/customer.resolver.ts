import { CustomerService } from 'src/services/customer.service';
import { Customer } from '../models/customer';
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from 'src/http/authorization/authorization.guard';
import { AuthUser, CurrentUser } from 'src/http/authorization/current-user';
import { PurchasesService } from 'src/services/purchases.service';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(
    private customerService: CustomerService,
    private purchaseService: PurchasesService,
  ) {}

  @Query(() => Customer)
  @UseGuards(AuthorizationGuard)
  async me(@CurrentUser() user: AuthUser) {
    return await this.customerService.getCustomerByAuthUserId(user.sub);
  }

  @ResolveField()
  purchases(@Parent() customer: Customer) {
    return this.purchaseService.listAllPurchasesByCustomer(customer.id);
  }
}
