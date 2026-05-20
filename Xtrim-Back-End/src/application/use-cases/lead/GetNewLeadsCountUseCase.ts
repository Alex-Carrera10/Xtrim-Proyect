import { LeadRepository } from "@domain/repositories/LeadRepository";

export class GetNewLeadsCountUseCase {
  constructor(private leadRepository: LeadRepository) {}

  async execute(): Promise<number> {
    return await this.leadRepository.getNewLeadsCount();
  }
}
