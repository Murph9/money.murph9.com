import DateLib from "./dateHelpers";

export enum DayType {
    None,

    Day,
    Week,
    Month,
    Quarter,
    Year
}

const DayTypeLib = {
    getDateWithoutTime(date: Date) {
        return new Date(date.toDateString());
    },
    setToStart(date: Date, periodType: DayType): Date {
        switch(periodType) {
            case DayType.Day:
                return DayTypeLib.getDateWithoutTime(date);
            case DayType.Week:
                return this.setToMonday(date);
            case DayType.Month:
                return this.setToStartOfMonth(date);
            case DayType.Year:
                return this.setToStartOfYear(date);
            default:
                throw new Error("Unsupported type: " + periodType);
        }
    },
    setToMonday(date: Date): Date {
        const day = date.getDay() || 7;  
        if (day !== 1)
            date.setHours(-24 * (day - 1)); 
        return DayTypeLib.getDateWithoutTime(date);
    },
    setToStartOfMonth(date: Date): Date {
        date.setDate(1);
        return DayTypeLib.getDateWithoutTime(date);
    },
    setToStartOfYear(date: Date): Date {
        date.setMonth(0);
        date.setDate(1);
        return DayTypeLib.getDateWithoutTime(date);
    },
    parseDayType(str: string): DayType {
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
    },
    offsetDateBy(start: Date, type: DayType, count: number): Date {
        const output = new Date(start);
        switch (type) {
            case DayType.Day:
                DateLib.addDays(output, count);
                break;
            case DayType.Week:
                DateLib.addDays(output, count * 7);
                break;
            case DayType.Month:
                DateLib.addMonths(output, count);
                break;
            case DayType.Quarter:
                DateLib.addMonths(output, count * 3);
                break;
            case DayType.Year:
                DateLib.addYears(output, count);
                break;
            default:
                throw new Error("huh, no length type for: " + type);
        }
    
        return output;
    },
    calcDayCount(periodType: DayType, periodCount: number): number {
        const now = new Date();
        const end = DayTypeLib.offsetDateBy(new Date(), periodType, periodCount);
        return DateLib.daysBetween(now, end);
    }
}
export default DayTypeLib;
