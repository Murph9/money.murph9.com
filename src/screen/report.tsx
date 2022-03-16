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
import ReportGraph, { GraphRow } from "../components/report-graph";
import ReportTable from "../components/report-table";

class ReportProps {
    type: DayType;
    date: Date;
    calc: Calc;
    closeCallback: () => void;
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
    
    const names = [...new Set([...prev.keys(), ...cur.keys()])]; // get all names
    const entryList = generateGraphRows(names, cur, prev, calcDiff);

    const incomeList: Array<GraphRow> = entryList.filter(x => x.income);
    incomeList.forEach(x => {x.added *= -1; x.existing *= -1; x.removed *= -1});

    const expenseList = entryList.filter(x => !x.income);
    expenseList.sort((x: GraphRow, y: GraphRow) => {
        return y.sum() - x.sum();
    });
    
    return (<>
        <Container>
            <Row>
                <Col><h4>Report: {DayType[props.type]} of {props.date.toLocaleDateString()}</h4></Col>
                <Col col="1">
                    <ButtonGroup>
                        <ToggleButton size="sm" id="showincome-check" variant="outline-primary" value="1" type="checkbox" checked={showIncome} onChange={(e) => setShowIncome(e.currentTarget.checked)}>Show Income</ToggleButton>
                        <ToggleButton size="sm" id="showall-check" variant="outline-primary" value="1" type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.currentTarget.checked)}>Show All</ToggleButton>
                        <ToggleButton size="sm" id="viewdiff-check" variant="outline-primary" value="1" type="checkbox" checked={calcDiff} onChange={(e) => setCalcDiff(e.currentTarget.checked)}>View Diff</ToggleButton>
                    </ButtonGroup>
                    <Button size="sm" variant="secondary" onClick={props.closeCallback}>Close</Button>
                </Col>
            </Row>
        </Container>
        
        <Tabs defaultActiveKey="graph">
            <Tab eventKey="graph" title="Graph View">
                {showIncome && <ReportGraph data={incomeList} showDiff={calcDiff} />}
                <ReportGraph data={expenseList} maxCount={showAll ? expenseList.length : 10} showDiff={calcDiff} />
            </Tab>
            <Tab eventKey="table" title="Table View">
                {showIncome && <ReportTable data={incomeList} maxCount={incomeList.length} />}
                <ReportTable data={expenseList} maxCount={showAll ? expenseList.length : 10} />
            </Tab>
        </Tabs>

        {calcDiff && <ReportDiff names={names} prev={prev} cur={cur} /> }
    </>
    );
}
export default Report;


function generateGraphRows(names: string[], cur: Map<string, number>, prev: Map<string, number>, calcDiff: boolean): Array<GraphRow> {
    if (!calcDiff) {
        return names.map(x => {
            let value = -cur.get(x);
            return new GraphRow(x, value);
        });
    }
    
    const entryList: Array<GraphRow> = [];
    for (const name of names) {
        if (!prev.has(name)) {
            // only added
            let value = -cur.get(name);
            let record = new GraphRow(name, 0);
            record.added = value;
            entryList.push(record);
            
        } else if (!cur.has(name)) {
            // only removed
            let value = -prev.get(name);
            let record = new GraphRow(name, 0);
            record.removed = value;
            entryList.push(record);

        } else {
            // both
            let prevValue = -prev.get(name);
            let curValue = -cur.get(name);
            const dValue = Math.abs(curValue - prevValue);
            if (prevValue < curValue) {
                let record = new GraphRow(name, prevValue);
                record.added = dValue;
                entryList.push(record);
            } else if (prevValue > curValue) {
                let record = new GraphRow(name, curValue);
                record.removed = dValue;
                entryList.push(record);
            } else {
                entryList.push(new GraphRow(name, curValue));
            }
        }
    }
    
    return entryList;
}
