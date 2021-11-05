import AwsS3Service, {AwsS3Config} from "./s3-controller";

export default class DataService {
    
    awsService: AwsS3Service;
    fileName: string;
    rawData: any; // TODO
    
    constructor(s3: AwsS3Service, fileName: string) {
        this.awsService = s3;
        this.fileName = fileName;
    }

    load(success: () => void, failure: (err: string) => void) {
        const that = this;
        this.awsService.getFile(this.fileName, function(result: any) {
            console.log(result);
            that.rawData = result.obj;
            success();
        }, (message: string) => failure(message));
    }

    valid() {
        return !!this.rawData;
    }

    getRaw() {
        return this.rawData;
    }

    save(newData, success: (x: any) => {}, failure: () => {}) {
        // validate thats its not too weird, like preventing losing or gaining more than one folder
        const diff = Object.keys(newData).length - Object.keys(this.rawData).length;
        if (Math.abs(diff) > 1)
            throw new Error("oops");

        const that = this;
        this.awsService.saveFile(this.fileName, newData, function(response: any) {
            that.rawData = newData;
            success(response);
        }, failure);
    }
}
