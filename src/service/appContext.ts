import { reactive } from 'vue';
import DataService from './dataService';
import type JournalEntry from './journalEntry';

export class AppConfig {
    autoLogin: boolean = false;
    loggedOut: boolean = false;
    private db?: DataService;

    setDb(db: DataService | undefined) {
        this.db = db;
    }
    
    successful() {
        return !!this.db;
    }

    getCalc() {
        if (!this.db) throw Error("Do not get calc if there is no db");
        return this.db.getCalc();
    }

    saveRow(entry: JournalEntry, success: () => void, failure: (x: string) => void) {
        this.db?.save(entry, () => {
            success();
            // TODO how to refresh state?
        }, failure);
    }
    deleteRow(entry: JournalEntry, success: () => void, failure: (x: string) => void) {
        this.db?.delete(entry, success, failure);
    }
    
    getCount() {
        return this.db?.rawData?.length || 0;
    }

    getLastModified() {
        return "Unknown";
    }

    getLastUserAgent() {
        return "none";
    }
}

export const Context = reactive(new AppConfig());
