import JournalEntry from '../utils/db-row';
import DayTypeLib, { DayType } from "../utils/day-type";
import { DateLib } from './date-helpers';

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

    totalFor(type: DayType, startDate: Date): number {
        switch (type) {
            case DayType.Day:
                return this.rowsForDay(startDate).reduce((total, x) => total + x.calcPerDay(), 0);
            default:
                return null;
        }
    }

    rowsForDay(startDate: Date): Array<JournalEntry> {
        const list: Array<JournalEntry> = [];
        for (const range of this.dayRanges) {
            if (!range.inRange(startDate))
                continue;

            list.push(range.row);
        }
        return list;
    }

    rowsForWeek(startDate: Date): Map<string, number> {
        var date = DayTypeLib.setToMonday(new Date(startDate));

        const list = [
            ...this.rowsForDay(date),
            ...this.rowsForDay(DateLib.addDays(date, 1)),
            ...this.rowsForDay(DateLib.addDays(date, 1)),
            ...this.rowsForDay(DateLib.addDays(date, 1)),
            ...this.rowsForDay(DateLib.addDays(date, 1)),
            ...this.rowsForDay(DateLib.addDays(date, 1)),
            ...this.rowsForDay(DateLib.addDays(date, 1))
        ];
        const map = new Map<string, number>();
        for (const row of list) {
            if (!map.has(row.category))
                map.set(row.category, row.calcPerDay());
            else
                map.set(row.category, map.get(row.category) + row.calcPerDay());
        }
        return map;
    }
}
