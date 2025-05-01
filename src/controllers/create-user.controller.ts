import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { UserRepository } from "../repos/user.repo";
import { sql } from "../db/client";
import { randomUUID } from "crypto";
import { hashPassword } from "../crypto";

const schema = {
	body: z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string(),
		cpf: z.string().max(11).min(11),
	}),
	response: {
		201: z.object({
			details: z.string(),
			user_id: z.string().uuid(),
		}),
		400: z.object({
			details: z.string(),
		}),
	},
	summary: "Create users",
	tags: ["users"],
};

export const CreateUserController = async (app: FastifyInstance) => {
	app
		.withTypeProvider<ZodTypeProvider>()
		.post("/users", { schema }, async (req, reply) => {
			const { password, email } = req.body;
			const repo = new UserRepository(sql);

			if (password.length < 8) {
				return reply
					.code(400)
					.send({ details: 'Password length must be bigger than 8' })
			}

			const user_with_email = await repo.select_by_email(email);

			if (user_with_email) {
				return reply
					.code(400)
					.send({ details: `An user with email ${email} already exists!` });
			}

			const user_id = randomUUID();

			const user = {
				id: user_id as string,
				...req.body,
				password_hash: await hashPassword(req.body.password),
			};

			await repo.save(user);

			return reply.code(201).send({ details: "user created!", user_id });
		});
};
