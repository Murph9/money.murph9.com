import * as React from "react";
import Calc from "../utils/calc";
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import DayTypeLib, { DayType } from "../utils/day-type";

import Button from 'react-bootstrap/Button';

import {
    BarChart,
    Bar,
    CartesianGrid,
    LabelList,
    ReferenceLine,
    Cell,
    ResponsiveContainer,
    XAxis
  } from 'recharts';

class BarGraphViewProps {
    calc: Calc;
    viewReport: (type: DayType, date: Date) => void;
}

const BarGraphView = (props: BarGraphViewProps) => {

    const [periodType, setPeriodType] = React.useState(DayType.Day);
    const [periodOffset, setPeriodOffset] = React.useState(0);
    const incOffset = () => {
        setPeriodOffset(periodOffset + 1);
    }
    const subOffset = () => {
        setPeriodOffset(periodOffset - 1);
    }
    const futureCount = 2;
    const barCount = 7;
    const graphOffset = -barCount + 1 + futureCount;
    
    const values = [];
    const now = DayTypeLib.setToStart(new Date(), periodType);
    for (let i = 0; i < barCount; i++) {
        const periodStart = DayTypeLib.offsetDateBy(now, periodType, i + graphOffset + periodOffset);
        const value = props.calc.totalFor(periodType, periodStart);
        const obj: any = { name: periodStart.toLocaleDateString(), amount: value, amountFormatted: `$${value.toFixed(2)}`, date: periodStart };
        if (now.getTime() == periodStart.getTime())
            obj.current = 'Current';
        else if (now.getTime() < periodStart.getTime())
            obj.current = 'Future';
        values.push(obj);
    }
    
    return (
    <div>
        <Container>
            <Row>
                <Col>
                    <Button variant="primary" onClick={subOffset} style={{float: 'right'}}>-</Button>
                </Col>
                <Col>
                <Form.Select value={periodType} onChange={(e) =>  {
                    setPeriodType(DayTypeLib.parseDayType(e.currentTarget.value));
                    setPeriodOffset(0);
                }}>
                    <option value={DayType.Day}>Day</option>
                    <option value={DayType.Week}>Week</option>
                    <option value={DayType.Month}>Month</option>
                    <option value={DayType.Year}>Year</option>
                </Form.Select>
                </Col>
                <Col><Button variant="primary" onClick={incOffset} style={{float: 'left'}}>+</Button></Col>
            </Row>
        </Container>
        <ResponsiveContainer width="100%" height={300}>
            
            <BarChart data={values} margin={{ top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <ReferenceLine y={0} stroke="#000" />
                <XAxis dataKey={'name'}/>
                <Bar dataKey="amount" fill="#8884d8" isAnimationActive={false} onClick={(data, index) => {
                    props.viewReport(periodType, data.date);
                }}>
                    {values.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.amount >= 0 ? 'green': 'red'} />
                    ))}
                    
                    <LabelList dataKey="amountFormatted" position="top" />
                    <LabelList dataKey="current" position="center" style={{ fill: 'rgba(0, 0, 0, 0.87)' }}/>
                </Bar>
            </BarChart>
            
        </ResponsiveContainer>
    </div>
    );
};

export default BarGraphView;