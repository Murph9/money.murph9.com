export default class ReportRow {
  name: string;
  existing: number;
  income: boolean;
  added: number = 0;
  removed: number = 0;

  constructor(name: string, existing: number) {
    this.name = name;
    this.existing = existing;
    this.income = existing < 0;
  }

  sum(): number {
      return this.existing + this.added; // this.removed doesn't get to play because its not the current value
  }
}


export function generateReportRows(cur: Map<string, number>, prev: Map<string, number>, calcDiff: boolean): Array<ReportRow> {
  if (!calcDiff) {
      return [...cur.entries()].map((x) => new ReportRow(x[0], -x[1])); // convert to negative here
  }

  const names = [...new Set([...prev.keys(), ...cur.keys()])];
  
  const entryList: Array<ReportRow> = [];
  for (const name of names) {
      const prevValue = -(prev.get(name) ?? 0); // 0 only to prevent ts error
      const curValue = -(cur.get(name) ?? 0); // 0 only to prevent ts error
      if (!prev.has(name)) {
          // only added
          const record = new ReportRow(name, 0);
          record.added = curValue;
          entryList.push(record);
          
      } else if (!cur.has(name)) {
          // only removed
          const record = new ReportRow(name, 0);
          record.removed = prevValue;
          entryList.push(record);

      } else {
          // both
          const dValue = Math.abs(curValue - prevValue);
          if (prevValue < curValue) {
              const record = new ReportRow(name, prevValue);
              record.added = dValue;
              entryList.push(record);
          } else if (prevValue > curValue) {
              const record = new ReportRow(name, curValue);
              record.removed = dValue;
              entryList.push(record);
          } else {
              entryList.push(new ReportRow(name, curValue));
          }
      }
  }
  
  return entryList;
}
