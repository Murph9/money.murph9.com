import * as React from "react";
import LoginForm from "../components/login-form";
import MainForm from "../components/main-form";
import AwsS3Service, {AwsS3Config} from "../utils/s3-controller";
import DataService from "../utils/db-repo";
import JournalEntry from "../utils/db-row";
import { graphql } from "gatsby";
import Calc from "../utils/calc";

export const pageQuery = graphql`query a { site { siteMetadata { awsFileName } } }`


const IndexPage = (props: any) => {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const addRow = (row: JournalEntry) => {
    database.current.save(row, (a: object) => {}, (message: string) => { alert(message);});
  };

  const database : React.MutableRefObject<DataService> = React.useRef(null);
  const login = function(creds: AwsS3Config) {
    const s3Service = new AwsS3Service(creds);
    database.current = new DataService(s3Service, props.data.site.siteMetadata.awsFileName);
    database.current.load((data: Array<JournalEntry>) => {
      setLoggedIn(true);
      setCalc(new Calc(data));
    }, (err) => { alert(err); });
  }
  const [calc, setCalc] = React.useState<Calc>(null);
    
  if (loggedIn && database.current == null) {
    return (<>Loading...</>);
  }

  if (loggedIn && calc == null) {
    return (<>Generating...</>);
  }

  if (!loggedIn) {
    return (<LoginForm callback={login} />);
  }

  return (
  <>
    <MainForm data={database.current.getRaw()} addRow={addRow} calc={calc} />
  </>
  );
};

export default IndexPage;
