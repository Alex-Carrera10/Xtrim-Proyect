import { Lead } from "@domain/entities/Lead";
import { LeadRepository } from "@domain/repositories/LeadRepository";

export class UpdateLeadUseCase {
  constructor(private leadRepository: LeadRepository) {}

  async execute(id: string, lead: Partial<Lead>): Promise<Lead | null> {
    return this.leadRepository.update(id, lead);
  }
}
