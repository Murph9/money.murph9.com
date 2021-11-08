import * as React from "react";
import JournalEntry from "../utils/db-row";
import Pagination from 'react-bootstrap/Pagination';
import Table from 'react-bootstrap/Table';

const pageSize: number = 20;

type RecordListProps = {
    data: Array<JournalEntry>
}

type EntryProps = {
    row: JournalEntry
}

const Entry = (props: EntryProps) => {
    return <tr key={props.row.id}>
        <td>{props.row.category}</td>
        <td>${props.row.amount}</td>
        <td>{props.row.from.toLocaleDateString()}</td>
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
        items.push(<Entry row={props.data[i]} />);
    }

    return <>
        <div>Record count: {props.data.length}</div>

        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Date</th>
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