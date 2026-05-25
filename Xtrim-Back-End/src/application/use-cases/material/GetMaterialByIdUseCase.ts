import { Material } from "@domain/entities/Material";
import { MaterialRepository } from "@domain/repositories/MaterialRepository";

export class GetMaterialByIdUseCase {
  constructor(private materialRepository: MaterialRepository) {}

  async execute(id: string): Promise<Material | null> {
    return this.materialRepository.findById(id);
  }
}
