import { Product } from "@domain/entities/Product";
import { ProductRepository } from "@domain/repositories/ProductRepository";

export class UpdateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: string, product: Partial<Product>): Promise<Product | null> {
    console.log(`Actualizando producto ${id}:`, product);
    return this.productRepository.update(id, product);
  }
}
