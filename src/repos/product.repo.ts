import postgres from "postgres";
import { Product } from "../models";

export class ProductsRepository {
    constructor(private sql: postgres.Sql) {}

    public async get_products(limit: number, page: number): Promise<Product[]> {
        const result = await this.sql<Product[]>`
            SELECT *
            FROM products
            LIMIT ${limit} OFFSET ${page}
        `;

        return result;
    }
}
