import * as React from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { BasicInput } from "./basic-input";
import { AwsS3Config } from "../utils/s3-controller";
import FloatingLabel from "react-bootstrap/FloatingLabel";

const getFromLocalStorage = function(key: string, fallback: string) {
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

    const submit = function(evt: any) {
        evt.preventDefault();

        localStorage.setItem("bucket", bucket.current.value);
        localStorage.setItem("region", region.current.value);

        const creds = new AwsS3Config();
        creds.apiKey = apiKey.current.value;
        creds.apiSecret = apiSecret.current.value;
        creds.bucketName = bucket.current.value;
        creds.bucketSite = region.current.value;

        if (!creds.bucketName || !creds.bucketSite || !creds.apiSecret || !creds.apiKey) {
            alert('All fields must be set.'); // TODO better validation please
            return;
        }

        props.callback(creds);
    }

    return (
        <Form onSubmit={submit}>
            <FloatingLabel label="AWS Bucket Name">
                <Form.Control ref={bucket} defaultValue={getFromLocalStorage("bucket", "")}/> 
            </FloatingLabel>
            
            <FloatingLabel label="AWS Region">
                <Form.Control ref={region} defaultValue={getFromLocalStorage("region", "")}/> 
            </FloatingLabel>

            <FloatingLabel label="AWS Api Key">
                <Form.Control ref={apiKey} defaultValue={""} />
            </FloatingLabel>
            
            <FloatingLabel label="AWS Api Secret">
                <Form.Control type="password" ref={apiSecret} defaultValue={""} />
            </FloatingLabel>

            <Button type="submit">Login</Button>
        </Form>
    );
};

export default LoginForm;