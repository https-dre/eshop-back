import postgres from "postgres";
import { sql } from "../db/client";
import { ProductImage } from "../models";

export class ProductImageRepository {
    private db: postgres.Sql

    constructor(client: postgres.Sql) {
        this.db = client;
    }

    public async save_image(data: ProductImage): Promise<void> {
        await this.db<ProductImage[]>`
            INSERT INTO images (id, name, local, product_id)
            VALUES (${data.id}, ${data.name}, ${data.local}, ${data.product_id})
        `
    }

    public async select_by_product_id(limit: number, page: number, product_id: string): Promise<ProductImage[]> {
        const offset_d = page == 1 ? 0 : page * limit;

        const result = await this.db<ProductImage[]>`
            SELECT * FROM images WHERE product_id = ${product_id} 
            LIMIT ${limit} OFFSET ${offset_d}
        `;

        return result;
    }
}