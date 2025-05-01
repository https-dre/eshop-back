import postgres from "postgres"
import { User } from "../models";
import { DatabaseError } from "../error-handler";

export class UserRepository {
    private db: postgres.Sql;

    constructor(conn: postgres.Sql) {
        this.db = conn;
    }

    public async save(user: User): Promise<void> {
        try {
            await this.db`
                INSERT INTO users 
                VALUES (${user.id}, ${user.name}, ${user.email}, ${user.cpf}, ${user.password_hash})
            `
        } catch (error: any) {
            throw new DatabaseError(error.message)
        }
    }

    public async select_by_email(email: string): Promise<User | null> {
        try {
            const result = await this.db<User[]>`SELECT * FROM users WHERE email = ${email}`
            if (result.length != 0) {
                return result[0];
            }

            return null
        } catch (error: any) {
            throw new DatabaseError(error.message)
        }
    }
}