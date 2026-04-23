import { Lead } from "@domain/entities/Lead";
import { LeadRepository } from "@domain/repositories/LeadRepository";

export class GetLeadsUseCase {
  constructor(private leadRepository: LeadRepository) {}

  async execute(): Promise<Lead[]> {
    return this.leadRepository.findAll();
  }
}
