import * as React from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Calc from "../utils/calc";
import { DayType } from "../utils/db-row";
import { DateLib } from "../utils/date-helpers";

import {
    BarChart,
    Bar,
    YAxis,
    CartesianGrid,
    LabelList,
    ReferenceLine,
    Cell,
    ResponsiveContainer,
  } from 'recharts';

class BarGraphViewProps {
    calc: Calc;
}

const BarGraphView = (props: BarGraphViewProps) => {
    
    const values = [];
    const bars = [];
    for (let i = -3; i < -3+7; i++) {
        const day = DateLib.setToMonday(new Date());
        day.setHours(0,0,0,0);
        DateLib.addDays(day, i*7);
        const entries = [];
        let total = 0;
        for (const row of props.calc.rowsForWeek(day)) {
            entries.push(<div>${row[1].toFixed(2)} | {row[0]}</div>);
            total += row[1];
        }
        bars.push(<Col key={i}>{day.toDateString()}
            <div>{entries}</div></Col>);

        values.push({ name: day.toLocaleDateString(), amount: total, amountFormatted: `$${total.toFixed(2)}` });
    }
    

    return (<>
    <Container>
        <Row>
            <BarChart data={values} height={300} width={600} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <ReferenceLine y={0} stroke="#000" />
                <Bar dataKey="amount" fill="#8884d8" onClick={() => {}}>
                    {values.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.amount >= 0 ? 'green': 'red'} strokeWidth={index === 3 ? 1 : 0} stroke='black'/>
                    ))}
                    <LabelList dataKey="name" position="bottom" />
                    <LabelList dataKey="amountFormatted" position="top" />
                </Bar>
            </BarChart>
        </Row>
        <Row>
            {bars}
        </Row>
    </Container>
    </>
    );
};

export default BarGraphView;