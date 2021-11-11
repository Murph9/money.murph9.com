import * as React from "react";
import Calc from "../utils/calc";
import DayTypeLib, { DayType } from "../utils/day-type";

import Button from 'react-bootstrap/Button';

import {
    BarChart,
    Bar,
    CartesianGrid,
    LabelList,
    ReferenceLine,
    Cell,
    ResponsiveContainer
  } from 'recharts';

class BarGraphViewProps {
    calc: Calc;
    viewReport: (type: DayType, date: Date) => void;
}

const BarGraphView = (props: BarGraphViewProps) => {

    const [periodOffset, setPeriodOffset] = React.useState(0);
    const incOffset = () => {
        setPeriodOffset(periodOffset + 1);
    }
    const subOffset = () => {
        setPeriodOffset(periodOffset - 1);
    }

    const type = DayType.Day;
    const futureCount = 2;
    const barCount = 7;
    const graphOffset = -barCount + 1 + futureCount;
    const currentIndex = barCount-futureCount-1;
    
    const values = [];
    const now = DayTypeLib.setToStart(new Date(), type);
    for (let i = 0; i < barCount; i++) {
        const periodStart = DayTypeLib.offsetDateBy(now, type, i + graphOffset + periodOffset);
        const value = props.calc.totalFor(type, periodStart);
        values.push({ name: periodStart.toLocaleDateString(), amount: value, amountFormatted: `$${value.toFixed(2)}`, date: periodStart });
    }
    
    //TODO calc fill colour based on currentIndex

    return (
    <div>
        <Button variant="primary" onClick={subOffset}>-</Button>
        
        <Button variant="primary" onClick={incOffset}>+</Button>
        <ResponsiveContainer width="100%" height={300}>
            
            <BarChart data={values} margin={{ top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <ReferenceLine y={0} stroke="#000" />
                <Bar dataKey="amount" fill="#8884d8" isAnimationActive={false} onClick={(data, index) => {
                    props.viewReport(type, data.date);
                }}>
                    {values.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.amount >= 0 ? 'green': 'red'} strokeWidth={index === currentIndex ? 1 : 0} stroke='black'/>
                    ))}
                    <LabelList dataKey="name" position="insideBottom" style={{ fill: 'rgba(0, 0, 0, 0.87)' }}/>
                    <LabelList dataKey="amountFormatted" position="top" />
                </Bar>
            </BarChart>
            
        </ResponsiveContainer>
    </div>
    );
};

export default BarGraphView;