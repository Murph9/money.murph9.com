import * as React from "react";

import Calc from "../utils/calc";
import DateLib from "../utils/date-helpers";
import DayTypeLib, { DayType } from "../utils/day-type";

class RecordsTodayProps {
    calc: Calc;
}

const RecordsToday = (props: RecordsTodayProps) => {

    const today = DateLib.treatAsUTC(DayTypeLib.setToStart(new Date(), DayType.Day));
    const recordsToday = props.calc.rowsForDay(today).filter(x => x.from.getTime() === today.getTime());

    if (!recordsToday || recordsToday.length < 1) {
        return <></>;
    }

    const formattedRecords = recordsToday.map(x =>
        <div>
            - {x.category} <code>${x.amount.toFixed(2)}</code> for <code>${Math.abs(x.calcPerDay()).toFixed(2)}</code>/d
        </div>
        );

    return <>
        <p>Records added today:<br /> {formattedRecords}</p>
    </>
}


export default RecordsToday;