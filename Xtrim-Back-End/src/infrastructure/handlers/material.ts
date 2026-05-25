import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { authGuard } from "../middleware/authGuard";
import { PrismaMaterialRepository } from "../persistence/PrismaMaterialRepository";
import {
  CreateMaterialUseCase,
  GetMaterialsUseCase,
  GetMaterialByIdUseCase,
  UpdateMaterialUseCase,
  DeleteMaterialUseCase,
} from "@application/use-cases/material";

const repo = new PrismaMaterialRepository();
const createMaterialUseCase = new CreateMaterialUseCase(repo);
const getMaterialsUseCase = new GetMaterialsUseCase(repo);
const getMaterialByIdUseCase = new GetMaterialByIdUseCase(repo);
const updateMaterialUseCase = new UpdateMaterialUseCase(repo);
const deleteMaterialUseCase = new DeleteMaterialUseCase(repo);

const createResponse = (statusCode: number, body: any): APIGatewayProxyResult => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const createMaterial = authGuard(async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const material = await createMaterialUseCase.execute(body);
    return createResponse(201, material);
  } catch (error: any) {
    return createResponse(500, { message: error.message });
  }
});

export const getMaterials = async (): Promise<APIGatewayProxyResult> => {
  try {
    const materials = await getMaterialsUseCase.execute();
    return createResponse(200, materials);
  } catch (error: any) {
    return createResponse(500, { message: error.message });
  }
};

export const getMaterialById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;
    if (!id) return createResponse(400, { message: "ID is required" });

    const material = await getMaterialByIdUseCase.execute(id);
    if (!material) return createResponse(404, { message: "Material not found" });
    return createResponse(200, material);
  } catch (error: any) {
    return createResponse(500, { message: error.message });
  }
};

export const updateMaterial = authGuard(async (event) => {
  try {
    const id = event.pathParameters?.id;
    if (!id) return createResponse(400, { message: "ID is required" });

    const body = JSON.parse(event.body || "{}");
    const updated = await updateMaterialUseCase.execute(id, body);
    if (!updated) return createResponse(404, { message: "Material not found" });
    return createResponse(200, updated);
  } catch (error: any) {
    return createResponse(500, { message: error.message });
  }
});

export const deleteMaterial = authGuard(async (event) => {
  try {
    const id = event.pathParameters?.id;
    if (!id) return createResponse(400, { message: "ID is required" });

    const success = await deleteMaterialUseCase.execute(id);
    if (!success) return createResponse(404, { message: "Material not found" });
    return createResponse(200, { message: "Material deleted successfully" });
  } catch (error: any) {
    return createResponse(500, { message: error.message });
  }
});
