import { Product, ProductImage } from "./models";

export interface ProductRepo {
    get_products(limit: number, offset?: number): Promise<Product[]>;
    select_by_id(id: string): Promise<Product | null>;
}

export interface ProductImageRepo {
    save_image(data: ProductImage): Promise<void>;
    select_by_product_id(limit: number, page: number, product_id: string): Promise<ProductImage[]>;
}