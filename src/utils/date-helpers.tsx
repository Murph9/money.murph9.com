export const DateLib = {
    treatAsUTC: function(date: Date) {
        var result = new Date(date);
        result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
        return result;
    },
    daysBetween: function(startDate: Date, endDate: Date) {
        var millisecondsPerDay = 24 * 60 * 60 * 1000;
        return (this.treatAsUTC(endDate) - this.treatAsUTC(startDate)) / millisecondsPerDay;
    },
    addDays: function(date: Date, count: number) {
        date.setDate(date.getDate() + count);
    },
    addMonths: function(date: Date, count: number) {
        date.setMonth(date.getMonth() + count);
    },
    addYears: function(date: Date, count: number) {
        date.setFullYear(date.getFullYear() + count);
    }
};
