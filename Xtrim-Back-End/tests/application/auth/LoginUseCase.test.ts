import { LoginUseCase } from "@application/use-cases/auth/LoginUseCase";
import { AuthService } from "@domain/services/AuthService";

const mockAuthService: AuthService = {
  generateToken: jest.fn().mockReturnValue("mock.jwt.token"),
  verifyToken: jest.fn(),
};

describe("LoginUseCase", () => {
  beforeEach(() => {
    process.env.ADMIN_USERNAME = "admin";
    process.env.ADMIN_PASSWORD = "dorado2026";
    jest.clearAllMocks();
  });

  it("debe retornar un token cuando las credenciales son correctas", () => {
    const useCase = new LoginUseCase(mockAuthService);

    const result = useCase.execute("admin", "dorado2026");

    expect(result).toEqual({ token: "mock.jwt.token" });
    expect(mockAuthService.generateToken).toHaveBeenCalledWith({
      username: "admin",
      role: "admin",
    });
  });

  it("debe lanzar error cuando el usuario es incorrecto", () => {
    const useCase = new LoginUseCase(mockAuthService);

    expect(() => useCase.execute("usuario_falso", "dorado2026")).toThrow(
      "Credenciales incorrectas"
    );
  });

  it("debe lanzar error cuando la contraseña es incorrecta", () => {
    const useCase = new LoginUseCase(mockAuthService);

    expect(() => useCase.execute("admin", "password_malo")).toThrow(
      "Credenciales incorrectas"
    );
  });

  it("no debe llamar a generateToken cuando las credenciales son incorrectas", () => {
    const useCase = new LoginUseCase(mockAuthService);

    expect(() => useCase.execute("admin", "malo")).toThrow();
    expect(mockAuthService.generateToken).not.toHaveBeenCalled();
  });

  it("debe lanzar error cuando usuario y contraseña están vacíos", () => {
    const useCase = new LoginUseCase(mockAuthService);

    expect(() => useCase.execute("", "")).toThrow("Credenciales incorrectas");
  });
});
