import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { JwtService } from "../config/jwt";
import { LoginUseCase } from "@application/use-cases/auth/LoginUseCase";

const jwtService = new JwtService();
const loginUseCase = new LoginUseCase(jwtService);

const createResponse = (statusCode: number, body: any): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  },
  body: JSON.stringify(body),
});

export const login = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { username, password } = JSON.parse(event.body || "{}");

    if (!username || !password) {
      return createResponse(400, { message: "Usuario y contraseña son requeridos" });
    }

    const result = loginUseCase.execute(username, password);
    return createResponse(200, result);
  } catch (error: any) {
    return createResponse(401, { message: error.message });
  }
};
