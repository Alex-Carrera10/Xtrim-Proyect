import prisma from "../config/prisma";
import { Lead, LeadStatus } from "../../domain/entities/Lead";
import { Activity, ActivityType } from "../../domain/entities/Activity";
import { LeadRepository } from "../../domain/repositories/LeadRepository";

export class PrismaLeadRepository implements LeadRepository {
  async create(lead: Lead): Promise<Lead> {
    const created = await prisma.lead.create({
      data: {
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        province: lead.province,
        description: lead.description,
        status: this.mapToPrismaStatus(lead.status),
        valor_estimado: lead.valor_estimado,
      },
    });
    return this.mapToEntity(created);
  }

  async findAll(): Promise<Lead[]> {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
    return leads.map(lead => this.mapToEntity(lead));
  }

  async findById(id: string): Promise<Lead | null> {
    const lead = await prisma.lead.findUnique({
      where: { id },
    });
    return lead ? this.mapToEntity(lead) : null;
  }

  async update(id: string, lead: Partial<Lead>): Promise<Lead | null> {
    const updated = await prisma.lead.update({
      where: { id },
      data: {
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        province: lead.province,
        description: lead.description,
        status: lead.status ? this.mapToPrismaStatus(lead.status) : undefined,
        valor_estimado: lead.valor_estimado,
      },
    });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    // Primero borramos las actividades asociadas para evitar error de FK
    await prisma.activity.deleteMany({
      where: { leadId: id },
    });

    // Luego borramos el lead
    await prisma.lead.delete({
      where: { id },
    });
    return true;
  }

  async getSalesGrowth(): Promise<number> {
    const result = await prisma.lead.aggregate({
      _sum: {
        valor_estimado: true,
      },
      where: {
        status: "GANADO",
      },
    });
    return result._sum.valor_estimado || 0;
  }

  async getNewLeadsCount(): Promise<number> {
    return await prisma.lead.count({
      where: {
        status: "NUEVO",
      },
    });
  }

  async addActivity(activity: Activity): Promise<Activity> {
    const created = await prisma.activity.create({
      data: {
        leadId: activity.leadId,
        content: activity.content,
        type: this.mapToPrismaActivityType(activity.type),
      },
    });
    return this.mapToActivityEntity(created);
  }

  async getActivitiesByLeadId(leadId: string): Promise<Activity[]> {
    const activities = await prisma.activity.findMany({
      where: { leadId },
      orderBy: { createdAt: "desc" },
    });
    return activities.map(a => this.mapToActivityEntity(a));
  }

  private mapToEntity(data: any): Lead {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      province: data.province,
      description: data.description,
      status: this.mapToDomainStatus(data.status),
      valor_estimado: data.valor_estimado,
      createdAt: data.createdAt,
    };
  }

  private mapToDomainStatus(prismaStatus: string): LeadStatus {
    const map: Record<string, LeadStatus> = {
      NUEVO: LeadStatus.NEW,
      CONTACTADO: LeadStatus.CONTACTED,
      EN_GESTION: LeadStatus.IN_MANAGEMENT,
      GANADO: LeadStatus.WON,
      PERDIDO: LeadStatus.LOST,
    };
    return map[prismaStatus] || LeadStatus.NEW;
  }

  private mapToPrismaStatus(domainStatus: LeadStatus): any {
    const map: Record<string, string> = {
      [LeadStatus.NEW]: "NUEVO",
      [LeadStatus.CONTACTED]: "CONTACTADO",
      [LeadStatus.IN_MANAGEMENT]: "EN_GESTION",
      [LeadStatus.WON]: "GANADO",
      [LeadStatus.LOST]: "PERDIDO",
    };
    return map[domainStatus] || "NUEVO";
  }

  private mapToActivityEntity(data: any): Activity {
    return {
      id: data.id,
      leadId: data.leadId,
      content: data.content,
      type: this.mapToDomainActivityType(data.type),
      createdAt: data.createdAt,
    };
  }

  private mapToDomainActivityType(prismaType: string): ActivityType {
    const map: Record<string, ActivityType> = {
      NOTA: ActivityType.NOTE,
      LLAMADA: ActivityType.CALL,
      WHATSAPP: ActivityType.WHATSAPP,
      REUNION: ActivityType.MEETING,
      EMAIL: ActivityType.EMAIL,
    };
    return map[prismaType] || ActivityType.NOTE;
  }

  private mapToPrismaActivityType(domainType: ActivityType): any {
    const map: Record<string, string> = {
      [ActivityType.NOTE]: "NOTA",
      [ActivityType.CALL]: "LLAMADA",
      [ActivityType.WHATSAPP]: "WHATSAPP",
      [ActivityType.MEETING]: "REUNION",
      [ActivityType.EMAIL]: "EMAIL",
    };
    return map[domainType] || "NOTA";
  }
}
