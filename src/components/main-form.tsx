import * as React from "react";
import Button from 'react-bootstrap/Button';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';

import JournalEntry from "../utils/db-row";
import Calc from "../utils/calc";
import EditForm from './edit-form';
import RecordList from "./record-list";
import BarGraphView from './bar-graph-view';

class MainFormProps {
    data: Array<JournalEntry>;
    addRow: (row: JournalEntry) => void;
    calc: Calc;
}

const MainForm = (props: MainFormProps) => {
    const [edit, setEdit] = React.useState(false);
    
    const handleEditClose = (obj: JournalEntry) => {
        setEdit(false);
        if (obj != null && !(obj instanceof JournalEntry)) {
            throw new Error("Returned object was not the right type " + obj);
        }

        setShowToast("Record saved, yay");
        addEditEntry(null);
        props.addRow(obj);
    }
    const handleAddExit = () => {
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

    return (<>
        <Button variant="primary" onClick={() => setEdit(true)}>Add</Button>
        <EditForm show={edit} save={handleEditClose} exit={handleAddExit} entry={editEntry} categoryList={props.calc.categories} />

        <BarGraphView calc={props.calc} />

        <Button variant="secondary" onClick={() => setList(!list)}>View All Records</Button>
        {list ? <RecordList data={props.data} edit={handleEditEntry}/> : null}

        <ToastContainer className="p-3" position={'top-center'}>
            <Toast show={!!showToast} onClose={() => setShowToast(null)} delay={3000} autohide bg='snfo'>
                <Toast.Header>
                    <strong className="me-auto">{showToast}</strong>
                    <small>(just now)</small>
                </Toast.Header>
            </Toast>
        </ToastContainer>
    </>);
};

export default MainForm;