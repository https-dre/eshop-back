import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { UploadFileService } from "../services/upload-file.usecase";
import z from "zod";
import fastifyMultipart from "@fastify/multipart";
import { ZodTypeProvider } from "fastify-type-provider-zod";

const UploadImage_Schema = {

}

const handler = async (req: FastifyRequest, reply: FastifyReply) => {
    const contentType = req.headers['content-type'];
    if (!contentType?.includes('multipart/form-data')) {
      throw new Error('Content-Type inválido');
    }

    const file = await req.file();
    if (!file) throw new Error('Nenhum arquivo foi enviado!');
    await UploadFileService(file);

    reply.code(201).send({ details: "file uploaded!"})
}

export const UploadImage = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>()
        .post('/product-image', { schema: UploadImage_Schema }, handler)
}