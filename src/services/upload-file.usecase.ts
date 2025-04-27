import { MultipartFile } from "@fastify/multipart";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";
import { pipeline } from "stream/promises";

export async function UploadFileService
    (data: MultipartFile): Promise<void> {
        const new_name = randomUUID() + data.filename.replaceAll(' ', '_').toLocaleLowerCase();
        
        await pipeline(
            data.file,
            fs.createWriteStream(`./bucket/${new_name}`)
        )
}

