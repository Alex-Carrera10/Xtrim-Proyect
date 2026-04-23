import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { PrismaLeadRepository } from "../persistence/PrismaLeadRepository";
import { UpdateLeadStatusUseCase } from "@application/use-cases/UpdateLeadStatusUseCase";
import { AddLeadActivityUseCase } from "@application/use-cases/AddLeadActivityUseCase";
import { GetLeadHistoryUseCase } from "@application/use-cases/GetLeadHistoryUseCase";
import { GetLeadByIdUseCase } from "@application/use-cases/GetLeadByIdUseCase";
import { DeleteLeadUseCase } from "@application/use-cases/DeleteLeadUseCase";
import { UpdateLeadUseCase } from "@application/use-cases/UpdateLeadUseCase";

// Setup
const repo = new PrismaLeadRepository();
const updateStatusUseCase = new UpdateLeadStatusUseCase(repo);
const addActivityUseCase = new AddLeadActivityUseCase(repo);
const getHistoryUseCase = new GetLeadHistoryUseCase(repo);
const getLeadByIdUseCase = new GetLeadByIdUseCase(repo);
const deleteLeadUseCase = new DeleteLeadUseCase(repo);
const updateLeadUseCase = new UpdateLeadUseCase(repo);

const createResponse = (statusCode: number, body: any): APIGatewayProxyResult => ({
  statusCode,
  headers: { 
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true 
  },
  body: JSON.stringify(body),
});

export const updateLeadStatus = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;
    if (!id) return createResponse(400, { message: "ID is required" });
    
    const { status } = JSON.parse(event.body || "{}");
    if (!status) return createResponse(400, { message: "Status is required" });

    const updatedLead = await updateStatusUseCase.execute(id, status);
    return createResponse(200, updatedLead);
  } catch (error: any) {
    return createResponse(500, { message: error.message });
  }
};

export const addActivity = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const leadId = event.pathParameters?.id;
    if (!leadId) return createResponse(400, { message: "Lead ID is required" });

    const { content, type } = JSON.parse(event.body || "{}");
    if (!content || !type) return createResponse(400, { message: "Content and type are required" });

    const activity = await addActivityUseCase.execute(leadId, content, type);
    return createResponse(201, activity);
  } catch (error: any) {
    return createResponse(500, { message: error.message });
  }
};

export const getLeadHistory = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const leadId = event.pathParameters?.id;
    if (!leadId) return createResponse(400, { message: "Lead ID is required" });

    const history = await getHistoryUseCase.execute(leadId);
    return createResponse(200, history);
  } catch (error: any) {
    return createResponse(500, { message: error.message });
  }
};

export const getLeadById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;
    if (!id) return createResponse(400, { message: "ID is required" });

    const lead = await getLeadByIdUseCase.execute(id);
    if (!lead) return createResponse(404, { message: "Lead not found" });

    return createResponse(200, lead);
  } catch (error: any) {
    return createResponse(500, { message: error.message });
  }
};

export const deleteLead = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;
    if (!id) return createResponse(400, { message: "ID is required" });

    await deleteLeadUseCase.execute(id);
    return createResponse(200, { message: "Lead deleted successfully" });
  } catch (error: any) {
    return createResponse(500, { message: error.message });
  }
};

export const updateLead = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;
    if (!id) return createResponse(400, { message: "ID is required" });

    const body = JSON.parse(event.body || "{}");
    const updatedLead = await updateLeadUseCase.execute(id, body);
    
    return createResponse(200, updatedLead);
  } catch (error: any) {
    return createResponse(500, { message: error.message });
  }
};
