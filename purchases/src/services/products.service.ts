import { ConflictException, Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { Product } from '../http/graphql/models/product';
import { CreateProductInput } from 'src/http/graphql/inputs/create-product-input';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async listAllProducts() {
    return await this.prisma.product.findMany();
  }

  async getProductById(id: string) {
    return await this.prisma.product.findUnique({
      where: {
        id,
      },
    });
  }

  async createProduct({ title }: CreateProductInput): Promise<Product> {
    const slug = slugify(title, { lower: true });
    const productWithSameSlug = await this.prisma.product.findUnique({
      where: {
        slug,
      },
    });
    if (productWithSameSlug) {
      throw new ConflictException(
        'Another product with same slug already exists.',
      );
    }
    return await this.prisma.product.create({
      data: {
        title,
        slug,
      },
    });
  }
}
