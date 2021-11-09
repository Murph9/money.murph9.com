import { DateImported } from "aws-sdk/clients/transfer";

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
    setToMonday(date: DateImported) {
        var day = date.getDay() || 7;  
        if (day !== 1) 
            date.setHours(-24 * (day - 1)); 
        return date;
    }
};
