import { Material } from "@domain/entities/Material";
import { MaterialRepository } from "@domain/repositories/MaterialRepository";

export class GetMaterialsUseCase {
  constructor(private materialRepository: MaterialRepository) {}

  async execute(): Promise<Material[]> {
    return this.materialRepository.findAll();
  }
}
