import { randomUUID } from "crypto";
import { sql } from "./client";
import { fakerPT_BR as faker } from "@faker-js/faker";
import { Readable, Writable } from "stream";
import { pipeline } from "stream/promises";

const BATCH_SIZE = 10_000;
const BATCH_LIMIT = 20;

const populate_products = async () => {
    await sql`TRUNCATE TABLE products CASCADE`;

    console.time("products-to-insert")
    const productsToInsert = Array.from({ length: BATCH_LIMIT }, () => (
        Array.from({ length: BATCH_SIZE }, () => ({
            id: randomUUID(),
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price_in_cents: faker.number.int({ min: 100, max: 10_000 }),
            created_at_utc: new Date().toUTCString()
        })
        )
    ));
    console.timeEnd("products-to-insert")

    const reader = Readable.from(productsToInsert, { objectMode: true });
    const writer = new Writable({
        objectMode: true,
        async write(chunk, _, callback) {
            await sql`INSERT INTO products ${sql(chunk)}`
            callback();
        }
    });

    console.time("populando-products")
    await pipeline(
        reader,
        writer
    );
    console.timeEnd("populando-products")
}

const populate_images = async () => {
    console.time('images-to-insert');
    await sql`TRUNCATE TABLE images CASCADE`;

    const products = await sql`SELECT id FROM products`;
    let current_p_index = 0;

    let batch = Array.from({ length: BATCH_LIMIT }, () => {
        let chunk = [];
        for (let i = 0; i < BATCH_SIZE; i++) {
            chunk.push({
                id: randomUUID(),
                name: 'sem_nome',
                local: 'bucket/sem_nome.jpeg',
                product_id: products[current_p_index].id
            })
            current_p_index++;
        }
        return chunk;
    });
    console.timeEnd('images-to-insert')


    const readable = Readable.from(batch, { objectMode: true });
    const writable = new Writable({
        objectMode: true,
        async write(chunk, _, callback) {
            await sql`INSERT INTO images ${sql(chunk)}`
            callback();
        }
    });

    console.time('populando-images')
    await pipeline(
        readable,
        writable
    )
    console.timeEnd('populando-images')
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
            local TEXT NOT NULL,
            product_id TEXT NOT NULL,
            FOREIGN KEY (product_id) REFERENCES products(id)
        )
    `

    if (process.env.TEST_DATABASE) {
        await populate_products();
        await populate_images();
    }

    sql.end();
}

seed();