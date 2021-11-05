import * as React from "react";
import Form from 'react-bootstrap/Form';

const BasicInput = (props: any) => {
    return (
        <Form.Group controlId={props.name}>
            <Form.Label>{props.name} </Form.Label>
            <Form.Control type={props.type} value={props.value} onChange={props.onChange} />
        </Form.Group>
    );
}

export default BasicInput;