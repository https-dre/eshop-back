import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { ProductsRepository } from "../repos/product.repo";
import { sql } from "../db/client";
import { ListProductsService } from "../services/get-product.usecase";
import { ZodTypeProvider } from "fastify-type-provider-zod";

const schema = {
    querystring: z.object({
        limit: z.coerce.number().int().positive().default(10),
        page: z.coerce.number().int().default(0)
    }),
    response: {
        200: z.object({
            count: z.number().int().positive(),
            results: z.array(
                z.object({
                    id: z.string(),
                    name: z.string(),
                    description: z.string(),
                    price_in_cents: z.number().int().positive()
                })
            )
        }),
        500: z.string(),
        404: z.object({
            message: z.string()
        })
    }
}

const handler = async (req: FastifyRequest, reply: FastifyReply) => {
    const { page, limit } = req.query as { page: number, limit: number };
    const repo = new ProductsRepository(sql);

    const result = await ListProductsService(repo, limit, page);

    if (result.length == 0) {
        reply.status(404).send({ message: "Products not found" })
        return;
    }

    reply.status(200).send({
        count: result.length,
        results: result
    })
}

export const GetProducts = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>()
        .get('/products', { schema }, handler)
}

