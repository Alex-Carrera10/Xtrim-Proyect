import prisma from "../config/prisma";
import { Product } from "../../domain/entities/Product";
import { ProductRepository } from "../../domain/repositories/ProductRepository";

export class PrismaProductRepository implements ProductRepository {
  async create(product: Product): Promise<Product> {
    const created = await prisma.product.create({
      data: {
        title: product.title,
        price: product.price,
        category: product.category,
        features: product.features,
        image: product.image,
      },
    });
    return this.mapToEntity(created);
  }

  async findAll(): Promise<Product[]> {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return products.map(product => this.mapToEntity(product));
  }

  async findById(id: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    return product ? this.mapToEntity(product) : null;
  }

  async update(id: string, product: Partial<Product>): Promise<Product | null> {
    const updated = await prisma.product.update({
      where: { id },
      data: {
        title: product.title,
        price: product.price,
        category: product.category,
        features: product.features,
        image: product.image,
      },
    });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    await prisma.product.delete({
      where: { id },
    });
    return true;
  }

  private mapToEntity(data: any): Product {
    return {
      id: data.id,
      title: data.title,
      price: Number(data.price),
      category: data.category,
      features: data.features,
      image: data.image || undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
