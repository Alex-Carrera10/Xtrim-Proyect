import { LeadRepository } from "@domain/repositories/LeadRepository";

export class DeleteLeadUseCase {
  constructor(private leadRepository: LeadRepository) {}

  async execute(id: string): Promise<boolean> {
    return this.leadRepository.delete(id);
  }
}
