import prisma from "../config/prisma";
import { Material } from "../../domain/entities/Material";
import { MaterialRepository } from "../../domain/repositories/MaterialRepository";

export class PrismaMaterialRepository implements MaterialRepository {
  async create(material: Material): Promise<Material> {
    const created = await prisma.material.create({
      data: {
        name: material.name,
        type: material.type,
        description: material.description,
        image: material.image,
      },
    });
    return this.mapToEntity(created);
  }

  async findAll(): Promise<Material[]> {
    const materials = await prisma.material.findMany({
      orderBy: { createdAt: "desc" },
    });
    return materials.map(m => this.mapToEntity(m));
  }

  async findById(id: string): Promise<Material | null> {
    const material = await prisma.material.findUnique({ where: { id } });
    return material ? this.mapToEntity(material) : null;
  }

  async update(id: string, material: Partial<Material>): Promise<Material | null> {
    const updated = await prisma.material.update({
      where: { id },
      data: {
        name: material.name,
        type: material.type,
        description: material.description,
        image: material.image,
      },
    });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    await prisma.material.delete({ where: { id } });
    return true;
  }

  private mapToEntity(data: any): Material {
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      description: data.description,
      image: data.image || undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
