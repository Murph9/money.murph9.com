import React from "react";
import Table from 'react-bootstrap/Table';

class ReportTableProps {
    data: Array<ReportRow>;
    showDiff: boolean;
    widthPercent?: number;
    maxCount?: number;
}

import { ReportRow } from "../screen/report";

const ReportTable = (props: ReportTableProps) => {
    const count = Math.min(props.data.length, props.maxCount ?? 150);
    const showingAll = count == props.data.length;
    const total = props.data.reduce((total, a) => total + a.sum(), 0);
    const totalLast = props.data.reduce((total, a) => total + a.existing + a.removed, 0);
    const totalDiff = props.data.reduce((total, x) => total + x.added - x.removed, 0);
    
    const nameWidth = (props.widthPercent ?? 60) + '%';
    console.log(nameWidth);
    if (!props.showDiff) {
        return <Table size="sm">
            <thead>
                <tr><th>Category</th><th>Current</th><th>Percentage</th></tr>
            </thead>
            <tbody>
                {props.data
                    .filter(x => x.sum() > 0)
                    .sort((x, y) => y.sum() - x.sum())
                    .slice(0, count)
                    .map(x =>
                        <tr>
                            <td style={{width: nameWidth}}>{x.name}</td>
                            <td>{formatValue(x.sum())}</td>
                            <td>{(100*x.sum()/total).toFixed(2)}%</td>
                        </tr>
                    )}
                {!showingAll && <tr><td>....... and {props.data.length-count} more</td><td></td><td></td></tr>}
                <tr><td><strong>Total</strong></td><td><strong>{formatValue(total)}</strong></td><td></td></tr>
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
                        <td style={{width: nameWidth}}>{x.name}</td>
                        <td>{formatValue(x.existing + x.removed)}</td>
                        <td>{formatValue(x.sum())}</td>
                        <td>{formatValue(x.added - x.removed)} {formatDiff(x.added - x.removed)}</td>
                    </tr>
                )}
            {!showingAll && <tr><td>....... and {props.data.length-count} more</td><td></td><td></td><td></td></tr>}
            <tr>
                <td><strong>Total</strong></td>
                <td><strong>{formatValue(totalLast)}</strong></td>
                <td><strong>{formatValue(total)}</strong></td>
                <td><strong>{formatValue(totalDiff)} {formatDiff(totalDiff)}</strong></td>
            </tr>
        </tbody>
    </Table>;
};

function formatValue(value: number): string {
    return value ? "$"+value.toFixed(2): "---";
}

function formatDiff(value: number): string {
    if (value > 0) return "↑";
    if (value < 0) return "↓";
    return "";
}

export default ReportTable;