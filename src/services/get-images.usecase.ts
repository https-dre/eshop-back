import { ProductImage } from "../models";
import { ProductImageRepo } from "../protocols";

type params = {
    limit: number,
    page: number,
    product_id: string
}

export const GetImagesUseCase = 
    async (repo: ProductImageRepo, data: params): Promise<Pick<ProductImage, 'id'>[]> => {
        const result = await repo.select_by_product_id(data.limit, data.page, data.product_id);

        return result.map(img => ({id: img.id}))
}