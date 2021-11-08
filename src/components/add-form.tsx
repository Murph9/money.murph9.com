import * as React from "react";
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import FloatingLabel from "react-bootstrap/FloatingLabel";
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import JournalEntry, { DayType, parseDayType } from "../utils/db-row";
import TypeAhead from "./typeahead.js";

const AddForm = (props: any) => {
    const [alert, setAlert] = React.useState<string>();

    const amount = React.createRef<HTMLInputElement>();
    const isIncome = React.createRef<HTMLInputElement>();

    const from = React.createRef<HTMLInputElement>();
    const periodCount = React.createRef<HTMLInputElement>();

    const periodType = React.createRef<HTMLSelectElement>();

    const [repeats, setRepeats] = React.useState();
    const lastDay = React.createRef<HTMLInputElement>();
    
    const [category, setCategorySelections] = React.useState([]);
    const [categorySearch, setCategorySearch] = React.useState();

    const note = React.createRef<HTMLTextAreaElement>();

    // TODO get values from props.entry to edit a record

    const save = (event: any) => {
        event.preventDefault();

        const categoryNew = category.length < 1 ? categorySearch : category[0].label;
        if (!categoryNew) {
            setAlert("Please set a category");
            return;
        }

        const entry = new JournalEntry();
        entry.isIncome = isIncome.current.checked;
        entry.from = from.current.valueAsDate;
        entry.amount = amount.current.valueAsNumber;
        entry.lengthCount = periodCount.current.valueAsNumber;
        entry.lengthType = parseDayType(periodType.current.value);
        entry.repeats = repeats;
        entry.lastDay = lastDay.current ? lastDay.current.valueAsDate : null;
        entry.category = categoryNew;
        entry.note = note.current.value;

        setAlert(entry.validate());

        if (alert) {
            return;
        }

        console.log("Saving:", entry);
        props.save(entry);
    }
    

    return (
    <Modal show={props.show} onHide={props.exit} animation={false}>
        <Modal.Header closeButton>
            <Modal.Title>Add Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {alert ? <Alert variant="danger">{alert}</Alert> : null}
            <Form onSubmit={save}>
                <Form.Group as={Row} className="mb-3">
                    <Col sm={7}>
                        <InputGroup>
                            <InputGroup.Text>$</InputGroup.Text>
                            <FloatingLabel label="Amount">
                                <Form.Control type="number" defaultValue={0} ref={amount} />
                            </FloatingLabel>
                        </InputGroup>
                    </Col>
                    <Col sm={5}>
                        <Form.Check id="isIncome" ref={isIncome} label="Is Income" />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={4}>Start Date</Form.Label>
                    <Col sm={8}>
                        <Form.Control type="date" ref={from} defaultValue={new Date().toISOString().slice(0, 10)} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                    <Col sm={4}>
                        <Form.Control type="number" min="0" ref={periodCount} defaultValue={1} />
                    </Col>
                    <Col sm={8}>
                        <Form.Select ref={periodType} defaultValue={DayType.Day}>
                            <option value={DayType.Day}>Day</option>
                            <option value={DayType.Week}>Week</option>
                            <option value={DayType.Month}>Month</option>
                            <option value={DayType.Quarter}>Quarter</option>
                            <option value={DayType.Year}>Year</option>
                        </Form.Select>
                    </Col>
                </Form.Group>
                
                <Form.Group as={Row} className="mb-3">
                    <Col sm={4}>
                        <Form.Check id="repeats" value={repeats} onChange={(e:any) => setRepeats(e.currentTarget.checked)} label={!repeats ? "Repeats?" : "Repeats until"} />
                    </Col>
                    <Col sm={8}>
                        {repeats ? <Form.Control type="date" ref={lastDay} /> : null}
                    </Col>
                </Form.Group>
                
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={4}>Category</Form.Label>
                    <Col sm={8}>
                        <TypeAhead id="categoryButBetter" options={['TODO', 'bbb', 'tree']} selected={category} onChange={setCategorySelections} onInputChange={setCategorySearch} />
                    </Col>
                </Form.Group>
                
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={4}>Free text</Form.Label>
                    <Col sm={8}>
                        <Form.Control ref={note} as="textarea"/>
                    </Col>
                </Form.Group>
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
