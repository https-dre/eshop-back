import { Product } from "../models";
import { ProductRepo } from "../protocols";

type ListProducts_Result = {
    id: string,
    name: string,
    description: string,
    price_in_cents: number
}

export async function ListProductsService
    (repo: ProductRepo, limit: number, page: number): Promise<ListProducts_Result[]> {
    const offset = page == 1 ? 0 : page * limit;
    const result = await repo.get_products(limit, offset);

    return result.map(p => {
        return {
            id: p.id,
            name: p.name,
            description: p.description,
            price_in_cents: p.price_in_cents
        }
    })
}
