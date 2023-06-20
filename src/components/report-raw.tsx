import JournalEntry from "../utils/db-row";

import React from "react";
import Table from 'react-bootstrap/Table';
import { DayType } from "../utils/day-type";

class ReportRawProps {
    data: JournalEntry[];
}

const ReportRaw = (props: ReportRawProps) => {
    return (<>
        <Table striped bordered hover size="sm">
            <thead>
                <tr>
                    <th>Category</th>
                    <th>$/day</th>
                    <th>From</th>
                    <th>Math</th>
                    <th>Note</th>
                </tr>
            </thead>
            <tbody>
                {props.data
                    .filter(distinct)
                    .sort((x, y) => x.calcPerDay() - y.calcPerDay())
                    .map(x =>
                        <tr>
                            <td>{x.category}</td>
                            <td>{((x.isIncome ? 1 : -1)*x.calcPerDay()).toFixed(2)}</td>
                            <td>{x.from.toLocaleDateString()}</td>
                            <td>${x.amount} @ {x.lengthCount + " * " + DayType[x.lengthType]} {x.repeats ? <code>forever</code> : ""}</td>
                            {getOptionalString(x.note)}
                        </tr>
                    )}
            </tbody>
        </Table>
    </>);
};

function getOptionalString(str: string | undefined) {
    if (str)
        return <td>{str}</td>;
    return <td></td>;
}

function distinct(value: JournalEntry, index: number, array: JournalEntry[]) {
    return array.indexOf(value) === index;
}

export default ReportRaw;