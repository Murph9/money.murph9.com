import * as React from "react";
import ToggleButton from 'react-bootstrap/ToggleButton';
import Form from 'react-bootstrap/Form';

export const BasicInput = (props: any) => {
    return (<Form.Control id={props.id} type={props.type} value={props.value}
            onChange={(e:any) => {props.onChange(e.currentTarget.value)}}
    />);
}

export const BasicTextArea = (props: any) => {
    return (<Form.Control value={props.value} as="textarea"
            onChange={(e:any) => {props.onChange(e.currentTarget.value)}}
    />);
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
