import * as React from "react";

import {
    BarChart,
    Bar,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip 
  } from 'recharts';

class ReportProps {
    data: Map<string, number>
}

const Report = (props: ReportProps) => {

    const list = Array.from(props.data, ([name, value]) => ({ name, amount: Math.abs(value), income: value > 0 })).filter(x => !x.income);
    list.sort((x: object, y: object) => {
        return +y['amount'] - +x['amount'];
    });
    return (
    <ResponsiveContainer width="100%" height={500}>
        <BarChart data={list} layout="vertical">
            <XAxis dataKey='amount' type="number"/>
            <YAxis dataKey='name' scale="band" type="category" width={150} interval={0}/>
            <Bar dataKey="amount" isAnimationActive={false} fill="#8884d8" barSize={50} />
            <Tooltip formatter={(value: number, name: string) => [value.toFixed(2), name]}/>
        </BarChart>
    </ResponsiveContainer>
    );
}
export default Report;