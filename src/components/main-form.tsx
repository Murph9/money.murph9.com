import * as React from "react";
import Button from 'react-bootstrap/Button';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';

import JournalEntry from "../utils/db-row";
import AddForm from './add-form';

const MainForm = (props: any) => {
    const [add, setAdd] = React.useState(false);
    const handleShow = () => setAdd(true);
    const handleClose = (obj: JournalEntry) => {
        setAdd(false);
        if (obj != null && !(obj instanceof JournalEntry)) {
            throw new Error("Returned object was not the right type " + obj);
        }
        
        props.addRow(obj);
    }
    const handleExit = () => {
        setNoSaveToast(true);
        setAdd(false);
    };

    const [showNoSaveToast, setNoSaveToast] = React.useState(false);

    return (<>
        <div>Yo</div>
        <Button variant="primary" onClick={handleShow}>Add</Button>
        <AddForm show={add} save={handleClose} exit={handleExit} entry={new JournalEntry()}/>
        
        <div>{JSON.stringify(props.data)}</div>

        <ToastContainer className="p-3" position={'top-center'}>
            <Toast show={showNoSaveToast} onClose={() => setNoSaveToast(false)} delay={3000} autohide bg='snfo'>
                <Toast.Header>
                    <strong className="me-auto">Record not saved</strong>
                    <small>(just then)</small>
                </Toast.Header>
                
            </Toast>
        </ToastContainer>
    </>);
};

export default MainForm;