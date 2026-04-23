import { Lead } from "@domain/entities/Lead";
import { LeadRepository } from "@domain/repositories/LeadRepository";

export class GetLeadByIdUseCase {
  constructor(private leadRepository: LeadRepository) {}

  async execute(id: string): Promise<Lead | null> {
    return this.leadRepository.findById(id);
  }
}
