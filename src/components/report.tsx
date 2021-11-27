import * as React from "react";
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

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
        this.income = existing < 0;
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
            let value = -cur.get(name);
            let record = new GraphRow(name, 0);
            record.added = value;
            graphList.push(record);
        }
        else if (!cur.has(name)) {
            let value = -prev.get(name);
            let record = new GraphRow(name, 0);
            record.removed = value;
            graphList.push(record);
        } else {
            // both woo
            let prevValue = -prev.get(name);
            let curValue = -cur.get(name);
            const dValue = Math.abs(curValue - prevValue);
            if (prevValue < curValue) {
                let record = new GraphRow(name, prevValue);
                record.added = dValue;
                graphList.push(record);
            } else if (prevValue > curValue) {
                let record = new GraphRow(name, curValue);
                record.removed = dValue;
                graphList.push(record);
            } else {
                graphList.push(new GraphRow(name, curValue));
            }
        }
    }

    graphList = graphList.filter(x => !x.income);
    graphList.forEach(x => {
        x.name = x.name.replace(/\s/g, '\u00A0'); // stupid word wrap, use &nbsp;
    });
    
    graphList.sort((x: GraphRow, y: GraphRow) => {
        return y.sum() - x.sum();
    });
    
    return (<>
        <div>
            <h4 style={{textAlign: 'center'}}>Report for the {DayType[props.type]} of {props.date.toLocaleDateString()}</h4>
            <Button style={{position: 'absolute', right: '0%', marginTop: -40}} onClick={props.closeCallback}>Close Breakdown</Button>
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

        <Table size="sm">
            <thead>
                <tr><th>Category Differences</th><th>Prev period</th><th>Current</th><th>Diff</th></tr>
            </thead>
            <tbody>
                {names.map(x => {
                    return{
                        name: x,
                        prevV: (-prev.get(x) || 0),
                        curV: (-cur.get(x) || 0),
                        dValue: (-cur.get(x) || 0) - (-prev.get(x) || 0)
                    };
                })
                    .filter(x => x.dValue)
                    .sort((x,y) => x.name.localeCompare(y.name))
                    .map(x => 
                        <tr>
                            <td>{x.name}</td>
                            <td>${x.prevV.toFixed(2)}</td>
                            <td>${x.curV.toFixed(2)}</td>
                            <td>${x.dValue.toFixed(2)}</td>
                        </tr>
                    )}
            </tbody>
        </Table>
    </>
    );
}
export default Report;
