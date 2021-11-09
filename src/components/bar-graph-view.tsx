import * as React from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Calc from "../utils/calc";
import { DayType } from "../utils/db-row";
import { DateLib } from "../utils/date-helpers";

class BarGraphViewProps {
    calc: Calc;
}

const BarGraphView = (props: BarGraphViewProps) => {
    
    const bars = [];
    for (let i = -3; i < -3+6; i++) {
        const day = DateLib.setToMonday(new Date());
        day.setHours(0,0,0,0);
        DateLib.addDays(day, i*7);
        const entries = [];
        for (const row of props.calc.rowsForWeek(day)) {
            entries.push(<div>${row[1].toFixed(2)} | {row[0]}</div>);
        }
        bars.push(<Col key={i}>{day.toDateString()}
            <div>{entries}</div></Col>);
    }

    return (
    <Container>
        <Row>
            {bars}
        </Row>
    </Container>
    );
};

export default BarGraphView;