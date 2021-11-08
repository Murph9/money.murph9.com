import * as React from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import FloatingLabel from "react-bootstrap/FloatingLabel";
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import JournalEntry, { DayType } from "../utils/db-row";


const AddForm = (props: any) => {
    const amount = React.createRef<HTMLInputElement>();
    const isIncome = React.createRef<HTMLInputElement>();

    const from = React.createRef<HTMLInputElement>();
    const periodCount = React.createRef<HTMLInputElement>();

    const periodType = React.createRef<HTMLSelectElement>();

    const [repeats, setRepeats] = React.useState();
    const lastDay = React.createRef<HTMLInputElement>();
    
    const category = React.createRef<HTMLSelectElement>();
    const note = React.createRef<HTMLTextAreaElement>();

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
                        <Form.Control type="number" defaultValue={0} ref={amount} />
                    </FloatingLabel>

                    <Form.Check id="isIncome" ref={isIncome} label="Is Income" />
                </InputGroup>

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
                        <Form.Select ref={category} >
                            <option>Please generate this</option>
                            <option>really</option>
                        </Form.Select>
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
