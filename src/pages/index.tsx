import * as React from "react";
import LoginForm from "../components/login-form";
import MainForm from "../components/main-form";
import AwsS3Service, {AwsS3Config} from "../utils/s3-controller";
import DataService from "../utils/db-repo";
import { graphql } from "gatsby";

export const pageQuery = graphql`
query a { site { siteMetadata { awsFileName } } }`


const IndexPage = (props: any) => {
  const [loggedIn, setLoggedIn] = React.useState(false);

  const database : React.MutableRefObject<DataService> = React.useRef(null);
  const login = function(creds: AwsS3Config) {
    const s3Service = new AwsS3Service(creds);
    database.current = new DataService(s3Service, props.data.site.siteMetadata.awsFileName);
    database.current.load(() => {
      setLoggedIn(true);
    }, (err) => { alert(err); });
  }
  
  if (loggedIn && database.current == null) {
    return (<>Loading...</>);
  }

  return (
  <>
    {!loggedIn ? <LoginForm callback={login} /> : <MainForm data={database.current.getRaw()}/>}
  </>
  );
};

export default IndexPage;