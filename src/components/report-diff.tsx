import * as React from "react";
import Table from 'react-bootstrap/Table';

class ReportDiffProps {
    names: string[];
    cur: Map<string, number>;
    prev: Map<string, number>;
}

const ReportDiff = (props: ReportDiffProps) => {
    return <Table size="sm">
        <thead>
            <tr><th>Category Differences</th><th>Prev period</th><th>Current</th><th>Diff</th></tr>
        </thead>
        <tbody>
            {props.names.map(x => {
                return{
                    name: x,
                    prevV: (-props.prev.get(x) || 0),
                    curV: (-props.cur.get(x) || 0),
                    dValue: (-props.cur.get(x) || 0) - (-props.prev.get(x) || 0)
                };
            })
                .filter(x => x.dValue)
                .sort((x,y) => x.name.localeCompare(y.name))
                .map(x => 
                    <tr>
                        <td>{x.name}</td>
                        <td>${x.prevV.toFixed(2)}</td>
                        <td>${x.curV.toFixed(2)}</td>
                        <td>${x.dValue.toFixed(2)}</td>
                    </tr>
                )}
        </tbody>
    </Table>;
};

export default ReportDiff;