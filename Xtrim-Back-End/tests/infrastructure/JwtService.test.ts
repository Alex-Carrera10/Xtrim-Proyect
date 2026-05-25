import { JwtService } from "@infrastructure/config/jwt";

describe("JwtService", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test_secret_key_for_jest";
  });

  describe("generateToken", () => {
    it("debe generar un token string no vacío", () => {
      const jwtService = new JwtService();
      const token = jwtService.generateToken({ username: "admin", role: "admin" });

      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);
    });

    it("el token generado debe tener 3 partes separadas por puntos (formato JWT)", () => {
      const jwtService = new JwtService();
      const token = jwtService.generateToken({ username: "admin" });
      const parts = token.split(".");

      expect(parts).toHaveLength(3);
    });
  });

  describe("verifyToken", () => {
    it("debe retornar el payload cuando el token es válido", () => {
      const jwtService = new JwtService();
      const payload = { username: "admin", role: "admin" };
      const token = jwtService.generateToken(payload);

      const result = jwtService.verifyToken(token) as any;

      expect(result.username).toBe("admin");
      expect(result.role).toBe("admin");
    });

    it("debe retornar null cuando el token es inválido", () => {
      const jwtService = new JwtService();
      const result = jwtService.verifyToken("token.invalido.fake");

      expect(result).toBeNull();
    });

    it("debe retornar null cuando el token fue firmado con otro secret", () => {
      process.env.JWT_SECRET = "secret_original";
      const jwtService1 = new JwtService();
      const token = jwtService1.generateToken({ username: "admin" });

      process.env.JWT_SECRET = "otro_secret_diferente";
      const jwtService2 = new JwtService();
      const result = jwtService2.verifyToken(token);

      expect(result).toBeNull();
    });

    it("debe retornar null con un string vacío", () => {
      const jwtService = new JwtService();
      const result = jwtService.verifyToken("");

      expect(result).toBeNull();
    });
  });
});
