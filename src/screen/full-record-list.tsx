import React from "react";
import Pagination from 'react-bootstrap/Pagination';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';

import JournalEntry from "../utils/db-row";
import { DayType } from "../utils/day-type";
import DateUtil from "../utils/date-helpers";

const pageSize: number = 15;

type RecordListProps = {
    data: Array<JournalEntry>;
    show: boolean;
    exit: () => void;
    edit: (row: JournalEntry) => void;
}

type EntryProps = {
    row: JournalEntry;
    edit: (row: JournalEntry) => void;
}

const Entry = (props: EntryProps) => {
    const perDay = (props.row.lengthType != DayType.Day || props.row.lengthCount != 1) ? ` ($${props.row.calcPerDay().toFixed(2)}/day)` : null;
    const length = props.row.repeats && !props.row.lastDay ? 'inf' : `${props.row.lengthCount} * ${DayType[props.row.lengthType]}`;
    return <tr key={props.row.id}>
        <td>{props.row.category}</td>
        <td>${props.row.amount.toFixed(2)}{perDay}</td>
        <td>{props.row.from.toLocaleDateString()}</td>
        <td>{length}</td>
        <td><Button onClick={() => props.edit(props.row)}>Edit</Button></td>
    </tr>;
}

const FullRecordList = (props: RecordListProps) => {
    const [pageNum, setPageNum] = React.useState(0);
    const [filter, setFilter] = React.useState("");

    const searchExp =  new RegExp(filter, "i");
    const data = props.data
        .filter(x => searchExp.test(x.category) || (x.note && searchExp.test(x.note)))
        .sort((x: JournalEntry, y: JournalEntry) => {
            return +y.from - +x.from;
        });

    const pages = data.length/pageSize;
    const paginationItems: Array<JSX.Element> = [];
    for (let i = 0; i < pages && i < 5; i++)
        paginationItems.push(<Pagination.Item key={i} active={i === pageNum} onClick={() => setPageNum(i)}>
            {i+1}
          </Pagination.Item>);
    if (pages > 5)
        paginationItems.push(<Pagination.Ellipsis />);

    const items: Array<JSX.Element> = [];
    for (let i = pageSize*pageNum; i < data.length && i < pageSize*(pageNum+1); i++) {
        items.push(<Entry row={data[i]} key={i+"page"} edit={props.edit}/>);
    }

    const recordsToday = props.data.filter(x => x.from > DateUtil.addDays(new Date(), -1));
    const recordsThisWeek = props.data.filter(x => x.from > DateUtil.addDays(new Date(), -7));

    return <Modal show={props.show} onHide={props.exit} size="xl" animation={false}>
        <Modal.Header closeButton>
            <Container>
                <Row><Col><h2>All Record Search</h2></Col></Row>
                <Row>
                    <Col>
                        <Form.Control value={filter} onChange={(e) => setFilter(e.currentTarget.value)} placeholder="Filter below"/>
                    </Col>
                    <Col>
                        Record count: {data.length} (total count: {props.data.length})<br/>
                        today: {recordsToday.length}, week: {recordsThisWeek.length}
                    </Col>
                </Row>
            </Container>
        </Modal.Header>
        <Modal.Body>
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Length</th>
                    </tr>
                </thead>
                <tbody>
                    {items && items.length > 0 ? items : "No records found for '"+filter+"'"}
                </tbody>
            </Table>
            
            <Pagination>{paginationItems}</Pagination>
        </Modal.Body>
    </Modal>;
}

export default FullRecordList;