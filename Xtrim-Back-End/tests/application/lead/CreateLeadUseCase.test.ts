import { CreateLeadUseCase } from "@application/use-cases/lead/CreateLeadUseCase";
import { LeadRepository } from "@domain/repositories/LeadRepository";
import { Lead, LeadStatus } from "@domain/entities/Lead";

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

const leadBase: Lead = {
  name: "Juan Pérez",
  phone: "0991234567",
  province: "Pichincha",
  status: LeadStatus.NEW,
  valor_estimado: 3000,
};

describe("CreateLeadUseCase", () => {
  it("debe crear un lead y retornarlo", async () => {
    const leadCreado: Lead = { ...leadBase, id: "uuid-123" };
    mockLeadRepository.create.mockResolvedValue(leadCreado);

    const useCase = new CreateLeadUseCase(mockLeadRepository);
    const result = await useCase.execute(leadBase);

    expect(result).toEqual(leadCreado);
    expect(mockLeadRepository.create).toHaveBeenCalledWith(leadBase);
    expect(mockLeadRepository.create).toHaveBeenCalledTimes(1);
  });

  it("debe llamar al repositorio con los datos exactos del lead", async () => {
    const leadConEmail: Lead = { ...leadBase, email: "juan@test.com", description: "Cliente VIP" };
    mockLeadRepository.create.mockResolvedValue({ ...leadConEmail, id: "uuid-456" });

    const useCase = new CreateLeadUseCase(mockLeadRepository);
    await useCase.execute(leadConEmail);

    expect(mockLeadRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "juan@test.com",
        description: "Cliente VIP",
      })
    );
  });

  it("debe propagar el error si el repositorio falla", async () => {
    mockLeadRepository.create.mockRejectedValue(new Error("DB connection error"));

    const useCase = new CreateLeadUseCase(mockLeadRepository);

    await expect(useCase.execute(leadBase)).rejects.toThrow("DB connection error");
  });
});
