import fastify from "fastify";
import { validatorCompiler, serializerCompiler }
    from "fastify-type-provider-zod";
import { GetProducts } from "./controllers/get-products.controller";
import { UploadImage } from "./controllers/upload-image.controller";
import fastifyMultipart from "@fastify/multipart";

const app = fastify({
    ignoreTrailingSlash: true
});

const env = [process.env.PORT, process.env.SUPABASE_ID, 
    process.env.SERVICE_ROLE, process.env.ANON_KEY, process.env.DATABASE_URL];

for (const e of env) {
    if (!e) {
        throw new Error('Missing env configs');
    }
}

const run = async () => {
    await app.register(fastifyMultipart)

    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    app.register(import('@fastify/cors'))

    app.addHook('onError', (_, reply, error, done) => {
        console.log(error);
        reply.status(500).send(error)
    });

    await app.register(GetProducts);
    await app.register(UploadImage);

    if (!process.env.PORT) throw new Error("Missing PORT");

    app.listen({ port: parseInt(process.env.PORT) }).then(() => {
        console.log("Server running in port: ", process.env.PORT)
    })
}

run();