import JournalEntry from "./db-row";
import AwsS3Service from "./s3-controller";

export default class DataService {
    
    awsService: AwsS3Service;
    fileName: string;
    rawData: Array<JournalEntry>;
    
    constructor(s3: AwsS3Service, fileName: string) {
        this.awsService = s3;
        this.fileName = fileName;
    }

    load(success: () => void, failure: (err: string) => void) {
        const that = this;
        this.awsService.getFile(this.fileName, function(result: any) {
            console.log("Entries: " + result.obj.length);
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

    save(newData: Array<JournalEntry>, success: (x: any) => void, failure: () => void) {
        if (this.rawData.length >= newData.length) {
            alert('AAAAh, looks like we might be deleting records, so far this is illegal.');
            return;
        }
        if (this.rawData.length + 1 != newData.length) {
            alert('Ah, looks like we might be adding more than one record, so far this is slightly illegal.');
            return;
        }
        this.rawData = newData;

        const that = this;
        this.awsService.saveFile(this.fileName, newData, function(response: any) {
            that.rawData = newData;
            success(response);
        }, failure);
    }
}
