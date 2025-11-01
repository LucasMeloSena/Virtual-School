import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { KafkaService } from 'src/messaging/kafka.service';

interface CreatePurchaseParams {
  customerId: string;
  productId: string;
}

@Injectable()
export class PurchasesService {
  constructor(
    private prisma: PrismaService,
    private kafka: KafkaService,
  ) {}

  async listAllPurchases() {
    return await this.prisma.purchase.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async listAllPurchasesByCustomer(customerId: string) {
    return await this.prisma.purchase.findMany({
      where: {
        customerId,
      },
    });
  }

  async creatPurchase(purchase: CreatePurchaseParams) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: purchase.productId,
      },
    });
    if (!product) {
      throw new BadRequestException('Product not found.');
    }

    const createdPurchase = await this.prisma.purchase.create({
      data: {
        customerId: purchase.customerId,
        productId: purchase.productId,
      },
    });

    const customer = await this.prisma.customer.findUnique({
      where: {
        id: purchase.customerId,
      },
    });

    this.kafka.emit('purchases.new-purchase', {
      customer: {
        authUserId: customer.authUserId,
      },
      product: {
        id: product.id,
        title: product.title,
        slug: product.slug,
      },
    });

    return createdPurchase;
  }
}
