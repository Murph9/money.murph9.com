import * as React from "react";
import Button from 'react-bootstrap/Button';
import DiffReport from './diff-report';

import {
    BarChart,
    Bar,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip 
  } from 'recharts';
import DayTypeLib, { DayType } from "../utils/day-type";
import Calc from "../utils/calc";

class ReportProps {
    type: DayType;
    date: Date;
    calc: Calc;
    closeCallback: () => void;
}

const Report = (props: ReportProps) => {

    const prev = props.calc.reportFor(props.type, DayTypeLib.offsetDateBy(props.date, props.type, -1));
    const cur = props.calc.reportFor(props.type, props.date);

    const list = Array.from(cur, ([name, value]) => ({ name, amount: Math.abs(value), income: value > 0 })).filter(x => !x.income);
    list.sort((x: object, y: object) => {
        return +y['amount'] - +x['amount'];
    });
    
    return (<>
        <DiffReport prev={prev} cur={cur} />

        <ResponsiveContainer width="100%" height={500}>
            <BarChart data={list} layout="vertical">
                <XAxis dataKey='amount' type="number"/>
                <YAxis dataKey='name' scale="band" type="category" width={150} interval={0} allowDataOverflow/>
                <Bar dataKey="amount" isAnimationActive={false} fill="#8884d8" barSize={50} />
                <Tooltip formatter={(value: number, name: string) => [value.toFixed(2), name]}/>
            </BarChart>
        </ResponsiveContainer>
        <Button style={{float: 'right'}} onClick={props.closeCallback}>Close Breakdown</Button>
    </>
    );
}
export default Report;