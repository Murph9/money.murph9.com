import * as React from "react";
import Button from 'react-bootstrap/Button';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';

import JournalEntry from "../utils/db-row";
import AddForm from './add-form';
import RecordList from "./record-list";

const MainForm = (props: any) => {
    const [add, setAdd] = React.useState(false);
    const handleShow = () => setAdd(true);
    const handleClose = (obj: JournalEntry) => {
        setAdd(false);
        if (obj != null && !(obj instanceof JournalEntry)) {
            throw new Error("Returned object was not the right type " + obj);
        }

        setShowToast("Record saved, yay");
        props.addRow(obj);
    }
    const handleExit = () => {
        setShowToast("Record not saved");
        setAdd(false);
    };
    const [showToast, setShowToast] = React.useState("");

    const [list, setList] = React.useState(false);
    const handleList = () => setList(true);

    return (<>
        <Button variant="primary" onClick={handleShow}>Add</Button>
        <AddForm show={add} save={handleClose} exit={handleExit} entry={new JournalEntry()}/>
        
        <Button variant="secondary" onClick={handleList}>View All Records</Button>
        <RecordList data={props.data} />

        <ToastContainer className="p-3" position={'top-center'}>
            <Toast show={!!showToast} onClose={() => setShowToast(null)} delay={3000} autohide bg='snfo'>
                <Toast.Header>
                    <strong className="me-auto">{showToast}</strong>
                    <small>(just then)</small>
                </Toast.Header>
            </Toast>
        </ToastContainer>
    </>);
};

export default MainForm;