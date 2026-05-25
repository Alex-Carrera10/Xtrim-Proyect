import { UpdateLeadStatusUseCase } from "@application/use-cases/lead/UpdateLeadStatusUseCase";
import { CreateNotificationUseCase } from "@application/use-cases/notification/CreateNotificationUseCase";
import { LeadRepository } from "@domain/repositories/LeadRepository";
import { Lead, LeadStatus } from "@domain/entities/Lead";
import { NotificationRepository } from "@domain/repositories/NotificationRepository";

const leadExistente: Lead = {
  id: "lead-uuid-001",
  name: "María López",
  phone: "0987654321",
  province: "Guayas",
  status: LeadStatus.IN_MANAGEMENT,
  valor_estimado: 5000,
};

const mockLeadRepository: jest.Mocked<LeadRepository> = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getSalesGrowth: jest.fn(),
  getNewLeadsCount: jest.fn(),
  addActivity: jest.fn(),
  getActivitiesByLeadId: jest.fn(),
};

const mockNotificationRepository: jest.Mocked<NotificationRepository> = {
  create: jest.fn(),
  findAllUnread: jest.fn(),
  markAsRead: jest.fn(),
  markAllAsRead: jest.fn(),
};

describe("UpdateLeadStatusUseCase", () => {
  let createNotificationUseCase: CreateNotificationUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLeadRepository.findById.mockResolvedValue(leadExistente);
    mockLeadRepository.update.mockResolvedValue({ ...leadExistente, status: LeadStatus.WON });
    mockNotificationRepository.create.mockResolvedValue({
      id: "notif-001",
      title: "test",
      message: "test",
      type: "SALE",
      isRead: false,
      createdAt: new Date(),
    });
    createNotificationUseCase = new CreateNotificationUseCase(mockNotificationRepository);
  });

  it("debe actualizar el estado del lead correctamente", async () => {
    const useCase = new UpdateLeadStatusUseCase(mockLeadRepository, createNotificationUseCase);
    const result = await useCase.execute("lead-uuid-001", LeadStatus.WON);

    expect(mockLeadRepository.update).toHaveBeenCalledWith("lead-uuid-001", { status: LeadStatus.WON });
    expect(result?.status).toBe(LeadStatus.WON);
  });

  it("debe crear una notificación cuando el estado cambia a GANADO", async () => {
    const createSpy = jest.spyOn(createNotificationUseCase, "execute");
    const useCase = new UpdateLeadStatusUseCase(mockLeadRepository, createNotificationUseCase);

    await useCase.execute("lead-uuid-001", LeadStatus.WON);

    expect(createSpy).toHaveBeenCalledWith(
      "¡Nueva Venta Realizada!",
      expect.stringContaining("María López"),
      "SALE"
    );
    expect(createSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining("5000"),
      "SALE"
    );
  });

  it("NO debe crear notificación cuando el estado cambia a CONTACTADO", async () => {
    mockLeadRepository.update.mockResolvedValue({ ...leadExistente, status: LeadStatus.CONTACTED });
    const createSpy = jest.spyOn(createNotificationUseCase, "execute");
    const useCase = new UpdateLeadStatusUseCase(mockLeadRepository, createNotificationUseCase);

    await useCase.execute("lead-uuid-001", LeadStatus.CONTACTED);

    expect(createSpy).not.toHaveBeenCalled();
  });

  it("NO debe crear notificación cuando el estado cambia a PERDIDO", async () => {
    mockLeadRepository.update.mockResolvedValue({ ...leadExistente, status: LeadStatus.LOST });
    const createSpy = jest.spyOn(createNotificationUseCase, "execute");
    const useCase = new UpdateLeadStatusUseCase(mockLeadRepository, createNotificationUseCase);

    await useCase.execute("lead-uuid-001", LeadStatus.LOST);

    expect(createSpy).not.toHaveBeenCalled();
  });

  it("debe lanzar error si el lead no existe", async () => {
    mockLeadRepository.findById.mockResolvedValue(null);
    const useCase = new UpdateLeadStatusUseCase(mockLeadRepository, createNotificationUseCase);

    await expect(useCase.execute("id-inexistente", LeadStatus.WON)).rejects.toThrow("Lead not found");
  });
});
