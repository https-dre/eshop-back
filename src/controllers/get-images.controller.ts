import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from 'zod';
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { ProductImageRepository } from "../repos/productimage.repo";
import { sql } from "../db/client";
import { GetImagesUseCase } from "../services/get-images.usecase";
import { ProductsRepository } from "../repos/product.repo";

const schema = {
    summary: 'Select product images by product id',
    querystring: z.object({
        page: z.coerce.number().int().optional().default(1),
        limit: z.coerce.number().int().optional().default(10)
    }),
    params: z.object({
        id: z.string().uuid()
    }),

    response: {
        404: z.object({
            message: z.string()
        }),
        200: z.object({
            count: z.number().int(),
            result: z.array(
                z.object({
                    id: z.string().uuid(),
                    local: z.string()
                })
            )
        })
    }
};

const handler = async (req: FastifyRequest, reply: FastifyReply) => {
    const { page, limit } = req.query as { page: number, limit: number };
    const { id } = req.params as { id: string };

    const product_repo = new ProductsRepository(sql);
    const product = await product_repo.select_by_id(id);

    if (!product) {
        reply.code(404).send({ message: 'Product not found!'})
        return;
    }

    const repo = new ProductImageRepository(sql);
    const result = await GetImagesUseCase(repo, { limit, page, product_id: id });

    reply.code(200).send({ count: result.length, result });
};

export const GetImagesController = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>()
        .get('/product-image/:id', { schema }, handler);
};
