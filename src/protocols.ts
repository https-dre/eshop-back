import { Product, ProductImage } from "./models";

export interface ProductRepo {
    get_products(limit: number, offset?: number): Promise<Product[]>;
}

export interface ProductImageRepo {
    save_image(data: ProductImage): Promise<void>;
}