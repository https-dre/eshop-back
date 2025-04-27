import postgres from "postgres";
import { sql } from "../db/client";
import { ProductImage } from "../models";

export class ProductImageRepository {
    private db: postgres.Sql

    constructor(client: postgres.Sql) {
        this.db = client;
    }

    public async save_image(data: ProductImage): Promise<void> {
        const result = await this.db<ProductImage[]>`
            INSERT INTO images (id, name, local, product_id)
            VALUES (${data.id}, ${data.name}, ${data.local}, ${data.product_id})
        `
    }
}