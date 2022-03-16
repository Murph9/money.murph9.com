import * as React from "react";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ToggleButton from 'react-bootstrap/ToggleButton';

import DayTypeLib, { DayType } from "../utils/day-type";
import Calc from "../utils/calc";

import ReportDiff from "../components/report-diff";
import ReportGraph from "../components/report-graph";

class ReportProps {
    type: DayType;
    date: Date;
    calc: Calc;
    closeCallback: () => void;
}

export class ReportRow {
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
    const prev = props.calc.reportFor(props.type, DayTypeLib.offsetDateBy(props.date, props.type, -1));
    
    const entryList = generateReportRows(cur, prev, calcDiff);

    const incomeList: Array<ReportRow> = entryList.filter(x => x.income);
    incomeList.forEach(x => {x.added *= -1; x.existing *= -1; x.removed *= -1});

    const expenseList = entryList.filter(x => !x.income);

    const maxCount = showAll ? expenseList.length : 10;
    
    return (<>
        <Container>
            <Row>
                <Col><h4>Report: {DayType[props.type]} of {props.date.toLocaleDateString()}</h4></Col>
                <Col col="1">
                    <ButtonGroup>
                        <ToggleButton size="sm" id="showincome-check" variant="outline-primary" value="1" type="checkbox" checked={showIncome} onChange={(e) => setShowIncome(e.currentTarget.checked)}>Income</ToggleButton>
                        <ToggleButton size="sm" id="showall-check" variant="outline-primary" value="1" type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.currentTarget.checked)}>All</ToggleButton>
                        <ToggleButton size="sm" id="viewdiff-check" variant="outline-primary" value="1" type="checkbox" checked={calcDiff} onChange={(e) => setCalcDiff(e.currentTarget.checked)}>Diff</ToggleButton>
                    </ButtonGroup>
                    <Button size="sm" variant="secondary" onClick={props.closeCallback}>Close</Button>
                </Col>
            </Row>
        </Container>
        
        <Tabs defaultActiveKey="graph">
            <Tab eventKey="graph" title="Graph View">
                {showIncome && <ReportGraph data={incomeList} showDiff={calcDiff} />}
                <ReportGraph data={expenseList} maxCount={maxCount} showDiff={calcDiff} />
            </Tab>
            <Tab eventKey="table" title="Table View">
                {showIncome && <ReportDiff data={incomeList} maxCount={incomeList.length} showDiff={calcDiff} />}
                <ReportDiff data={expenseList} maxCount={maxCount} showDiff={calcDiff} />
            </Tab>
        </Tabs>
    </>
    );
}
export default Report;


function generateReportRows(cur: Map<string, number>, prev: Map<string, number>, calcDiff: boolean): Array<ReportRow> {
    if (!calcDiff) {
        return [...cur.keys()].map(x => {
            let value = -cur.get(x);
            return new ReportRow(x, value);
        });
    }

    const names = [...new Set([...prev.keys(), ...cur.keys()])];
    
    const entryList: Array<ReportRow> = [];
    for (const name of names) {
        if (!prev.has(name)) {
            // only added
            let value = -cur.get(name);
            let record = new ReportRow(name, 0);
            record.added = value;
            entryList.push(record);
            
        } else if (!cur.has(name)) {
            // only removed
            let value = -prev.get(name);
            let record = new ReportRow(name, 0);
            record.removed = value;
            entryList.push(record);

        } else {
            // both
            let prevValue = -prev.get(name);
            let curValue = -cur.get(name);
            const dValue = Math.abs(curValue - prevValue);
            if (prevValue < curValue) {
                let record = new ReportRow(name, prevValue);
                record.added = dValue;
                entryList.push(record);
            } else if (prevValue > curValue) {
                let record = new ReportRow(name, curValue);
                record.removed = dValue;
                entryList.push(record);
            } else {
                entryList.push(new ReportRow(name, curValue));
            }
        }
    }
    
    return entryList;
}
