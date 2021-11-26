import * as React from "react";

function difference(a1: Array<{name: string, amount: number, income: boolean}>, a2: Array<{name: string, amount: number, income: boolean}>) {
    var result = [];
    for (var i = 0; i < a1.length; i++) {
        if (a2.filter(e => e.name == a1[i].name && e.amount == a1[i].amount).length != 0) {

        } else {
            let diff = a2.filter(e => e.name == a1[i].name);
            if (diff.length != 0) {
                result.push({name: a1[i].name, amount: diff[0].amount - a1[i].amount, income: a1[i].income});
            } else {
                result.push(a1[i]);
            }
        }
    }
    return result;
}

class DiffReportProps {
    prev: Map<string, number>;
    cur: Map<string, number>;
}

const DiffReport = (props: DiffReportProps) => {

    const prevList = Array.from(props.prev, ([name, value]) => ({ name, amount: Math.abs(value), income: value > 0 }));
    const curList = Array.from(props.cur, ([name, value]) => ({ name, amount: Math.abs(value), income: value > 0 }));

    const added = difference(curList, prevList);
    const removed = difference(difference(prevList, curList), added.map(x => { x.amount *= -1; return x; }));

    return (<>
        {added.length > 0 && <div>Added: {added.map(x => <span>{x.name}={x.amount.toFixed(2)}</span>)}</div>}
        {removed.length > 0 && <div>Removed: {removed.map(x => <span>{x.name}={x.amount.toFixed(2)}</span>)}</div>}
    </>);
}

export default DiffReport;