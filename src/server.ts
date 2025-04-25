import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { validatorCompiler, serializerCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
import { register_router } from "./router";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
    origin: "*"
});

app.register(register_router)

if (!process.env.PORT) throw new Error("Missing PORT");

app.listen({ port: parseInt(process.env.PORT)}).then(() => {
    console.log("Server running in port: ", process.env.PORT)
})