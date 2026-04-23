export enum ActivityType {
  NOTE = "Nota",
  CALL = "Llamada",
  WHATSAPP = "WhatsApp",
  MEETING = "Reunión",
  EMAIL = "Email",
}

export interface Activity {
  id?: string;
  leadId: string;
  content: string;
  type: ActivityType;
  createdAt?: Date;
}
