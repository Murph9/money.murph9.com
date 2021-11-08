import * as React from "react";
import Button from 'react-bootstrap/Button';
import JournalEntry from "../utils/db-row";
import AddForm from './add-form';

const MainForm = (props: any) => {
    const [add, setAdd] = React.useState(false);
    const handleShow = () => setAdd(true);
    const handleClose = (obj: JournalEntry) => {
        setAdd(false);
        if (obj != null && !(obj instanceof JournalEntry))
            throw new Error("Returned object was not the right type " + obj);
        //TODO do stuff with obj
    }
    const handleExit = () => setAdd(false);

    return (<>
        <div>Yo</div>
        <Button variant="primary" onClick={handleShow}>Add</Button>
        <AddForm show={add} save={handleClose} exit={handleExit} entry={new JournalEntry()}/>
        
        <div>{JSON.stringify(props.data)}</div>
    </>);
};

export default MainForm;