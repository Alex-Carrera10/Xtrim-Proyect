export enum LeadStatus {
  NEW = "Nuevo",
  CONTACTED = "Contactado",
  IN_MANAGEMENT = "En gestión",
  WON = "Ganado",
  LOST = "Perdido",
}

export interface Lead {
  id?: string;
  name: string;
  email?: string;
  phone: string;
  province: string;
  description?: string;
  status: LeadStatus;
  valor_estimado: number;
  createdAt?: Date;
}
