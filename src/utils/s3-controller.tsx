import AWS from 'aws-sdk';

export class AwsS3Config {
    apiKey: string;
    apiSecret: string;
    bucketSite: string;
    bucketName: string;
}

export default class AwsS3Service {
    config: AwsS3Config;
    s3: AWS.S3;
    folders: any;

    constructor(config: AwsS3Config) {
        this.config = config;

        AWS.config.credentials = new AWS.Credentials(this.config.apiKey, this.config.apiSecret);
        AWS.config.update({ region: this.config.bucketSite });
        
        this.s3 = new AWS.S3({
            apiVersion: '2006-03-01',
            params: { Bucket: this.config.bucketName}
        });
    }

    getFile(file: string, success: (obj: any) => void, failure: (err: string) => void) {
        console.log("getting file: " + file);
        const that = this;
        var req = this.s3.getObject({ Bucket: this.config.bucketName, Key: file });

        const now = new Date();
        now.setDate(now.getDate() - 5);
        req.on('build', function() {
            req.httpRequest.headers['If-Modified-Since'] = now.toISOString();
        });

        req.send(function(err, data) {
            if (err) {
                console.log("Failed to get file", err);
                if (err.code === "NoSuchKey") {
                    that.createNewFile(file, success, failure);
                } else {
                    failure(err.message);
                }
            } else {
                success({fileName: file, obj: JSON.parse(data.Body.toString('utf-8'))});
            }
        });
    }

    createNewFile(file: string, success: (err: any) => void, failure: (err: string) => void) {
        console.log("Creating a new file: " + file);
        const initFileContents = '[]'
        this.s3.putObject({ Bucket: this.config.bucketName, Key: file, Body: initFileContents, ContentType: "application/json" }, function(err) {
            if (err) {
                console.log("Failed to create", err);
                failure(err.message);
            } else {
                success({fileName: file, data: initFileContents });
            }
        })
    }

    saveFile(file: string, content: object, success: (err: object) => void, failure: (err: string) => void) {
        console.log("saving file: " + file);
        this.s3.putObject({ Bucket: this.config.bucketName, Key: file, Body: JSON.stringify(content), ContentType: "application/json" }, function(err, data) {
            if (err) {
                console.log("Failed to save", err);
                failure(err.message);
            } else {
                success(data);
            }
        });
    }
}

function lTrim(str: string, pre: string) {
    if (str.indexOf(pre) === 0) {
        str = str.slice(pre.length);
    }
    return str;
}

function strBefore(str: string, t: string) {
    return str.substr(0, str.indexOf(t));
}