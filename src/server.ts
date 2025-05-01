import fastify from "fastify";
import {
	validatorCompiler,
	serializerCompiler,
	jsonSchemaTransform,
} from "fastify-type-provider-zod";
import fastifyMultipart from "@fastify/multipart";

import { GetProducts } from "./controllers/get-products.controller";
import { UploadImage } from "./controllers/upload-image.controller";
import { GetImagesController } from "./controllers/get-images.controller";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { errorHandler } from "./error-handler";
import { CreateUserController } from "./controllers/create-user.controller";

const app = fastify({
	ignoreTrailingSlash: true,
});

const env = [
	process.env.PORT,
	process.env.SUPABASE_ID,
	process.env.SERVICE_ROLE,
	process.env.ANON_KEY,
	process.env.DATABASE_URL,
];

for (const e of env) {
	if (!e) {
		throw new Error("Missing env configs");
	}
}

const run = async () => {
	await app.register(fastifyMultipart);

	await app.register(fastifySwagger, {
		swagger: {
			consumes: ["application/json", "multipart/form-data"],
			produces: ["appplication/json"],
			info: {
				title: "E-commerce with https-dre",
				description: "...",
				version: "1.0.0",
			},
		},
		transform: jsonSchemaTransform,
	});

	await app.register(fastifySwaggerUi, {
		routePrefix: "/docs",
	});

	app.setValidatorCompiler(validatorCompiler);
	app.setSerializerCompiler(serializerCompiler);

	app.register(import("@fastify/cors"));

	app.setErrorHandler(errorHandler);

	await app.register(GetProducts);
	await app.register(UploadImage);
	await app.register(GetImagesController);
	await app.register(CreateUserController);

	if (!process.env.PORT) throw new Error("Missing PORT");

	app.listen({ port: parseInt(process.env.PORT) }).then(() => {
		console.log("Server running in port: ", process.env.PORT);
	});
};

run();
