import JournalEntry from '../utils/db-row';
import DayTypeLib, { DayType } from "../utils/day-type";
import DateLib from './date-helpers';
import Cache, { ObjCache } from './obj-cache';

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
    totalCache: ObjCache = Cache();
    rowCache: ObjCache = Cache();

    constructor(data: Array<JournalEntry>) {
        this.dayRanges = data.map(x => new Range(x));
        
        for (const row of data) {
            if (!this.categories.includes(row.category))
                this.categories.push(row.category);
        }
        console.log("Ranges length:", this.dayRanges.length);
        console.log("Categories: ", this.categories.length);
    }

    _createKey(type: DayType, startDate: Date): string {
        return type + '|' + startDate.toUTCString();
    }

    totalFor(type: DayType, startDate: Date): number {
        startDate = DayTypeLib.setToStart(startDate, type);

        const key = this._createKey(type, startDate);
        let result = this.totalCache.get(key);
        if (result) {
            return result;
        }
        
        const rows = this.rowsFor(type, startDate);
        result = rows.reduce((total, x) => total + x.calcPerDay(), 0);

        this.totalCache.put(key, result);
        return result;
    }

    rowsFor(type: DayType, startDate: Date): Array<JournalEntry> {
        startDate = DayTypeLib.setToStart(startDate, type);

        const key = 'rows:' + this._createKey(type, startDate);
        let result = this.rowCache.get(key);
        if (result) {
            return result;
        }
        
        switch (type) {
            case DayType.Day:
                result = this.rowsForDay(startDate);
                break;
            case DayType.Week:
                result = this.rowsForWeek(startDate);
                break;
            case DayType.Month:
                result = this.rowsForMonth(startDate);
                break;
            case DayType.Year:
                result = this.rowsForYear(startDate);
                break;
            default:
                return null;
        }

        this.rowCache.put(key, result);
        return result;
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

    rowsForWeek(startDate: Date): Array<JournalEntry> {
        var date = DayTypeLib.setToMonday(new Date(startDate));

        return [
            ...this.rowsFor(DayType.Day, date),
            ...this.rowsFor(DayType.Day, DateLib.addDays(date, 1)),
            ...this.rowsFor(DayType.Day, DateLib.addDays(date, 1)),
            ...this.rowsFor(DayType.Day, DateLib.addDays(date, 1)),
            ...this.rowsFor(DayType.Day, DateLib.addDays(date, 1)),
            ...this.rowsFor(DayType.Day, DateLib.addDays(date, 1)),
            ...this.rowsFor(DayType.Day, DateLib.addDays(date, 1))
        ];
    }

    rowsForMonth(startDate: Date): Array<JournalEntry> {
        var date = DayTypeLib.setToStart(new Date(startDate), DayType.Month);
        const month = date.getMonth();
        const array = [];
        while (date.getMonth() == month) {
            array.push(...this.rowsFor(DayType.Day, date));
            DateLib.addDays(date, 1)
        }
        return array;
    }

    rowsForYear(startDate: Date): Array<JournalEntry> {
        var date = DayTypeLib.setToStart(new Date(startDate), DayType.Year);
        const year = date.getFullYear();
        const array = [];
        while (date.getFullYear() == year) {
            array.push(...this.rowsFor(DayType.Month, date));
            DateLib.addMonths(date, 1)
        }
        return array;
    }

    reportFor(type: DayType, startDate: Date): Map<string, number> {
        const list = this.rowsFor(type, startDate);

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
