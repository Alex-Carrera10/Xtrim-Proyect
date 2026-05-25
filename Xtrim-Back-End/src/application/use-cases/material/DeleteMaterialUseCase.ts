import { MaterialRepository } from "@domain/repositories/MaterialRepository";

export class DeleteMaterialUseCase {
  constructor(private materialRepository: MaterialRepository) {}

  async execute(id: string): Promise<boolean> {
    return this.materialRepository.delete(id);
  }
}
