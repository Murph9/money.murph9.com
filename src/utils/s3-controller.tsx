import {S3Client, GetObjectCommand, PutObjectCommand} from '@aws-sdk/client-s3';

export class AwsS3Config {
    apiKey: string;
    apiSecret: string;
    bucketRegion: string;
    bucketName: string;
}

export default class AwsS3Service {
    config: AwsS3Config;
    s3: S3Client;
    folders: any;

    constructor(config: AwsS3Config) {
        this.config = config;

        this.s3 = new S3Client({
            credentials: {accessKeyId: this.config.apiKey, secretAccessKey: this.config.apiSecret},
            region: this.config.bucketRegion
        });
    }

    async getFile(file: string, success: (obj: any) => void, failure: (err: string) => void) {
        console.log("getting file: " + file);
        var command = new GetObjectCommand({Bucket: this.config.bucketName, Key: file, ResponseExpires: new Date()});
        try {
            const res = await this.s3.send(command);
            if (!res.Body) {
                throw new Error("S3 result empty");
            }
            const a = await res.Body.transformToString();
            success({fileName: file, obj: JSON.parse(a)});
        } catch (err) {
            console.log("Failed to get file", err);
            if (err.name === "NoSuchKey") {
                // if the file doesn't exist yet, try and create it
                this.saveFile(file, [], () => success("[]"), (message) => failure(message));
            } else {
                failure(err.message);
            }
        }
    }

    async saveFile(file: string, content: object, success: (err: object) => void, failure: (err: string) => void) {
        console.log("saving file: " + file);
        var command = new PutObjectCommand({Bucket: this.config.bucketName, Key: file, Body: JSON.stringify(content), ContentType: "application/json"});

        try {
            await this.s3.send(command);
            success(content);
        } catch (err) {
            failure(err.message);
        }
    }
}
