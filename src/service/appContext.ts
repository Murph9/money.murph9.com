import { ref } from 'vue';
import DataService, { Db } from './dataService';
import type JournalEntry from './journalEntry';
import Calc from './calc';

export class AppConfig {
    autoLogin: boolean = false;
    loggedOut: boolean = false;
    private db?: DataService;
    calc: Calc = new Calc(new Db());

    setDb(db: DataService | undefined) {
        this.db = db;
        if (db)
            this.calc = new Calc(db.rawData)
    }
    
    successful() {
        return !!this.db;
    }

    saveRow(entry: JournalEntry, success: () => void, failure: (x: string) => void) {
        const that = this;
        this.db?.save(entry, () => {
            success();
            if (that.db)
                this.calc = new Calc(that.db.rawData);
        }, failure);
    }
    deleteRow(entry: JournalEntry, success: () => void, failure: (x: string) => void) {
        const that = this;
        this.db?.delete(entry, () => {
            success();
            if (that.db)
                this.calc = new Calc(that.db.rawData);
        }, failure);
    }
    
    getCount() {
        return this.db?.rawData.entries.length || 0;
    }

    getRecords() {
        return [...this.db?.rawData?.entries || []];
    }

    getLastModified() {
        return this.db?.rawData.lastModified;
    }

    getLastUserAgent() {
        return "none"; // TODO
    }
}

export const Context = ref(new AppConfig());
