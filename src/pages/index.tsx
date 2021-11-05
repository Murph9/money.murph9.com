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

  let s3Service : AwsS3Service = null;
  let database : DataService = null;
  const login = function(creds: AwsS3Config) {
    s3Service = new AwsS3Service(creds);
    database = new DataService(s3Service, props.data.site.siteMetadata.awsFileName);
    database.load(() => setLoggedIn(true), (err) => { alert(err); });
  }
  
  return (
  <>
    {!loggedIn ? <LoginForm callback={login} /> : <MainForm />}
  </>
  );
};

export default IndexPage;
