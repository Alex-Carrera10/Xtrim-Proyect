import { APIGatewayProxyResult } from "aws-lambda";
import { PrismaLeadRepository } from "../persistence/PrismaLeadRepository";
import {
  CreateLeadUseCase,
  GetLeadsUseCase,
  UpdateLeadUseCase,
  GetSalesKPIUseCase,
  GetNewLeadsCountUseCase
} from "@application/use-cases/lead";
import { authGuard } from "../middleware/authGuard";

// Setup
const repo = new PrismaLeadRepository();
const createLeadUseCase = new CreateLeadUseCase(repo);
const getLeadsUseCase = new GetLeadsUseCase(repo);
const updateLeadUseCase = new UpdateLeadUseCase(repo);
const getSalesKPIUseCase = new GetSalesKPIUseCase(repo);
const getNewLeadsCountUseCase = new GetNewLeadsCountUseCase(repo);

const createResponse = (statusCode: number, body: any): APIGatewayProxyResult => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const createLead = authGuard(async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const lead = await createLeadUseCase.execute(body);
    return createResponse(201, lead);
  } catch (error: any) {
    return createResponse(500, { message: error.message });
  }
});

export const getLeads = authGuard(async () => {
  try {
    const leads = await getLeadsUseCase.execute();
    return createResponse(200, leads);
  } catch (error: any) {
    return createResponse(500, { message: error.message });
  }
});

export const updateLead = authGuard(async (event) => {
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
});

export const getSalesKPI = authGuard(async () => {
  try {
    const salesKpi = await getSalesKPIUseCase.execute();
    const newLeadsCount = await getNewLeadsCountUseCase.execute();
    return createResponse(200, {
      totalSales: salesKpi.totalSales,
      newLeadsCount
    });
  } catch (error: any) {
    return createResponse(500, { message: error.message });
  }
});
