import { Lead } from "@domain/entities/Lead";
import { LeadRepository } from "@domain/repositories/LeadRepository";

export class CreateLeadUseCase {
  constructor(private leadRepository: LeadRepository) {}

  async execute(lead: Lead): Promise<Lead> {
    console.log("Creando lead:", lead);
    return this.leadRepository.create(lead);
  }
}
