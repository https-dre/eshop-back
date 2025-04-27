import { MultipartFile } from "@fastify/multipart";
import { randomUUID } from "crypto";
import { Readable } from "stream";
import { ProductImageRepo } from "../protocols";
import { ProductImage } from "../models";

const url = `https://${process.env.SUPABASE_ID}.supabase.co/`

async function streamToBuffer(stream: Readable): Promise<Buffer> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
        chunks.push(chunk as Buffer);
    }

    return Buffer.concat(chunks);
}

type UploadServiceResult = {
    bucket_status: number,
    message?: string
}

export async function UploadFileService
    (repo: ProductImageRepo, data: MultipartFile, product_id: string): Promise<UploadServiceResult> {
    const id = randomUUID();
    const filename = `${id}_${data.filename.replace(/\s+/g, '_').toLowerCase()}`;
    const buffer = await streamToBuffer(data.file);

    const image: ProductImage = {
        id,
        name: filename,
        local: `product-image/${filename}`,
        product_id
    };

    try {
        await repo.save_image(image);
    } catch {
        return {
            bucket_status: 500,
            message: 'DATABASE ERROR'
        }
    }
    
    const response = await fetch(`${url}/storage/v1/object/product-image/${filename}`, {
        method: "POST",
        body: buffer,
        headers: {
            "Content-Type": data.mimetype || 'application/octet-stream',
            "Authorization": `Bearer ${process.env.SERVICE_ROLE as string}`,
            "Cache-Control": "max-age=3600"
        }
    });

    if (!response.ok) {
        return {
            bucket_status: 400,
            message: 'CLOUD BUCKET ERROR'
        }
    }

    return {
        bucket_status: 201
    }
}