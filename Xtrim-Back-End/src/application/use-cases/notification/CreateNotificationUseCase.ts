import { NotificationRepository } from "../../../domain/repositories/NotificationRepository";
import { Notification } from "../../../domain/entities/Notification";

export class CreateNotificationUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute(title: string, message: string, type: string) {
    const notification: Notification = {
      title,
      message,
      type,
      isRead: false,
    };
    return this.notificationRepository.create(notification);
  }
}
