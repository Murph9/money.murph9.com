import DateLib from "./dateHelpers";
import DayTypeLib, { DayType } from "./dayType";

export default class JournalEntry {
  id: number = -1
  isIncome: boolean = false
  from: Date
  amount: number
  lengthCount: number
  lengthType: DayType
  repeats: boolean = false
  lastDay: Date | undefined
  category: string
  note: string | undefined

  constructor(from: Date, amount: number, lengthCount: number, lengthType: DayType, category: string) {
    this.from = from;
    this.amount = amount;
    this.lengthCount = lengthCount;
    this.lengthType = lengthType;
    this.category = category;
  }

  validate(): string | undefined {
    if (this.amount <= 0) return 'Amount is not set'
    if (this.lengthCount == 0 && this.lengthType != DayType.Day)
      return 'Length count cannot be 0, it is only valid for the day type.'
    if (this.lengthCount <= 0) return 'Length count cannot be negative.'
    if (this.lengthCount % 1 != 0) return 'Length count must be a whole number'
    if (this.lengthType == DayType.None) return 'Length type must not be None'
    if (!this.from) return 'The start date must be set'
    if (this.lastDay != undefined && this.lastDay <= this.from)
      return 'LastDay date earlier than the start date (From).'

    return undefined
  }

  calcPerDay() {
    let days = DateLib.daysBetween(this.from, this.calcFirstPeriodEndDay()) + 1
    if (days <= 0) days = 1 // if no days 'assume' its 1 day
    return (this.isIncome ? this.amount : -this.amount) / days
  }

  calcFirstPeriodEndDay() {
    const result = DayTypeLib.offsetDateBy(this.from, this.lengthType, this.lengthCount)
    DateLib.addDays(result, -1)
    return result
  }

  calcLastDay() {
    if (!this.repeats) {
      // then use the end of the period
      return this.calcFirstPeriodEndDay()
    }

    //else its forever or if its set
    return this.lastDay == undefined ? new Date(9999, 12, 1) : this.lastDay
  }
}
