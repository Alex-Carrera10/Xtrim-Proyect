import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { JwtService } from "../config/jwt";

type Handler = (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>;

const jwtService = new JwtService();

const unauthorizedResponse = (): APIGatewayProxyResult => ({
  statusCode: 401,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  },
  body: JSON.stringify({ message: "No autorizado" }),
});

export const authGuard = (handler: Handler): Handler => {
  return async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const authHeader = event.headers?.authorization || event.headers?.Authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return unauthorizedResponse();
    }

    const token = authHeader.slice(7);
    const payload = jwtService.verifyToken(token);

    if (!payload) {
      return unauthorizedResponse();
    }

    return handler(event);
  };
};
