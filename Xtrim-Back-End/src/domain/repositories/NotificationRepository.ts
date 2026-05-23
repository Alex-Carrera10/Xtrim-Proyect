import { Notification } from "../entities/Notification";

export interface NotificationRepository {
  create(notification: Notification): Promise<Notification>;
  findAllUnread(): Promise<Notification[]>;
  markAsRead(id: string): Promise<void>;
  markAllAsRead(): Promise<void>;
}
