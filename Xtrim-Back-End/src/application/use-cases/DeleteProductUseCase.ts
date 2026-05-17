import { ProductRepository } from "@domain/repositories/ProductRepository";

export class DeleteProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(id: string): Promise<boolean> {
    console.log(`Borrando producto: ${id}`);
    return this.productRepository.delete(id);
  }
}
