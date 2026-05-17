import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { PrismaProductRepository } from "../persistence/PrismaProductRepository";
import { CreateProductUseCase } from "@application/use-cases/CreateProductUseCase";
import { GetProductsUseCase } from "@application/use-cases/GetProductsUseCase";
import { GetProductByIdUseCase } from "@application/use-cases/GetProductByIdUseCase";
import { UpdateProductUseCase } from "@application/use-cases/UpdateProductUseCase";
import { DeleteProductUseCase } from "@application/use-cases/DeleteProductUseCase";

// Setup
const repo = new PrismaProductRepository();
const createProductUseCase = new CreateProductUseCase(repo);
const getProductsUseCase = new GetProductsUseCase(repo);
const getProductByIdUseCase = new GetProductByIdUseCase(repo);
const updateProductUseCase = new UpdateProductUseCase(repo);
const deleteProductUseCase = new DeleteProductUseCase(repo);

const createResponse = (statusCode: number, body: any): APIGatewayProxyResult => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const createProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || "{}");
    const product = await createProductUseCase.execute(body);
    return createResponse(201, product);
  } catch (error: any) {
    return createResponse(500, { message: error.message });
  }
};

export const getProducts = async (): Promise<APIGatewayProxyResult> => {
  try {
    const products = await getProductsUseCase.execute();
    return createResponse(200, products);
  } catch (error: any) {
    return createResponse(500, { message: error.message });
  }
};

export const getProductById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;
    if (!id) return createResponse(400, { message: "ID is required" });
    
    const product = await getProductByIdUseCase.execute(id);
    if (!product) return createResponse(404, { message: "Product not found" });
    return createResponse(200, product);
  } catch (error: any) {
    return createResponse(500, { message: error.message });
  }
};

export const updateProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;
    if (!id) return createResponse(400, { message: "ID is required" });
    
    const body = JSON.parse(event.body || "{}");
    const updatedProduct = await updateProductUseCase.execute(id, body);
    
    if (!updatedProduct) return createResponse(404, { message: "Product not found" });
    return createResponse(200, updatedProduct);
  } catch (error: any) {
    return createResponse(500, { message: error.message });
  }
};

export const deleteProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;
    if (!id) return createResponse(400, { message: "ID is required" });
    
    const success = await deleteProductUseCase.execute(id);
    if (!success) return createResponse(404, { message: "Product not found" });
    return createResponse(200, { message: "Product deleted successfully" });
  } catch (error: any) {
    return createResponse(500, { message: error.message });
  }
};
