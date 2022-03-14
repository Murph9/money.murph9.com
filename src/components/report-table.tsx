import * as React from "react";

import Table from 'react-bootstrap/Table';

import { GraphRow } from "./report-graph";

const ReportTable = (props: {data: GraphRow[], maxCount: number}) => {

    const count = Math.min(props.data.length, props.maxCount);

    return (
    <Table size="sm">
        <thead>
            <tr><th>Category</th><th>Current</th></tr>
        </thead>
        <tbody>
            {props.data
                .sort((x, y) => y.sum() - x.sum())
                .slice(0, count)
                .map(x =>
                    <tr>
                        <td>{x.name}</td>
                        <td>${x.sum().toFixed(2)}</td>
                    </tr>
                )}
        </tbody>
    </Table>
    );
};
export default ReportTable;
