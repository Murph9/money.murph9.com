import * as React from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import JournalEntry, { DayType } from "../utils/db-row";
import { BasicInput, BasicCheckbox } from "./basic-input";

const AddForm = (props: any) => {
    const [amount, setAmount] = React.useState(0);
    const [isIncome, setIsIncome] = React.useState(false);
    const [from, setFrom] = React.useState(new Date());
    const [lengthCount, setLengthCount] = React.useState(1);
    const [lengthType, setLengthType] = React.useState(DayType.Day);
    const [repeats, setRepeats] = React.useState(false);
    const [lastDay, setLastDay] = React.useState(null);
    const [category, setCategory] = React.useState(null);
    const [note, setNote] = React.useState(null);

    const save = () => {
        props.save(null);
    }
    
    return (
    <Modal show={props.show} onHide={props.exit} animation={false}>
        <Modal.Header closeButton>
            <Modal.Title>Add Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <BasicInput type="number" value={amount} onChange={setAmount} name="Amount" />
            <BasicCheckbox name="Is Income" onChange={setIsIncome} checked={isIncome}/>

            <BasicInput type="date" value={from} onChange={setFrom} name="Starts" />
                
            <BasicInput type="number" value={lengthCount} onChange={setLengthCount} name="Count" />
            <BasicInput type="select" value={lengthType} onChange={setLengthType} name="Period" />

            <BasicCheckbox checked={repeats} onChange={setRepeats} name="Repeats?" />
            
            {repeats ? <BasicInput type="date" value={lastDay} onChange={setLastDay} name="Last Day" /> : <></>}
            
            <BasicInput value={category} onChange={setCategory} name="Category" />
            <BasicInput value={note} onChange={setNote} name="Note" />

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.exit}>Close</Button>
          <Button variant="primary" onClick={save}>Save Changes</Button>
        </Modal.Footer>
    </Modal>
    );
};
export default AddForm;
