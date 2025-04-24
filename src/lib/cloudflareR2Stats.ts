import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

const s3 = new S3Client({
  endpoint: process.env.R2_ENDPOINT!,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

async function streamToString(stream: Readable): Promise<string> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
}

export async function saveStatsJsonToR2(filename: string, json: object) {
  const params = {
    Bucket: process.env.R2_BUCKET!,
    Key: filename,
    Body: JSON.stringify(json, null, 2),
    ContentType: 'application/json',
  };
  await s3.send(new PutObjectCommand(params));
  console.log(`[R2] 保存完了: ${filename}`);
}

export async function loadStatsJsonFromR2(
  filename: string
): Promise<Record<string, { subscribers: number; views: number }> | null> {
  try {
    const data = await s3.send(new GetObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: filename,
    }));
    if (!data.Body) return null;
    return JSON.parse(await streamToString(data.Body as Readable));
  } catch (err) {
    console.warn(`[R2] 取得失敗: ${filename}`, err);
    return null;
  }
}
