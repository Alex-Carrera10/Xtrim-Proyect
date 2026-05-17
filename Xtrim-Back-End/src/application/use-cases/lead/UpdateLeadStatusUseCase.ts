import { LeadRepository } from "@domain/repositories/LeadRepository";
import { LeadStatus } from "@domain/entities/Lead";

export class UpdateLeadStatusUseCase {
  constructor(private leadRepository: LeadRepository) {}

  async execute(id: string, status: LeadStatus) {
    const lead = await this.leadRepository.findById(id);
    if (!lead) {
      throw new Error("Lead not found");
    }
    return this.leadRepository.update(id, { status });
  }
}
