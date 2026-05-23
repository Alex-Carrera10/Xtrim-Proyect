import { LeadRepository } from "@domain/repositories/LeadRepository";
import { LeadStatus } from "@domain/entities/Lead";
import { CreateNotificationUseCase } from "../notification/CreateNotificationUseCase";

export class UpdateLeadStatusUseCase {
  constructor(
    private leadRepository: LeadRepository,
    private createNotificationUseCase: CreateNotificationUseCase
  ) {}

  async execute(id: string, status: LeadStatus) {
    const lead = await this.leadRepository.findById(id);
    if (!lead) {
      throw new Error("Lead not found");
    }

    const updatedLead = await this.leadRepository.update(id, { status });

    if (status === LeadStatus.WON) {
      await this.createNotificationUseCase.execute(
        "¡Nueva Venta Realizada!",
        `El lead ${lead.name} ha sido marcado como Ganado por un valor de $${lead.valor_estimado}.`,
        "SALE"
      );
    }

    return updatedLead;
  }
}
