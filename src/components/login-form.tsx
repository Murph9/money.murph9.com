import * as React from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import BasicInput from "./basic-input";
import { AwsS3Config } from "../utils/s3-controller";

const getFromLocalStorage = function(key: string, fallback: string) {
    const result = window.localStorage.getItem(key)
    if (result)
        return result;
    return fallback;
}

const LoginForm = (props: any) => {
    const [bucket, setBucket] = React.useState(getFromLocalStorage("bucket", ""));
    const [region, setRegion] = React.useState(getFromLocalStorage("region", ""));
    const [apiKey, setApiKey] = React.useState("");
    const [apiSecret, setApiSecret] = React.useState("");
    const submit = function(evt: any) {
        evt.preventDefault();

        localStorage.setItem("bucket", bucket);
        localStorage.setItem("region", region);

        if (!bucket || !region || !apiSecret || !apiKey) {
            alert('All fields must be set.'); // TODO better validation please
            return;
        }

        const creds = new AwsS3Config();
        creds.apiKey = apiKey;
        creds.apiSecret = apiSecret;
        creds.bucketName = bucket;
        creds.bucketSite = region;

        props.callback(creds);
    }

    return (
        <Form onSubmit={submit}>
            <BasicInput type="text" value={bucket} onChange={(event: any) => {setBucket(event.target.value)}} name="bucket"/>
            <BasicInput type="text" value={region} onChange={(event: any) => {setRegion(event.target.value)}} name="region"/>
            <BasicInput type="text" value={apiKey} onChange={(event: any) => {setApiKey(event.target.value)}} name="apiKey"/>
            <BasicInput type="password" value={apiSecret} onChange={(event: any) => {setApiSecret(event.target.value)}} name="apiSecret"/>
            <Button type="submit">Login</Button>
        </Form>
    );
};

export default LoginForm;