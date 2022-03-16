import * as React from "react";
import Button from 'react-bootstrap/Button';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';

import JournalEntry from "../utils/db-row";
import Calc from "../utils/calc";
import EditForm from '../screen/edit-form';
import Report from './report';
import FullRecordList from "./full-record-list";
import BarGraphView from './bar-graph-view';
import { DayType } from "../utils/day-type";

class MainFormProps {
    data: Array<JournalEntry>;
    calc: Calc;
    editRow: (row: JournalEntry) => void;
    deleteRow: (row: JournalEntry) => void;
}

class TypeAndDate {
    date: Date;
    type: DayType;
}

const MainForm = (props: MainFormProps) => {
    const [edit, setEdit] = React.useState(false);
    
    const handleEditClose = (obj: JournalEntry) => {
        setEdit(false);
        if (obj != null && !(obj instanceof JournalEntry)) {
            throw new Error("Returned object was not the right type " + obj);
        }

        setShowToast("Record saved. Yay");
        addEditEntry(null);
        props.editRow(obj);
    }
    const handleEditExit = () => {
        setShowToast("Record not saved");
        setEdit(false);
        addEditEntry(null);
    };

    const [showToast, setShowToast] = React.useState("");
    const [list, setList] = React.useState(false);

    const [editEntry, addEditEntry] = React.useState(null);
    const handleEditEntry = (row: JournalEntry) => {
        if (!row)
            alert('journal entry not set during edit');
        addEditEntry(row);
        setEdit(true);
    }

    const handleDelete = (row: JournalEntry) => {
        props.deleteRow(row);
        setEdit(false);
        addEditEntry(null);
    }

    const [report, setReport] = React.useState<TypeAndDate>(null);

    const viewReportFor = (type: DayType, date: Date) => {
        const td = new TypeAndDate();
        td.type = type;
        td.date = date;
        setReport(td);
    }

    return (<>
        <div>
            <h1 style={{textAlign:'center'}}>
                {`$${props.calc.totalFor(DayType.Day, new Date()).toFixed(2)}`}
                <span style={{fontSize: '.475em'}}>/day, today</span>
                
            </h1>
            <span style={{float: 'left'}}>
                <Button variant="primary" onClick={() => setEdit(true)}>Add</Button>
            </span>

            {!list &&
                <span style={{float: 'right'}}>
                    <Button variant="secondary" onClick={() => setList(!list)}>View All</Button>
                </span>
            }

            { edit && <EditForm key={new Date().getTime()} show={edit} entry={editEntry} categoryList={props.calc.categories} calc={props.calc} save={handleEditClose} exit={handleEditExit} delete={handleDelete} /> }
        </div>

        <BarGraphView calc={props.calc} viewReport={viewReportFor}/>
        {report && <Report calc={props.calc} date={report.date} type={report.type} closeCallback={() => setReport(null)} />}

        
        <FullRecordList data={props.data} show={list} edit={handleEditEntry} exit={() => setList(false)}/>

        <ToastContainer className="p-3" position={'top-center'}>
            <Toast show={!!showToast} onClose={() => setShowToast(null)} delay={2000} autohide bg='snfo'>
                <Toast.Header>
                    <strong className="me-auto">{showToast}</strong>
                    <small>(just now)</small>
                </Toast.Header>
            </Toast>
        </ToastContainer>
    </>);
};

export default MainForm;