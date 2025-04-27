import { MultipartFile } from "@fastify/multipart";
import { randomUUID } from "crypto";
import { Readable } from "stream";

const url = `https://${process.env.SUPABASE_ID}.supabase.co/`

async function streamToBuffer(stream: Readable): Promise<Buffer> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
        chunks.push(chunk as Buffer);
    }

    return Buffer.concat(chunks);
}

export async function UploadFileService
    (data: MultipartFile): Promise<number> {
    const filename = `${randomUUID()}_${data.filename.replace(/\s+/g, '_').toLowerCase()}`;
    const buffer = await streamToBuffer(data.file)

    const response = await fetch(`${url}/storage/v1/object/product-image/${filename}`, {
        method: "POST",
        body: buffer,
        headers: {
            "Content-Type": data.mimetype || 'application/octet-stream',
            "Authorization": `Bearer ${process.env.SERVICE_ROLE as string}`,
            "Cache-Control": "max-age=3600"
        }
    });
    
    return response.status;
}

