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
    existing: number;
    income: boolean;
    added: number = 0;
    removed: number = 0;

    constructor(name: string, existing: number) {
        this.name = name;
        this.existing = existing;
        this.income = existing > 0;
    }

    sum(): number {
        return this.existing + this.added; // this.removed doesn't play because its not the current value
    }
}

const Report = (props: ReportProps) => {

    const prev = props.calc.reportFor(props.type, DayTypeLib.offsetDateBy(props.date, props.type, -1));
    const cur = props.calc.reportFor(props.type, props.date);

    let graphList: Array<GraphRow> = [];
    const names = [...new Set([...prev.keys(), ...cur.keys()])]; // get all names
    for (const name of names) {
        if (!prev.has(name)) {
            let value = cur.get(name);
            let record = new GraphRow(name, 0);
            record.added = value;
            graphList.push(record);
        }
        else if (!cur.has(name)) {
            let value = prev.get(name);
            let record = new GraphRow(name, 0);
            record.removed = value;
            graphList.push(record);
        } else {
            // both woo
            let prevValue = prev.get(name);
            let curValue = cur.get(name);
            if (prevValue < curValue) {
                let record = new GraphRow(name, prevValue);
                record.added = curValue - prevValue;
                graphList.push(record);
            } else if (prevValue > curValue) {
                let record = new GraphRow(name, curValue);
                record.removed = prevValue - curValue;
                graphList.push(record);
            } else {
                graphList.push(new GraphRow(name, curValue));
            }
        }
    }

    graphList = graphList.filter(x => !x.income);
    // every thing is an expense, so show as positive
    graphList.forEach(x => {
        x.existing *= -1;
        x.added *= -1;
        x.removed *= -1;
        x.name = x.name.replace(/\s/g, '\u00A0'); // stupid word wrap &nbsp;
    });
    
    graphList.sort((x: GraphRow, y: GraphRow) => {
        return +y.sum() - +x.sum();
    });
    
    return (<>
        <div>
            <h4 style={{float: 'left'}}>Report for the {DayType[props.type]} of {props.date.toLocaleDateString()}</h4>
            <Button style={{float: 'right'}} onClick={props.closeCallback}>Close Breakdown</Button>
        </div>
        <ResponsiveContainer width="100%" height={Math.min(graphList.length*25, 600)}>
            <BarChart data={graphList} layout="vertical">
                <Legend verticalAlign="top" height={36}/>
                <XAxis dataKey='existing' type="number"/>
                <YAxis dataKey='name' scale="band" type="category" width={150} interval={0} />
                <Bar dataKey="existing" isAnimationActive={false} fill="#8884d8" barSize={50} stackId="main" />
                <Bar dataKey="added" isAnimationActive={false} fill="#84d888" barSize={50} stackId="main" />
                <Bar dataKey="removed" isAnimationActive={false} fill="#844444" barSize={50} stackId="main" />
                <Tooltip formatter={(value: number, name: string) => [value.toFixed(2), name]}/>
            </BarChart>
        </ResponsiveContainer>
    </>
    );
}
export default Report;
