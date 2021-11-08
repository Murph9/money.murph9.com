import * as React from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import FloatingLabel from "react-bootstrap/FloatingLabel";
import InputGroup from 'react-bootstrap/InputGroup';
import JournalEntry, { DayType } from "../utils/db-row";
import { BasicInput, BasicTextArea, BasicCheckbox } from "./basic-input";


const AddForm = (props: any) => {
    const [amount, setAmount] = React.useState(0);
    const [isIncome, setIsIncome] = React.useState(false);
    const [from, setFrom] = React.useState(new Date().toISOString().slice(0, 10));
    const [lengthCount, setLengthCount] = React.useState(1);
    const [lengthType, setLengthType] = React.useState(DayType.Day);
    const [repeats, setRepeats] = React.useState(false);
    const [lastDay, setLastDay] = React.useState(null);
    const [category, setCategory] = React.useState("");
    const [note, setNote] = React.useState("");

    const save = (event: any) => {
        event.preventDefault();

        props.save(null);
    }
    

    return (
    <Modal show={props.show} onHide={props.exit} animation={false}>
        <Modal.Header closeButton>
            <Modal.Title>Add Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={save}>
                <InputGroup className="mb-3">
                    <InputGroup.Text>$</InputGroup.Text>
                    <FloatingLabel label="Amount">
                        <BasicInput type="number" value={amount} onChange={setAmount} required={true} />
                    </FloatingLabel>

                    <BasicCheckbox name="Is Income" onChange={setIsIncome} checked={isIncome} />
                </InputGroup>
                

                <BasicInput type="date" value={from} onChange={setFrom} />
                    
                <BasicInput type="number" value={lengthCount} onChange={setLengthCount} />
                <BasicInput type="select" value={lengthType} onChange={setLengthType} />

                <BasicCheckbox checked={repeats} onChange={setRepeats} name="Repeats?" />
                
                {repeats ? <BasicInput type="date" value={lastDay} onChange={setLastDay} /> : <></>}
                
                <BasicInput value={category} onChange={setCategory} />
                <BasicTextArea value={note} onChange={setNote} />
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.exit}>Close</Button>
          <Button variant="primary" onClick={save}>Save Changes</Button>
        </Modal.Footer>
    </Modal>
    );
};
export default AddForm;
