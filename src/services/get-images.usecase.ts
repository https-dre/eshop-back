import { ProductImage } from "../models";
import { ProductImageRepo } from "../protocols";

type params = {
    limit: number,
    page: number,
    product_id: string
}

export const GetImagesUseCase =
    async (repo: ProductImageRepo, data: params): Promise<Pick<ProductImage, 'id' | 'local'>[]> => {
        const result = await repo.select_by_product_id(data.limit, data.page, data.product_id);

        return result.map(img => {
            return {
                id: img.id,
                local: `https://${process.env.SUPABASE_ID}.supabase.co/storage/v1/object/public/${img.local}`
            }
        })
    }