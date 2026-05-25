import { Material } from "@domain/entities/Material";
import { MaterialRepository } from "@domain/repositories/MaterialRepository";

export class UpdateMaterialUseCase {
  constructor(private materialRepository: MaterialRepository) {}

  async execute(id: string, material: Partial<Material>): Promise<Material | null> {
    return this.materialRepository.update(id, material);
  }
}
