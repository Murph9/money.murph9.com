import * as React from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { AwsS3Config } from "../utils/s3-controller";
import FloatingLabel from "react-bootstrap/FloatingLabel";


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

    const getFromLocalStorageInWebView = function(key: string, fallback: string) {
        if (props.inWebView)
            return getFromLocalStorage(key, fallback);
        return fallback;
    }

    const submit = function(evt: any) {
        evt.preventDefault();

        if (typeof window !== 'undefined') {
            window.localStorage.setItem("bucket", bucket.current.value);
            window.localStorage.setItem("region", region.current.value);
            if (props.inWebView) {
                window.localStorage.setItem("apiKey", apiKey.current.value);
                window.localStorage.setItem("apiSecret", apiSecret.current.value);
            }
        }

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
                <Form.Control ref={apiKey} defaultValue={getFromLocalStorageInWebView("apiKey", "")} />
            </FloatingLabel>
            
            <FloatingLabel label="AWS Api Secret">
                <Form.Control type="password" ref={apiSecret} defaultValue={getFromLocalStorageInWebView("apiSecret", "")} />
            </FloatingLabel>

            <Button type="submit">Login</Button>
        </Form>
    );
};

export default LoginForm;