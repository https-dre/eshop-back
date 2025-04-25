import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { GetProducts, GetProductsSchema } from "./controllers/get-products.controller";

export const register_router = (app: FastifyInstance) => {
    const router = app.withTypeProvider<ZodTypeProvider>()

    router.get(
        "/",
        {
            schema: {
                response: {
                    200: z.string()
                }
            }
        },
        (req, reply) => {
            reply.status(200).send("hello world!");
        }
    );

    router.route({
        method: "get",
        url: "/products",
        schema: GetProductsSchema,
        handler: GetProducts
    })
}