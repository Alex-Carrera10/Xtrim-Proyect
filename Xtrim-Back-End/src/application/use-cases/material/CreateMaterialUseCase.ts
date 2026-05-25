import { Material } from "@domain/entities/Material";
import { MaterialRepository } from "@domain/repositories/MaterialRepository";

export class CreateMaterialUseCase {
  constructor(private materialRepository: MaterialRepository) {}

  async execute(material: Material): Promise<Material> {
    return this.materialRepository.create(material);
  }
}
