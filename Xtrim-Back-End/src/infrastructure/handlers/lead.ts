import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { PrismaLeadRepository } from "../persistence/PrismaLeadRepository";
import { CreateLeadUseCase } from "@application/use-cases/CreateLeadUseCase";
import { GetLeadsUseCase } from "@application/use-cases/GetLeadsUseCase";
import { UpdateLeadUseCase } from "@application/use-cases/UpdateLeadUseCase";
import { GetSalesKPIUseCase } from "@application/use-cases/GetSalesKPIUseCase";

// Setup
const repo = new PrismaLeadRepository();
const createLeadUseCase = new CreateLeadUseCase(repo);
const getLeadsUseCase = new GetLeadsUseCase(repo);
const updateLeadUseCase = new UpdateLeadUseCase(repo);
const getSalesKPIUseCase = new GetSalesKPIUseCase(repo);

const createResponse = (statusCode: number, body: any): APIGatewayProxyResult => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const createLead = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || "{}");
    const lead = await createLeadUseCase.execute(body);
    return createResponse(201, lead);
  } catch (error: any) {
    return createResponse(500, { message: error.message });
  }
};

export const getLeads = async (): Promise<APIGatewayProxyResult> => {
  try {
    const leads = await getLeadsUseCase.execute();
    return createResponse(200, leads);
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
    
    if (!updatedLead) return createResponse(404, { message: "Lead not found" });
    return createResponse(200, updatedLead);
  } catch (error: any) {
    return createResponse(500, { message: error.message });
  }
};

export const getSalesKPI = async (): Promise<APIGatewayProxyResult> => {
  try {
    const kpi = await getSalesKPIUseCase.execute();
    return createResponse(200, kpi);
  } catch (error: any) {
    return createResponse(500, { message: error.message });
  }
};
