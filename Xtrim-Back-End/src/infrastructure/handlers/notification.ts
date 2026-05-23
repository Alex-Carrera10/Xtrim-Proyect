import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { PrismaNotificationRepository } from "../persistence/PrismaNotificationRepository";
import { GetNotificationsUseCase } from "@application/use-cases/notification/GetNotificationsUseCase";
import { MarkNotificationsAsReadUseCase } from "@application/use-cases/notification/MarkNotificationsAsReadUseCase";

// Setup
const repo = new PrismaNotificationRepository();
const getNotificationsUseCase = new GetNotificationsUseCase(repo);
const markAsReadUseCase = new MarkNotificationsAsReadUseCase(repo);

const createResponse = (statusCode: number, body: any): APIGatewayProxyResult => ({
  statusCode,
  headers: { 
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true 
  },
  body: JSON.stringify(body),
});

export const getNotifications = async (): Promise<APIGatewayProxyResult> => {
  try {
    const notifications = await getNotificationsUseCase.execute();
    return createResponse(200, notifications);
  } catch (error: any) {
    return createResponse(500, { message: error.message });
  }
};

export const markAsRead = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;
    await markAsReadUseCase.execute(id);
    return createResponse(200, { message: "Success" });
  } catch (error: any) {
    return createResponse(500, { message: error.message });
  }
};

export const markAllAsRead = async (): Promise<APIGatewayProxyResult> => {
  try {
    await markAsReadUseCase.execute();
    return createResponse(200, { message: "All notifications marked as read" });
  } catch (error: any) {
    return createResponse(500, { message: error.message });
  }
};
