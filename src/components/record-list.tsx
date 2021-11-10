import * as React from "react";
import JournalEntry from "../utils/db-row";
import { DayType } from "../utils/day-type";
import Pagination from 'react-bootstrap/Pagination';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

const pageSize: number = 20;

type RecordListProps = {
    data: Array<JournalEntry>;
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

const RecordList = (props: RecordListProps) => {
    const [pageNum, setPageNum] = React.useState(0);

    const pages = props.data.length/pageSize;
    const paginationItems = [];
    for (let i = 0; i < pages; i++)
        paginationItems.push(<Pagination.Item key={i} active={i === pageNum} onClick={() => setPageNum(i)}>
            {i+1}
          </Pagination.Item>);

    const items = [];
    for (let i = pageSize*pageNum; i < props.data.length && i < pageSize*(pageNum+1); i++) {
        items.push(<Entry row={props.data[i]} edit={props.edit}/>);
    }

    return <>
        <div>Record count: {props.data.length}</div>

        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Length</th>
                </tr>
            </thead>
            <tbody>
                {items}
            </tbody>
        </Table>
        
        <Pagination>{paginationItems}</Pagination>
    </>;
}

export default RecordList;