import { Product } from "@domain/entities/Product";
import { ProductRepository } from "@domain/repositories/ProductRepository";

export class GetProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findAll();
  }
}
