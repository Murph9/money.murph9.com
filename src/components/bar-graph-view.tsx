import * as React from "react";
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Calc from "../utils/calc";
import DayTypeLib, { DayType } from "../utils/day-type";

import {
    BarChart,
    Bar,
    CartesianGrid,
    LabelList,
    ReferenceLine,
    Cell,
  } from 'recharts';

class BarGraphViewProps {
    calc: Calc;
    viewReport: (type: DayType, date: Date) => void;
}

const BarGraphView = (props: BarGraphViewProps) => {

    const type = DayType.Month;
    const futureCount = 2;
    const barCount = 7;
    const graphOffset = -barCount + 1 + futureCount;
    const currentIndex = barCount-futureCount-1;
    
    const values = [];
    const now = DayTypeLib.setToStart(new Date(), type);
    for (let i = 0; i < barCount; i++) {
        const periodStart = DayTypeLib.offsetDateBy(now, type, i + graphOffset);
        const value = props.calc.totalFor(type, periodStart);
        values.push({ name: periodStart.toLocaleDateString(), amount: value, amountFormatted: `$${value.toFixed(2)}` });
    }
    
    //TODO calc fill colour based on currentIndex

    return (<>
    <Container>
        <Row>
            <BarChart data={values} height={300} width={600} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <ReferenceLine y={0} stroke="#000" />
                <Bar dataKey="amount" fill="#8884d8" onClick={(data, index) => {
                    console.log(data[index]);
                    //props.viewReport(null, null);
                }}>
                    {values.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.amount >= 0 ? 'green': 'red'} strokeWidth={index === currentIndex ? 1 : 0} stroke='black'/>
                    ))}
                    <LabelList dataKey="name" position="insideBottom" style={{ fill: 'rgba(0, 0, 0, 0.87)' }}/>
                    <LabelList dataKey="amountFormatted" position="top" />
                </Bar>
            </BarChart>
        </Row>
    </Container>
    </>
    );
};

export default BarGraphView;