import { DateLib } from "./date-helpers";

export const enum DayType {
    None,

    Day,
    Week,
    Month,
    Quarter,
    Year
}
export const parseDayType = function(str: string): DayType {
    if (!str)
        return DayType.None;
    
    switch(str.toString().toLowerCase()) {
        case '0': case 'n': case 'none':
            return DayType.None;
        case '1': case 'day': case 'd':
            return DayType.Day;
        case '2': case 'w': case 'week':
            return DayType.Week;
        case '3': case 'm': case 'month':
            return DayType.Month;
        case '4': case 'q': case 'quarter':
            return DayType.Quarter;
        case '5': case 'y': case 'year':
            return DayType.Year;
    }

    throw new Error("AAAA no type found for: " + str);
};


export default class JournalEntry {
    id: number = -1;
    isIncome: boolean = false;
    from: Date = null;
    amount: number = 0;
    lengthCount: number = 0;
    lengthType = DayType.None;
    repeats: boolean = false;
    lastDay: Date = null;
    category: string = null;
    note: string = null;

    validate() {
        if (this.amount <= 0)
            return "Amount is not set";
        if (this.lengthCount == 0 && this.lengthType != DayType.Day)
            return "Length count cannot be 0, it is only valid for the day type.";
        if (this.lengthCount <= 0)
            return "Length count cannot be negative.";
        if (this.lengthCount % 1 != 0)
            return "Length count must be a whole number";
        if (this.lengthType == DayType.None)
            return "Length type must not be None";
        if (!this.from)
            return "The start date must be set";
        if (this.lastDay != null && this.lastDay <= this.from)
            return "LastDay date earlier than the start date (From).";

        return null;
    }

    calcPerDay() {
        let days = DateLib.daysBetween(this.from, this.calcFirstPeriodEndDay()) + 1;
        if (days <= 0) days = 1; // if no days 'assume' its 1 day
        return (this.isIncome ? this.amount : -this.amount) / days;
    }

    calcFirstPeriodEndDay() {
        const result = new Date(this.from);
        switch (this.lengthType) {
            case DayType.Day:
                DateLib.addDays(result, this.lengthCount);
                break;
            case DayType.Week:
                DateLib.addDays(result, this.lengthCount * 7);
                break;
            case DayType.Month:
                DateLib.addMonths(result, this.lengthCount);
                break;
            case DayType.Quarter:
                DateLib.addMonths(result, this.lengthCount * 3);
                break;
            case DayType.Year:
                DateLib.addYears(result, this.lengthCount);
                break;
            default:
                throw new Error("huh, no length type: " + this.lengthType);
        }

        DateLib.addDays(result, -1);
        return result;
    }

    calcLastDay() {
        if (!this.repeats) {
            // then use the end of the period
            return this.calcFirstPeriodEndDay();
        }

        //else its forever or if its set
        return this.lastDay == null ? new Date(9999) : this.lastDay;
    }
}
