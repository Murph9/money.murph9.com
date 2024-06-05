const DateLib = {
    treatAsUTC: function(date: Date) {
        const result = new Date(date);
        result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
        return result;
    },
    daysBetween: function(startDate: Date, endDate: Date) {
        const millisecondsPerDay = 24 * 60 * 60 * 1000;
        return (this.treatAsUTC(endDate).getTime() - this.treatAsUTC(startDate).getTime()) / millisecondsPerDay;
    },
    addDays: function(date: Date, count: number): Date {
        date.setDate(date.getDate() + count);
        return date;
    },
    addMonths: function(date: Date, count: number): Date {
        date.setMonth(date.getMonth() + count);
        return date;
    },
    addYears: function(date: Date, count: number): Date {
        date.setFullYear(date.getFullYear() + count);
        return date;
    },
    addOffsetToDate: function(date: Date): Date {
        date.setTime(date.getTime() - date.getTimezoneOffset() * 60000);
        return date;
    }
};

export default DateLib;
