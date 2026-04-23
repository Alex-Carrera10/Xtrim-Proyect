import { LeadRepository } from "../../domain/repositories/LeadRepository";

export class GetLeadHistoryUseCase {
  constructor(private leadRepository: LeadRepository) {}

  async execute(leadId: string) {
    const lead = await this.leadRepository.findById(leadId);
    if (!lead) {
      throw new Error("Lead not found");
    }
    return this.leadRepository.getActivitiesByLeadId(leadId);
  }
}
