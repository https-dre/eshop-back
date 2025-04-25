import { Product } from "./models";

export interface ProductRepo {
    get_products(limit: number, page?: number): Promise<Product[]>;
}
