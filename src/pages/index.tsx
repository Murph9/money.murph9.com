import * as React from "react";
import Button from 'react-bootstrap/Button';
import { graphql } from "gatsby";

import LoginForm from "../components/login-form";
import MainForm from "../components/main-form";
import AwsS3Service, {AwsS3Config} from "../utils/s3-controller";
import DataService from "../utils/db-repo";
import JournalEntry from "../utils/db-row";
import Calc from "../utils/calc";

export const pageQuery = graphql`query a { site { siteMetadata { awsFileName } } }`


interface IIndexPageState {
  loggedIn: boolean;
  calc: Calc;
  database: DataService;
  inWebView: boolean;
}

export default class IndexPage extends React.Component<any, IIndexPageState> {
  constructor(props: any) {
    super(props);
    
    const params = new URLSearchParams(props.location.search);
    console.log(params.get('webview'));
    this.state = {
      loggedIn: false,
      calc: null,
      database: null,
      inWebView: !!params.get('webview')
    };

    this.setLoggedIn = this.setLoggedIn.bind(this);
    this.editRow = this.editRow.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    this.login = this.login.bind(this);
  }

  setLoggedIn(value: boolean): void {
    this.setState({ loggedIn: value });
  }
  
  editRow(row: JournalEntry): void {
    this.state.database.save(row, () => {
      this.setState({calc: this.state.database.getCalc()});
    }, (message: string) => alert(message));
  };

  deleteRow(row: JournalEntry): void {
    this.state.database.delete(row, () => {
      this.setState({calc: this.state.database.getCalc()});
    }, (message: string) => alert(message));
  }

  login(creds: AwsS3Config) {
    const s3Service = new AwsS3Service(creds);
    const database = new DataService(s3Service, this.props.data.site.siteMetadata.awsFileName);
    database.load(() => {
      this.setState({calc: database.getCalc(), database: database, loggedIn: true });
    }, (err) => { alert(err); });
  }
   
  render() {
    if (this.state.loggedIn && (this.state.database == null || this.state.calc == null)) {
      return (<>Loading...</>);
    }

    if (!this.state.loggedIn) {
      return (<LoginForm callback={this.login} inWebView={this.state.inWebView} />);
    }

    return (
    <>
      <Button variant="info" style={{float: 'right'}} onClick={() => {
        this.setState({ database: null, calc: null, loggedIn: false});
      }}>Logout</Button>
      <MainForm data={this.state.database.getRaw()} calc={this.state.calc} editRow={this.editRow} deleteRow={this.deleteRow} />
    </>
    );
  }
}

