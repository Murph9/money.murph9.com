import * as React from "react";
import ToggleButton from 'react-bootstrap/ToggleButton';
import Form from 'react-bootstrap/Form';

export const BasicInput = (props: any) => {
    return (
        <Form.Group controlId={props.name}>
            <Form.Label>{props.name} </Form.Label>
            <Form.Control type={props.type} value={props.value} onChange={props.onChange} />
        </Form.Group>
    );
}

export const BasicCheckbox = (props: any) => {
    return (<ToggleButton type="checkbox"
        value="1"
        id={props.name}
        variant="outline-primary"
        checked={props.checked}
        onChange={(e:any) => {props.onChange(e.currentTarget.checked)}}>
            {props.name}
        </ToggleButton>);
}