export interface Product {
  id?: string;
  title: string;
  price: number;
  category: string;
  features: string[];
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
