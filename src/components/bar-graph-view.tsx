import * as React from "react";
import Calc from "../utils/calc";
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import DayTypeLib, { DayType } from "../utils/day-type";
import InputGroup from 'react-bootstrap/InputGroup';

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

const getColour = (amount: number, future: boolean) => {
    return amount >= 0 ? future ? 'lightgreen' : 'green': 'red';
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
    let nowValue = props.calc.totalFor(periodType, now);
    for (let i = 0; i < barCount; i++) {
        const periodStart = DayTypeLib.offsetDateBy(now, periodType, i + graphOffset + periodOffset);
        const value = props.calc.totalFor(periodType, periodStart);
        const obj: any = { name: periodStart.toLocaleDateString(), amount: value, amountFormatted: `$${value.toFixed(2)}`, date: periodStart };
        if (now.getTime() == periodStart.getTime()) {
            obj.current = true;
            obj.amount > 0 ? obj.label = '🠗' : obj.label = '🠕';
        } else if (now.getTime() < periodStart.getTime())
            obj.future = true;
        values.push(obj);
    }
    
    return (
    <div>
        <Container>
            <Row>
                <Col></Col>
                <Col xs={6}>
                    <InputGroup>
                        <Button variant="primary" onClick={subOffset} style={{float: 'right'}}>&lt;-</Button>
                        <Form.Select value={periodType} onChange={(e) =>  {
                            setPeriodType(DayTypeLib.parseDayType(e.currentTarget.value));
                            setPeriodOffset(0);
                        }}>
                            <option value={DayType.Day}>Day</option>
                            <option value={DayType.Week}>Week</option>
                            <option value={DayType.Month}>Month</option>
                            <option value={DayType.Year}>Year</option>
                        </Form.Select>
                        <Button variant="primary" onClick={incOffset} style={{float: 'left'}}>-&gt;</Button>
                    </InputGroup>
                </Col>
                <Col></Col>
            </Row>
        </Container>

        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={values} margin={{ top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <ReferenceLine y={nowValue} stroke="#000" />
                <XAxis dataKey={'name'}/>
                <Bar dataKey="amount" isAnimationActive={false} onClick={(data, index) => {
                    props.viewReport(periodType, data.date);
                }}>
                    {values.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getColour(entry.amount, entry.future)} />
                    ))}
                    
                    <LabelList dataKey="label" position="top" style={{ fill: 'rgba(0, 0, 0, 0.87)', fontSize: '3em' }}/>
                    <LabelList dataKey="amountFormatted" position="center" style={{ fill: 'rgba(0, 0, 0, 0.87)', pointerEvents: 'none' }}/>
                    {/* ignore pointer events to allowing the bar onClick to work https://github.com/recharts/recharts/issues/1103 */}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>
    );
};

export default BarGraphView;