import * as React from "react";

class ReportProps {
    data: Map<string, number>
}

const Report = (props: ReportProps) => {

    const list = Array.from(props.data);
    list.sort((x: object, y: object) => {
        return +x[1] - +y[1];
    });
    return (<table>
        {list.map(x => <tr><td>{x[0]}</td><td>{x[1].toFixed(2)}</td></tr>)}
    </table>);
}
export default Report;