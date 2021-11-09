import JournalEntry from '../utils/db-row';

class Range {
    row: JournalEntry;
    start: Date;
    end: Date;

    constructor(row: JournalEntry) {
        this.row = row;
        this.start = new Date(row.from);
        this.start.setHours(0,0,0,0); //hmm timezones
        this.end = new Date(row.calcLastDay());
        this.end.setHours(0,0,0,0); //hmm timezones
    }

    inRange(date: Date): boolean {
        let justDate = new Date(date);
        justDate.setHours(0,0,0,0);
        if (justDate.getTime() == this.start.getTime() || justDate.getTime() == this.end.getTime())
            return true;

        return this.start < justDate && this.end > justDate;
    }
}

export default class Calc {
    dayRanges: Array<Range>;
    categories: Array<string> = [];

    constructor(data: Array<JournalEntry>) {
        this.dayRanges = data.map(x => new Range(x));

        for (const row of data) {
            if (!this.categories.includes(row.category))
                this.categories.push(row.category);
        }
        console.log("Ranges length:", this.dayRanges.length);
        console.log("Categories: ", this.categories.length);
    }
}
