import { Product } from "@domain/entities/Product";
import { ProductRepository } from "@domain/repositories/ProductRepository";

export class CreateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(product: Product): Promise<Product> {
    console.log("Creando producto:", product);
    return this.productRepository.create(product);
  }
}
