import prisma from "../config/prisma";
import { Notification } from "../../domain/entities/Notification";
import { NotificationRepository } from "../../domain/repositories/NotificationRepository";

export class PrismaNotificationRepository implements NotificationRepository {
  async create(notification: Notification): Promise<Notification> {
    const created = await prisma.notification.create({
      data: {
        title: notification.title,
        message: notification.message,
        type: notification.type,
        isRead: notification.isRead,
      },
    });
    return this.mapToEntity(created);
  }

  async findAllUnread(): Promise<Notification[]> {
    const notifications = await prisma.notification.findMany({
      where: { isRead: false },
      orderBy: { createdAt: "desc" },
    });
    return notifications.map(n => this.mapToEntity(n));
  }

  async markAsRead(id: string): Promise<void> {
    await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(): Promise<void> {
    await prisma.notification.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });
  }

  private mapToEntity(data: any): Notification {
    return {
      id: data.id,
      title: data.title,
      message: data.message,
      type: data.type,
      isRead: data.isRead,
      createdAt: data.createdAt,
    };
  }
}
