import { LeadRepository } from "@domain/repositories/LeadRepository";

export class GetSalesKPIUseCase {
  constructor(private leadRepository: LeadRepository) {}

  async execute(): Promise<{ totalSales: number }> {
    const totalSales = await this.leadRepository.getSalesGrowth();
    return { totalSales };
  }
}
