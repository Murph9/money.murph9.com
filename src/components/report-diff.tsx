import * as React from "react";
import Table from 'react-bootstrap/Table';

class ReportDiffProps {
    data: Array<ReportRow>;
    showDiff: boolean;
    maxCount?: number;
}

import { ReportRow } from "../screen/report";

const ReportDiff = (props: ReportDiffProps) => {
    const count = Math.min(props.data.length, props.maxCount);

    if (!props.showDiff) {
        return <Table size="sm">
            <thead>
                <tr><th>Category</th><th>Current</th></tr>
            </thead>
            <tbody>
                {props.data
                    .filter(x => x.sum() > 0)
                    .sort((x, y) => y.sum() - x.sum())
                    .slice(0, count)
                    .map(x =>
                        <tr>
                            <td>{x.name}</td>
                            <td>${x.sum().toFixed(2)}</td>
                        </tr>
                    )}
            </tbody>
        </Table>;
    }

    return <Table size="sm">
        <thead>
            <tr><th>Category</th><th>Previous</th><th>Current</th><th>Diff</th></tr>
        </thead>
        <tbody>
            {props.data
                .sort((x, y) => y.sum() - x.sum())
                .slice(0, count)
                .map(x => 
                    <tr>
                        <td>{x.name}</td>
                        <td>{formatValue(x.existing + x.removed)}</td>
                        <td>{formatValue(x.sum())}</td>
                        <td>{formatValue(x.added - x.removed)} {formatDiff(x.added - x.removed)}</td>
                    </tr>
                )}
        </tbody>
    </Table>;
};

function formatValue(value: number): string {
    return value ? "$"+value.toFixed(2): "";
}

function formatDiff(value: number): string {
    if (value > 0) return "↑";
    if (value < 0) return "↓";
    return "";
}

export default ReportDiff;