import AwsS3Service from "./aws";
import JournalEntry from "./journalEntry";
import DayTypeLib from "./dayType";

export class Db {
    loaded: boolean = false;
    lastModified?: Date;
    lastUserAgent?: string;
    entries: Array<JournalEntry> = [];
}

export default class DataService {
    private awsService: AwsS3Service;
    private fileName: string;
    rawData: Db = new Db();
    
    constructor(s3: AwsS3Service, fileName: string) {
        this.awsService = s3;
        this.fileName = fileName;
    }

    load(success: () => void, failure: (err: string) => void) {
        const that = this;
        this.awsService.getFile(this.fileName, function(result) {
            const data = JSON.parse(result);

            console.log("Entries: " + data.entries?.length || 0);
            that.rawData = new Db();
            that.rawData.lastModified = data.lastModified ?? undefined;
            that.rawData.entries = data.entries.map((x: any) => {
                const entry = new JournalEntry(new Date(Date.parse(x['from'])), x['amount'], x['lengthCount'], DayTypeLib.parseDayType(x['lengthType']), x['category']);
                entry.id = x['id'];
                entry.isIncome = x['isIncome'];
                entry.repeats = x['repeats'];
                if (entry.repeats) {
                    entry.lastDay = x['lastDay'] ? new Date(Date.parse(x['lastDay'])) : undefined
                    entry.lengthType = DayTypeLib.parseDayType(x['lengthType']);
                }
                entry.note = x['note'];

                if (entry.validate())
                    console.log(entry);

                return entry;
            }).sort((x: JournalEntry, y: JournalEntry) => {
                return +x.from - +y.from;
            });

            success();
        }, (message: string) => failure(message));
    }

    valid() {
        return !!this.rawData;
    }

    save(newData: JournalEntry, success: () => void, failure: (x: string) => void) {
        if (newData.id >= 0 && this.rawData.entries.filter(x => x.id == newData.id)) {
            // update
            this.rawData.entries = this.rawData.entries.map(x => x.id != newData.id ? x : newData);
        } else {
            // add new, and set id
            newData.id = Math.max(...this.rawData.entries.map(x => x.id), -1) + 1;
            this.rawData.entries.push(newData);
        }

        this.rawData.lastUserAgent = navigator.userAgent;
        this.rawData.lastModified = new Date();
        
        const that = this;
        this.awsService.saveFile(this.fileName, JSON.stringify(this.rawData), success, function(response: string) {
            that.rawData.entries = that.rawData.entries.filter(x => x != newData); // revert save, show message
            failure(response);
        });
    }

    delete(row: JournalEntry, success: () => void, failure: (x: string) => void) {
        if (row.id < 0 || this.rawData.entries.filter(x => x.id == row.id).length < 1) {
            failure("No id found for: " + row.id);
            return;
        }

        console.log("Removing record: ", row);
        this.rawData.entries = this.rawData.entries.filter(x => x.id != row.id);

        const that = this;
        this.awsService.saveFile(this.fileName, JSON.stringify(this.rawData), success, function(response: string) {
            that.rawData.entries.push(row); // revert save, show message
            failure(response);
        });
    }
}
