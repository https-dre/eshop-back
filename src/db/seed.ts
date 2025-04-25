import { randomUUID } from "crypto";
import { sql } from "./client";
import { fakerPT_BR as faker } from "@faker-js/faker";
import { Readable, Writable } from "stream";
import { pipeline } from "stream/promises";

const populate = async () => {
    await sql`TRUNCATE TABLE products`;

    console.time("products-to-insert")
    const productsToInsert = Array.from({ length: 20 }, () => (
        Array.from({ length: 10_000 }, () => ({
            id: randomUUID(),
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price_in_cents: faker.number.int({ min: 100, max: 10_000 }),
            created_at_utc: new Date().toUTCString()
        }))
    ));
    console.timeEnd("products-to-insert")

    const reader = Readable.from(productsToInsert, { objectMode: true });
    const writer = new Writable({
        objectMode: true,
        async write(chunk, encoding, callback) {
            await sql`INSERT INTO products ${sql(chunk)}`
            callback();
        }
    });

    console.time("pipeline-time")
    await pipeline(
        reader,
        writer
    );
    console.timeEnd("pipeline-time")
}

const seed = async () => {
    await sql/* sql */`
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name VARCHAR(300) NOT NULL,
            description TEXT NOT NULL,
            price_in_cents INTEGER DEFAULT 0,
            created_at_utc TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `

    await sql/* sql */`
        CREATE TABLE IF NOT EXISTS images (
            id TEXT PRIMARY KEY,
            name VARCHAR(300) NOT NULL,
            local TEXT NOT NULL
        )
    `

    if(process.env.TEST_DATABASE) {
        await populate()
    }

    sql.end();
}

seed();