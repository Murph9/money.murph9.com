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

    save(newData: JournalEntry, success: (x: any) => void, failure: (x: string) => void) {
        
        if (newData.id >= 0 && this.rawData.filter(x => x.id == newData.id)) {
            // update
            this.rawData = this.rawData.map(x => x.id != newData.id ? x : newData);
        } else {
            // add new, and set id
            newData.id = Math.max(...this.rawData.map(x => x.id), -1) + 1;
            this.rawData.push(newData);
        }

        const that = this;
        this.awsService.saveFile(this.fileName, this.rawData, function(response: object) {
            success(response);
        }, function(response: string) {
            that.rawData = that.rawData.filter(x => x != newData); // revert save, show message
            failure(response);
        });
    }
}
