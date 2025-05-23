import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { UploadFileService } from "../services/upload-file.usecase";
import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { ProductImageRepository } from "../repos/productimage.repo";
import { sql } from "../db/client";

const UploadImage_Schema = {
  params: z.object({
    product_id: z.string().uuid()
  }),
  summary: 'Send a file with multipart/form-data',
  response: {
    201: z.object({
      details: z.string()
    }),
    500: z.object({
      details: z.string()
    }),
    400: z.object({
      details: z.string()
    })
  }
}

const handler = async (req: FastifyRequest, reply: FastifyReply) => {
    const contentType = req.headers['content-type'];
    if (!contentType?.includes('multipart/form-data')) {
      return reply.code(400).send('Content-Type inválido!')
    }

    const file = await req.file();
    if (!file) return reply.code(400).send('Nenhum arquivo foi enviado!')

    const { product_id } = req.params as { product_id: string };

    const repo = new ProductImageRepository(sql);

    const result = await UploadFileService(repo, file, product_id);

    if (![200, 201].includes(result.bucket_status)) {
      reply.code(result.bucket_status).send({ details: result.message });
      return;
    }

    reply.code(201).send({ details: "File uploaded!" })
}

export const UploadImage = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>()
      .post('/product-image/:product_id', { schema: UploadImage_Schema }, handler)
}