import * as React from "react";
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

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

    const [calcDiff, setCalcDiff] = React.useState(false);
    const [showAll, setShowAll] = React.useState(false);
    const [showIncome, setShowIncome] = React.useState(false);

    const cur = props.calc.reportFor(props.type, props.date);

    let prev = new Map<string, number>();
    if (calcDiff) {
        prev = props.calc.reportFor(props.type, DayTypeLib.offsetDateBy(props.date, props.type, -1));
    }
    let graphList: Array<GraphRow> = [];
    const names = [...new Set([...prev.keys(), ...cur.keys()])]; // get all names
    for (const name of names) {
        if (!calcDiff) {
            let value = -cur.get(name);
            graphList.push(new GraphRow(name, value));
            continue;
        }
        if (!prev.has(name)) { // only added
            let value = -cur.get(name);
            let record = new GraphRow(name, 0);
            record.added = value;
            graphList.push(record);
        }
        else if (!cur.has(name)) { // only removed
            let value = -prev.get(name);
            let record = new GraphRow(name, 0);
            record.removed = value;
            graphList.push(record);
        } else {
            // both
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

    let incomeList: Array<GraphRow> = [];
    if (showIncome) {
        incomeList = graphList.filter(x => x.income);
        incomeList.forEach(x => {x.added *= -1; x.existing *= -1; x.removed *= -1});
    }

    graphList = graphList.filter(x => !x.income);
    graphList.sort((x: GraphRow, y: GraphRow) => {
        return y.sum() - x.sum();
    });
    graphList.forEach(x => {
        x.name = x.name.replace(/\s/g, '\u00A0'); // stupid word wrap, use &nbsp;
    });

    const graphCount = showAll ? graphList.length : 10;
    let graphMax: number = 0;
    if (graphList.length > 0) {
        graphMax = graphList[0].sum();
    }
    
    return (<>
        <div>
            <h4>Report for the {DayType[props.type]} of {props.date.toLocaleDateString()}</h4>
            <div style={{position: 'absolute', right: '0%', marginTop: -40}}>
                <ButtonGroup><ToggleButton id="showincome-check" variant="outline-primary" value="1" type="checkbox" checked={showIncome} onChange={(e) => setShowIncome(e.currentTarget.checked)}>Show Income</ToggleButton></ButtonGroup>
                <ButtonGroup><ToggleButton id="showall-check" variant="outline-primary" value="1" type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.currentTarget.checked)}>Show All</ToggleButton></ButtonGroup>
                <ButtonGroup><ToggleButton id="viewdiff-check" variant="outline-primary" value="1" type="checkbox" checked={calcDiff} onChange={(e) => setCalcDiff(e.currentTarget.checked)}>View Diff</ToggleButton></ButtonGroup>
                <Button variant="secondary" onClick={props.closeCallback}>Close Breakdown</Button>
            </div>
        </div>
        
        {showIncome && 
            <ResponsiveContainer width="100%" height={incomeList.length*25+80}>
                <BarChart data={incomeList} layout="vertical" id="a">
                    <Legend verticalAlign="top" height={36}/>
                    <XAxis dataKey='existing' type="number" domain={[0, 'auto']} />
                    <YAxis dataKey='name' scale="band" type="category" width={150} interval={0} />
                    <Bar dataKey="existing" isAnimationActive={false} fill="#8884d8" barSize={50} stackId="income" />
                    {calcDiff &&
                    <>
                        <Bar dataKey="added" isAnimationActive={false} fill="#84d888" barSize={50} stackId="income" />
                        <Bar dataKey="removed" isAnimationActive={false} fill="#844444" barSize={50} stackId="income" />
                    </>
                    }
                    <Tooltip formatter={(value: number, name: string) => [value.toFixed(2), name]}/>
                </BarChart>
            </ResponsiveContainer>
        }

        <ResponsiveContainer width="100%" height={graphCount*25+80}>
            <BarChart data={graphList.slice(0, graphCount)} layout="vertical" id="b">
                <Legend verticalAlign="top" height={36}/>
                <XAxis dataKey='existing' type="number" domain={[0, graphMax]}/>
                <YAxis dataKey='name' scale="band" type="category" width={150} interval={0} />
                <Bar dataKey="existing" isAnimationActive={false} fill="#8884d8" barSize={50} stackId="main" />
                {calcDiff &&
                <>
                    <Bar dataKey="added" isAnimationActive={false} fill="#84d888" barSize={50} stackId="main" />
                    <Bar dataKey="removed" isAnimationActive={false} fill="#844444" barSize={50} stackId="main" />
                </>}
                <Tooltip formatter={(value: number, name: string) => [value.toFixed(2), name]}/>
            </BarChart>
        </ResponsiveContainer>

        {calcDiff && 
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
        }
    </>
    );
}
export default Report;
