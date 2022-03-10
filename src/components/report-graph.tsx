import * as React from "react";
import {
    BarChart,
    Bar,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    Legend 
  } from 'recharts';


class ReportGraphProps {
    data: Array<GraphRow>;
    showDiff: boolean;
    maxCount?: number;
}

export class GraphRow {
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
        return this.existing + this.added; // this.removed doesn't play because its not the current value
    }
}

const ReportGraph = (props: ReportGraphProps) => {
    props.data.sort((x: GraphRow, y: GraphRow) => {
        return y.sum() - x.sum();
    });

    const count = props.maxCount ? props.maxCount : 50;
    const graphMax = Math.ceil(props.data[0].sum());
    const graphCount = Math.min(props.data.length, count);

    return <ResponsiveContainer width="100%" height={graphCount*25+80}>
        <BarChart data={props.data.slice(0, graphCount)} layout="vertical" id="b">
            <Legend verticalAlign="top" height={36}/>
            <XAxis dataKey='existing' type="number" domain={[0, graphMax]}/>
            <YAxis dataKey='name' scale="band" type="category" width={150} interval={0} />
            <Bar dataKey="existing" isAnimationActive={false} fill="#8884d8" barSize={50} stackId="main" />
            {props.showDiff &&
            <>
                <Bar dataKey="added" isAnimationActive={false} fill="#84d888" barSize={50} stackId="main" />
                <Bar dataKey="removed" isAnimationActive={false} fill="#844444" barSize={50} stackId="main" />
            </>}
            <Tooltip formatter={(value: number, name: string) => [value.toFixed(2), name]}/>
        </BarChart>
    </ResponsiveContainer>;
}

export default ReportGraph;