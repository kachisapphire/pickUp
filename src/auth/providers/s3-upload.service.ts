import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "crypto";

@Injectable()
export class S3UploadService {
    private readonly logger = new Logger(S3UploadService.name)
    private readonly s3: S3Client;
    private readonly bucketName: string;
    private readonly region: string
    constructor(
        private readonly configService: ConfigService,
    ) {
        this.region = this.configService.get<string>('AWS_REGION')
        if (!this.region) {
            this.logger.error('AWS_REGION not configured in environment variables')
        }
        this.s3 = new S3Client({
            region: this.region,
            credentials: {
                accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY')
            }
        });
        this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME')
        if (!this.bucketName) {
            this.logger.error('AWS_S3_BUCKET_NAME not configured in envirnonment variables')
        }
    }

    async uploadImage(
        fileData: Express.Multer.File,
        fileNamePrefix: string
    ) {
        try {
            const key = `${fileNamePrefix}-${randomUUID()}`;
            const command = {
                Bucket: this.bucketName,
                Key: key,
                Body: fileData.buffer,
                ContentType: fileData.mimetype,
                //ACL: 'public-read'
            }
            await this.s3.send(new PutObjectCommand(command));
            return {
                url: `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`,
                key
            }
        }
        catch (error) {
            this.logger.error(`Failed to upload to s3: ${error.message}`, error.stack);
            return {
                message: 'Error uploading to s3',
                success: false
            }
        }
    }

    async deleteImage(key: string, bucketName) {
        try {
            bucketName = this.bucketName
            const command = {
                Bucket: bucketName,
                Key: key,
            }
            await this.s3.send(new DeleteObjectCommand(command));
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to delete image: ${error.message}`, error.stack);
            throw error
        }
    }

    async deleteMultipleImages(keys: string[]) {
        try {
            const bucketName = this.bucketName;
            const images = keys.map((key) => this.deleteImage(key, bucketName));
            await Promise.all(images);
            return true
        }
        catch (error) {
            this.logger.error(`Failed to delete images: ${error.message}`, error.stack);
            throw error;
        }
    }
}