import { NotificationRepository } from "../../domain/repositories/NotificationRepository";

export class GetNotificationsUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute() {
    return this.notificationRepository.findAllUnread();
  }
}
