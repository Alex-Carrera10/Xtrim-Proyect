import { Material } from "../entities/Material";

export interface MaterialRepository {
  create(material: Material): Promise<Material>;
  findAll(): Promise<Material[]>;
  findById(id: string): Promise<Material | null>;
  update(id: string, material: Partial<Material>): Promise<Material | null>;
  delete(id: string): Promise<boolean>;
}
