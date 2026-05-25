process.env.JWT_SECRET = "test_secret_key_for_jest";

import { authGuard } from "@infrastructure/middleware/authGuard";
import { JwtService } from "@infrastructure/config/jwt";
import { APIGatewayProxyEvent } from "aws-lambda";

const jwtService = new JwtService();

const buildEvent = (authHeader?: string): APIGatewayProxyEvent =>
  ({
    headers: authHeader ? { authorization: authHeader } : {},
    pathParameters: {},
    body: null,
  } as unknown as APIGatewayProxyEvent);

describe("authGuard", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test_secret_key_for_jest";
  });

  it("debe retornar 401 cuando no hay header Authorization", async () => {
    const handler = authGuard(async () => ({ statusCode: 200, headers: {}, body: "ok" }));
    const result = await handler(buildEvent());

    expect(result.statusCode).toBe(401);
    expect(JSON.parse(result.body)).toEqual({ message: "No autorizado" });
  });

  it("debe retornar 401 cuando el header no tiene prefijo Bearer", async () => {
    const handler = authGuard(async () => ({ statusCode: 200, headers: {}, body: "ok" }));
    const result = await handler(buildEvent("token.sin.bearer"));

    expect(result.statusCode).toBe(401);
  });

  it("debe retornar 401 cuando el token es inválido", async () => {
    const handler = authGuard(async () => ({ statusCode: 200, headers: {}, body: "ok" }));
    const result = await handler(buildEvent("Bearer token.falso.invalido"));

    expect(result.statusCode).toBe(401);
  });

  it("debe ejecutar el handler cuando el token es válido", async () => {
    const token = jwtService.generateToken({ username: "admin", role: "admin" });
    const innerHandler = jest.fn().mockResolvedValue({ statusCode: 200, headers: {}, body: "ok" });
    const handler = authGuard(innerHandler);

    const result = await handler(buildEvent(`Bearer ${token}`));

    expect(result.statusCode).toBe(200);
    expect(innerHandler).toHaveBeenCalledTimes(1);
  });

  it("debe retornar 401 cuando el token está expirado", async () => {
    // Generamos un token con expiración en el pasado
    const jwt = require("jsonwebtoken");
    const expiredToken = jwt.sign(
      { username: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: -1 }
    );
    const handler = authGuard(async () => ({ statusCode: 200, headers: {}, body: "ok" }));

    const result = await handler(buildEvent(`Bearer ${expiredToken}`));

    expect(result.statusCode).toBe(401);
  });
});
