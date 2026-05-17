import { LeadRepository } from "@domain/repositories/LeadRepository";
import { Activity, ActivityType } from "@domain/entities/Activity";

export class AddLeadActivityUseCase {
  constructor(private leadRepository: LeadRepository) {}

  async execute(leadId: string, content: string, type: ActivityType) {
    const lead = await this.leadRepository.findById(leadId);
    if (!lead) {
      throw new Error("Lead not found");
    }
    
    const activity: Activity = {
      leadId,
      content,
      type
    };
    
    return this.leadRepository.addActivity(activity);
  }
}
