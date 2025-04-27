import postgres from "postgres";
import { Product } from "../models";

export class ProductsRepository {
    constructor(private sql: postgres.Sql) {}

    public async get_products(limit: number, offset: number): Promise<Product[]> {
        const result = await this.sql<Product[]>`
            SELECT *
            FROM products
            LIMIT ${limit} OFFSET ${offset}
        `;

        return result;
    }

    public async select_by_id(id: string): Promise<Product | null> {
        const result = await this.sql<Product[]>`
            SELECT * FROM products WHERE id = ${id}
        `

        if (result.length > 0) {
            return result[0];
        }
        return null;
    }
}
