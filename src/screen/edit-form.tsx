import React from "react";
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
import TypeAhead from "../components/typeahead.js";
import DateLib from "../utils/date-helpers";
import Calc from "../utils/calc";

class EditFormProps {
    show: boolean;
    save: (row: JournalEntry) => void;
    exit: () => void;
    delete: (row: JournalEntry) => void;
    entry: JournalEntry | undefined;
    categoryList: Array<string>;
    calc: Calc;
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

    const fromDefault = DateLib.addOffsetToDate(new Date());
    const from = React.createRef<HTMLInputElement>();
    const periodCount = React.createRef<HTMLInputElement>();

    const periodType = React.createRef<HTMLSelectElement>();

    const repeats = React.createRef<HTMLInputElement>();
    const lastDay = React.createRef<HTMLInputElement>();
    
    const [category, setCategorySelections] = React.useState<Array<{label: string}>>([]);
    const [categorySearch, setCategorySearch] = React.useState<string>(getValueOf('category', null));
    const categoryOnChange = (e: Array<{label:string}>) => {
        setCategorySelections(e);
        if (e && e.length > 0) {
            e[0].label = e[0].label.toLowerCase().trim();
            if (!props.entry) {
                var defaults = props.calc.getCategoryDefault(e[0].label);
                if (periodType.current)
                    periodType.current.value = defaults.type.toString();
                if (periodCount.current)
                    periodCount.current.value = defaults.count.toString();
                
                //hide android keyboard
                if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                }
            }
        }
    }

    const note = React.createRef<HTMLTextAreaElement>();

    const [deleteConfirm, setDeleteConfirm] = React.useState(false);

    const save = (event: any) => {
        event.preventDefault();

        if (!(isIncome.current) || !(from.current) || !(periodCount.current) 
                || !(amount.current) || !(repeats.current)
                || !(periodType.current)) {
            setAlert("form invalid");
            return;
        }

        let categoryNew : string | null = null;
        let categoryMaybe = category.length < 1 ? { label: categorySearch } : category[0];
        if (categoryMaybe && categoryMaybe.hasOwnProperty('label'))
            categoryNew = categoryMaybe.label;
        else {
            setAlert("Please set a category");
            return;
        }

        const entry = new JournalEntry();
        entry.id = props.entry ? props.entry.id : -1;
        entry.isIncome = isIncome.current.checked;
        entry.from = from.current.valueAsDate || new Date();
        entry.amount = amount.current.valueAsNumber;
        entry.lengthCount = periodCount.current.valueAsNumber;
        entry.lengthType = DayTypeLib.parseDayType(periodType.current.value);
        entry.repeats = repeats.current.checked;
        if (lastDay.current)
            entry.lastDay = lastDay.current.valueAsDate ?? undefined;
        entry.category = categoryNew.toLowerCase(); // always lowercase please
        if (note.current)
            entry.note = note.current.value;

        const message = entry.validate();
        if (message) {
            setAlert(message);
            return;
        }

        console.log("Saving:", entry);
        props.save(entry);
    }

    const [perDay, setPerDay] = React.useState(props.entry ? props.entry.calcPerDay() : 0);

    const setUpdatedPerDay = () => {
        let perDay = 0;
        if (amount.current && periodType.current && periodCount.current) {
            const dayType = DayTypeLib.parseDayType(periodType.current.value);
            perDay = amount.current.valueAsNumber/DayTypeLib.calcDayCount(dayType, +periodCount.current.valueAsNumber);
        }
        setPerDay(perDay);
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
                    <Col xs={7}>
                        <InputGroup>
                            <InputGroup.Text>$</InputGroup.Text>
                            <FloatingLabel label="Amount">
                                <Form.Control type="number" defaultValue={getValueOf('amount', 0)} ref={amount} onChange={setUpdatedPerDay} autoFocus={!props.entry} />
                            </FloatingLabel>
                        </InputGroup>
                    </Col>
                    <Col xs={5}>
                        <Form.Check id="isIncome" ref={isIncome} label="Is Income" defaultChecked={getValueOf('isIncome', false)} />
                        ${perDay.toFixed(2)}/day
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                    <Form.Label column xs={4}>Category</Form.Label>
                    <Col xs={8}>
                        <TypeAhead id="categoryButBetter"
                            options={props.categoryList.map(x => { return {'label':x};}) || []}
                            defaultSelected={[getValueOf('category', '')]}
                            onChange={categoryOnChange}
                            onInputChange={setCategorySearch}
                            placeholder="Select a Category"/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                    <Form.Label column xs={4}>Start Date</Form.Label>
                    <Col xs={8}>
                        <Form.Control type="date" ref={from} defaultValue={getValueOf('from', fromDefault).toISOString().slice(0, 10)} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                    <Col xs={4}>
                        <Form.Control type="number" min="0" ref={periodCount} defaultValue={getValueOf('lengthCount', 1)} onChange={setUpdatedPerDay}/>
                    </Col>
                    <Col xs={8}>
                        <Form.Select ref={periodType} defaultValue={getValueOf('lengthType', DayType.Day)} onChange={setUpdatedPerDay}>
                            <option value={DayType.Day}>Day</option>
                            <option value={DayType.Week}>Week</option>
                            <option value={DayType.Month}>Month</option>
                            <option value={DayType.Quarter}>Quarter</option>
                            <option value={DayType.Year}>Year</option>
                        </Form.Select>
                    </Col>
                </Form.Group>
                
                <Form.Group as={Row} className="mb-3">
                    <Col xs={4}>
                        <Form.Check id="repeats" ref={repeats} defaultChecked={getValueOf('repeats', false)} label="Repeats?" />
                    </Col>
                    <Col xs={8}>
                        <Form.Control type="date" ref={lastDay} defaultValue={getValueOf('lastDay', null) ? getValueOf('lastDay', null).toISOString().slice(0, 10) : null} />
                    </Col>
                </Form.Group>
                                
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column xs={4}>Free text</Form.Label>
                    <Col xs={8}>
                        <Form.Control ref={note} as="textarea" defaultValue={getValueOf('note', null)} />
                    </Col>
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            {props.entry && deleteConfirm && <Button variant="danger" onClick={() => props.entry ? props.delete(props.entry) : null}>REALLY DELETE?</Button>}
            <Button variant="secondary" onClick={props.exit}>Close</Button>
            <Button variant="primary" onClick={save}>Save Changes</Button>
            {props.entry && <Button variant="danger" disabled={deleteConfirm} onClick={() => setDeleteConfirm(true)}>Delete</Button>}
        </Modal.Footer>
    </Modal>
    );
};
export default EditForm;
