import * as React from "react";
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import FloatingLabel from "react-bootstrap/FloatingLabel";
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import JournalEntry from "../utils/db-row";
import DayTypeLib, { DayType } from "../utils/day-type";
import TypeAhead from "./typeahead.js";

class EditFormProps {
    show: boolean;
    save: (row: JournalEntry) => void;
    exit: () => void;
    delete: (row: JournalEntry) => void;
    entry: JournalEntry;
    categoryList: Array<string>;
}

const EditForm = (props: EditFormProps) => {
    const [alert, setAlert] = React.useState<string>();
    const getValueOf = (field: string, fallback: any): any => {
        if (props.entry) {
            return props.entry[field];
        }
        return fallback;
    }

    const amount = React.createRef<HTMLInputElement>();
    const isIncome = React.createRef<HTMLInputElement>();

    const from = React.createRef<HTMLInputElement>();
    const periodCount = React.createRef<HTMLInputElement>();

    const periodType = React.createRef<HTMLSelectElement>();

    const repeats = React.createRef<HTMLInputElement>();
    const lastDay = React.createRef<HTMLInputElement>();
    
    const [category, setCategorySelections] = React.useState([]);
    const [categorySearch, setCategorySearch] = React.useState();

    const note = React.createRef<HTMLTextAreaElement>();

    const [deleteConfirm, setDeleteConfirm] = React.useState(false);

    const save = (event: any) => {
        event.preventDefault();

        let categoryNew = category.length < 1 ? categorySearch : category[0];
        if (categoryNew && categoryNew.hasOwnProperty('label'))
            categoryNew = categoryNew.label;
        if (!categoryNew) {
            setAlert("Please set a category");
            return;
        }

        const entry = new JournalEntry();
        entry.id = props.entry ? props.entry.id : -1;
        entry.isIncome = isIncome.current.checked;
        entry.from = from.current.valueAsDate;
        entry.amount = amount.current.valueAsNumber;
        entry.lengthCount = periodCount.current.valueAsNumber;
        entry.lengthType = DayTypeLib.parseDayType(periodType.current.value);
        entry.repeats = repeats.current.checked;
        entry.lastDay = lastDay.current ? lastDay.current.valueAsDate : null;
        entry.category = categoryNew;
        entry.note = note.current.value;

        const message = entry.validate();
        if (message) {
            setAlert(message);
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
                                <Form.Control type="number" defaultValue={getValueOf('amount', 0)} ref={amount} />
                            </FloatingLabel>
                        </InputGroup>
                    </Col>
                    <Col sm={5}>
                        <Form.Check id="isIncome" ref={isIncome} label="Is Income" defaultChecked={getValueOf('isIncome', false)} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={4}>Start Date</Form.Label>
                    <Col sm={8}>
                        <Form.Control type="date" ref={from} defaultValue={getValueOf('from', new Date()).toISOString().slice(0, 10)} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                    <Col sm={4}>
                        <Form.Control type="number" min="0" ref={periodCount} defaultValue={getValueOf('lengthCount', 1)} />
                    </Col>
                    <Col sm={8}>
                        <Form.Select ref={periodType} defaultValue={getValueOf('lengthType', DayType.Day)}>
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
                        <Form.Check id="repeats" ref={repeats} defaultChecked={getValueOf('repeats', false)} label="Repeats?" />
                    </Col>
                    <Col sm={8}>
                        <Form.Control type="date" ref={lastDay} defaultValue={getValueOf('lastDay', null) ? getValueOf('lastDay', null).toISOString().slice(0, 10) : null} />
                    </Col>
                </Form.Group>
                
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={4}>Category</Form.Label>
                    <Col sm={8}>
                        <TypeAhead id="categoryButBetter" options={props.categoryList || []} defaultSelected={[getValueOf('category', '')]} onChange={setCategorySelections} onInputChange={setCategorySearch} />
                    </Col>
                </Form.Group>
                
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={4}>Free text</Form.Label>
                    <Col sm={8}>
                        <Form.Control ref={note} as="textarea" defaultValue={getValueOf('note', null)} />
                    </Col>
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            {props.entry && deleteConfirm && <Button variant="danger" onClick={() => props.delete(props.entry)}>REALLY DELETE?</Button>}
            <Button variant="secondary" onClick={props.exit}>Close</Button>
            <Button variant="primary" onClick={save}>Save Changes</Button>
            {props.entry && <Button variant="danger" disabled={deleteConfirm} onClick={() => setDeleteConfirm(true)}>Delete</Button>}
        </Modal.Footer>
    </Modal>
    );
};
export default EditForm;
