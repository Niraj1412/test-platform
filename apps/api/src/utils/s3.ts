import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { AppError } from './appError.js'

const createClient = () =>
  new S3Client({
    region: process.env.S3_REGION ?? 'us-east-1',
    endpoint: process.env.S3_ENDPOINT || undefined,
    forcePathStyle: Boolean(process.env.S3_ENDPOINT),
    credentials:
      process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY
        ? {
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
          }
        : undefined
  })

export const uploadBufferToS3 = async (key: string, body: Buffer, contentType: string) => {
  const bucket = process.env.S3_BUCKET
  if (!bucket) {
    throw new AppError(500, 'S3_NOT_CONFIGURED', 'S3 bucket is not configured')
  }

  const client = createClient()
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType
    })
  )

  if (process.env.S3_PUBLIC_BASE_URL) {
    return `${process.env.S3_PUBLIC_BASE_URL.replace(/\/$/, '')}/${key}`
  }

  return getSignedUrl(
    client,
    new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType }),
    { expiresIn: 3600 }
  )
}
