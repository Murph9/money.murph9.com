import React from "react";
import {
    BarChart,
    Bar,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    Legend 
  } from 'recharts';

import { ReportRow } from "../screen/report";

class ReportGraphProps {
    data: Array<ReportRow>;
    showDiff: boolean;
    maxCount?: number;
}

const ReportGraph = (props: ReportGraphProps) => {
    props.data.sort((x: ReportRow, y: ReportRow) => {
        return y.sum() - x.sum();
    });

    const count = props.maxCount ? props.maxCount : 50;
    const graphMax = Math.ceil(props.data[0].sum());
    const graphCount = Math.min(props.data.length, count);

    props.data.forEach(x => {
        x.name = x.name.replace(/\s/g, '\u00A0'); // stupid word graph wrap, use &nbsp;
    });

    return <ResponsiveContainer width="100%" height={graphCount*25+80}>
        <BarChart data={props.data.slice(0, graphCount)} layout="vertical" id="b">
            <Legend verticalAlign="top" height={36}/>
            <XAxis dataKey='existing' type="number" domain={[0, graphMax]}/>
            <YAxis dataKey='name' type="category" width={150} interval={0} />
            <Bar dataKey="existing" isAnimationActive={false} fill="#8884d8" barSize={50} stackId="main" />
            {props.showDiff &&
            <>
                <Bar dataKey="added" isAnimationActive={false} fill="#84d888" barSize={50} stackId="main" />
                <Bar dataKey="removed" isAnimationActive={false} fill="#844444" barSize={50} stackId="main" />
            </>}
            <Tooltip formatter={(value: number, name: string) => [Math.round((value + Number.EPSILON) * 100) / 100, name]}/>
        </BarChart>
    </ResponsiveContainer>;
}

export default ReportGraph;