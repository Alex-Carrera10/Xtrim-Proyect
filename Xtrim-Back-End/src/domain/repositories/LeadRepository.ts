import { Lead } from "../entities/Lead";
import { Activity } from "../entities/Activity";

export interface LeadRepository {
  create(lead: Lead): Promise<Lead>;
  findAll(): Promise<Lead[]>;
  findById(id: string): Promise<Lead | null>;
  update(id: string, lead: Partial<Lead>): Promise<Lead | null>;
  delete(id: string): Promise<boolean>;
  getSalesGrowth(): Promise<number>;
  getNewLeadsCount(): Promise<number>;
  
  // CRM Methods
  addActivity(activity: Activity): Promise<Activity>;
  getActivitiesByLeadId(leadId: string): Promise<Activity[]>;
}
