import { NotificationRepository } from "../../../domain/repositories/NotificationRepository";

export class MarkNotificationsAsReadUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute(id?: string) {
    if (id) {
      return this.notificationRepository.markAsRead(id);
    }
    return this.notificationRepository.markAllAsRead();
  }
}
