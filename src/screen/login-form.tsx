import * as React from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FloatingLabel from "react-bootstrap/FloatingLabel";
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

const LoginForm = (props: any) => {
    const bucket = React.createRef<HTMLInputElement>();
    const region = React.createRef<HTMLInputElement>();
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
        return (apiKey.current.value && apiSecret.current.value && bucket.current.value && region.current.value);
    }

    const getFromLocalStorageInWebView = function(key: string, fallback: string) {
        if (props.inWebView)
            return getFromLocalStorage(key, fallback);
        return fallback;
    }

    const submit = function(evt: any) {
        evt && evt.preventDefault();

        if (typeof window !== 'undefined') {
            window.localStorage.setItem("bucket", bucket.current.value);
            window.localStorage.setItem("region", region.current.value);
            if (props.inWebView) {
                window.localStorage.setItem("apiKey", apiKey.current.value);
                window.localStorage.setItem("apiSecret", apiSecret.current.value);
            }
        }

        if (!getAllSet()) {
            alert('All fields must be set.'); // TODO better validation please
            return;
        }

        const creds = new AwsS3Config();
        creds.apiKey = apiKey.current.value;
        creds.apiSecret = apiSecret.current.value;
        creds.bucketName = bucket.current.value;
        creds.bucketSite = region.current.value;

        props.callback(creds);
    }

    return (
        <Container>
        <Form onSubmit={submit}>
            <Form.Group as={Row} className="mb-3">
                <Form.Label column xs={4}>AWS Bucket Name</Form.Label>
                <Col xs={8}>
                    <Form.Control ref={bucket} defaultValue={getFromLocalStorage("bucket", "")}/> 
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
                <Form.Label column xs={4}>AWS Region</Form.Label>
                <Col xs={8}>
                    <Form.Control ref={region} defaultValue={getFromLocalStorage("region", "")}/>
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
                <Form.Label column xs={4}>AWS Api Key</Form.Label>
                <Col xs={8}>
                    <Form.Control ref={apiKey} defaultValue={getFromLocalStorageInWebView("apiKey", "")} />
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
                <Form.Label column xs={4}>AWS Api Secret</Form.Label>
                <Col xs={8}>
                    <Form.Control type="password" ref={apiSecret} defaultValue={getFromLocalStorageInWebView("apiSecret", "")} />
                </Col>
            </Form.Group>

            <Button type="submit">Login</Button>
        </Form>
        </Container>
    );
};

export default LoginForm;