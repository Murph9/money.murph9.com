import React from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import { AwsS3Config } from "../utils/s3-controller";

const getFromLocalStorage = function(key: string, fallback: string) {
    if (typeof window === 'undefined')
        return fallback;
    
    const result = window.localStorage.getItem(key)
    if (result)
        return result;
    return fallback;
}

class LoginFormProps {
    bucketRegion: string;
    inWebView: boolean;
    loggedOut: boolean;
    callback: (creds: AwsS3Config, fileName: string) => void;
}

const LoginForm = (props: LoginFormProps) => {
    const bucket = React.createRef<HTMLInputElement>();
    const bucketRegion = React.createRef<HTMLInputElement>();
    const fileName = React.createRef<HTMLInputElement>();
    const apiKey = React.createRef<HTMLInputElement>();
    const apiSecret = React.createRef<HTMLInputElement>();
    let submitted: boolean = false;

    React.useEffect(() => {
        if (!submitted && !props.loggedOut && getAllSet()) {
            submitted = true;
            submit(null);
        }
    });

    const getAllSet = function() {
        return (apiKey.current && apiKey.current.value
            && apiSecret.current && apiSecret.current.value
            && bucket.current && bucket.current.value
            && fileName.current && fileName.current.value);
    }

    const getFromLocalStorageInWebView = function(key: string, fallback: string) {
        if (props.inWebView)
            return getFromLocalStorage(key, fallback);
        return fallback;
    }

    const submit = function(evt: any) {
        evt && evt.preventDefault();

        if (!getAllSet()) {
            // TODO better validation please
            alert('All fields must be set.');
            return;
        }

        if (typeof window !== 'undefined') {
            window.localStorage.setItem("bucket", bucket.current!.value);
            window.localStorage.setItem("fileName", fileName.current!.value);
            if (props.inWebView) {
                window.localStorage.setItem("apiKey", apiKey.current!.value);
                window.localStorage.setItem("apiSecret", apiSecret.current!.value);
            }
        }
        
        const creds = new AwsS3Config();
        creds.apiKey = apiKey.current!.value;
        creds.apiSecret = apiSecret.current!.value;
        creds.bucketName = bucket.current!.value;
        creds.bucketRegion = bucketRegion.current!.value;
        
        props.callback(creds, fileName.current!.value);
    }

    return (
        <Container>
        <Form onSubmit={submit}>
            <Form.Group as={Row} className="mb-3">
                <Form.Label column xs={3}>AWS Bucket Name</Form.Label>
                <Col xs={6}>
                    <Form.Control ref={bucket} defaultValue={getFromLocalStorage("bucket", "")}/> 
                </Col>
                <Form.Label column xs={1}>@</Form.Label>
                <Col xs={2}>
                    <Form.Control ref={bucketRegion} defaultValue={props.bucketRegion}/> 
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
            <Form.Label column xs={3}>Bucket Full Path</Form.Label>
                <Col xs={9}>
                    <Form.Control ref={fileName} defaultValue={getFromLocalStorage("fileName", "")}/>
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
                <Form.Label column xs={3}>AWS Api Key</Form.Label>
                <Col xs={9}>
                    <Form.Control ref={apiKey} defaultValue={getFromLocalStorageInWebView("apiKey", "")} />
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
                <Form.Label column xs={3}>AWS Api Secret</Form.Label>
                <Col xs={9}>
                    <Form.Control type="password" ref={apiSecret} defaultValue={getFromLocalStorageInWebView("apiSecret", "")} />
                </Col>
            </Form.Group>

            <Button type="submit">Login</Button>
        </Form>
        </Container>
    );
};

export default LoginForm;