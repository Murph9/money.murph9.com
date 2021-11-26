import * as React from "react";
import Button from 'react-bootstrap/Button';

import {
    BarChart,
    Bar,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    Legend 
  } from 'recharts';
import DayTypeLib, { DayType } from "../utils/day-type";
import Calc from "../utils/calc";

class ReportProps {
    type: DayType;
    date: Date;
    calc: Calc;
    closeCallback: () => void;
}

class GraphRow {
    name: string;
    amount: number;
    income: boolean;
    added: number = 0;
    removed: number = 0;

    constructor(name: string, amount: number, income: boolean) {
        this.name = name;
        this.amount = amount;
        this.income = income;
    }

    sum(): number {
        return this.amount + this.added; // this.removed doesn't play because its not the current value
    }
}

const Report = (props: ReportProps) => {

    const prev = props.calc.reportFor(props.type, DayTypeLib.offsetDateBy(props.date, props.type, -1));
    const cur = props.calc.reportFor(props.type, props.date);

    const prevList = Array.from(prev, ([name, value]) => new GraphRow(name, Math.abs(value), value > 0));
    const curList = Array.from(cur, ([name, value]) => new GraphRow(name, Math.abs(value), value > 0));

    let list = [...curList];
    for (const row of prevList) {
        if (curList.some(e => e.name == row.name && e.amount == row.amount)) {
            //ignore it exists
        } else if (curList.some(e => e.name == row.name)) {
            // covered by the second for loop, either loop could do this
        } else {
            const addedEntry = new GraphRow(row.name, 0, row.income);
            addedEntry.removed = row.amount;
            list.push(addedEntry);
        }
    }

    for (const row of curList) {
        if (prevList.some(e => e.name == row.name && e.amount == row.amount)) {
            //ignore it exists
        } else if (prevList.some(e => e.name == row.name)) {
            const addedAmount = row.amount - prevList.filter(e => e.name == row.name)[0].amount;
            if (addedAmount > 0) {
                row.added = addedAmount;
                row.amount -= addedAmount;
            } else {
                row.removed = -addedAmount;
            }
        } else {
            row.added = row.amount;
            row.amount = 0;
        }
    }

    list = list.filter(x => !x.income);
    list.sort((x: GraphRow, y: GraphRow) => {
        return +y.sum() - +x.sum();
    });
    
    return (<>
        <ResponsiveContainer width="100%" height={Math.min(list.length*25, 600)}>
            <BarChart data={list} layout="vertical">
                <Legend verticalAlign="top" height={36}/>
                <XAxis dataKey='amount' type="number"/>
                <YAxis dataKey='name' scale="band" type="category" width={150} interval={0} />
                <Bar dataKey="amount" isAnimationActive={false} fill="#8884d8" barSize={50} stackId="main" />
                <Bar dataKey="added" isAnimationActive={false} fill="#84d888" barSize={50} stackId="main" />
                <Bar dataKey="removed" isAnimationActive={false} fill="#844444" barSize={50} stackId="main" />
                <Tooltip formatter={(value: number, name: string) => [value.toFixed(2), name]}/>
            </BarChart>
        </ResponsiveContainer>
        <Button style={{float: 'right'}} onClick={props.closeCallback}>Close Breakdown</Button>
    </>
    );
}
export default Report;
