import React from "react";
import Button from 'react-bootstrap/Button';
import { graphql } from "gatsby";

import LoginForm from "../screen/login-form";
import MainForm from "../screen/main-form";
import AwsS3Service, {AwsS3Config} from "../utils/s3-controller";
import DataService from "../utils/db-repo";
import JournalEntry from "../utils/db-row";
import Calc from "../utils/calc";

export const pageQuery = graphql`query a { site { siteMetadata { title, bucketRegion } } }`

interface IIndexPageState {
  loggedIn: boolean;
  loggedOutExplicitly: boolean;
  calc: Calc | undefined;
  database: DataService | undefined;
  inWebView: boolean;
  saving: boolean;
}

export default class IndexPage extends React.Component<any, IIndexPageState> {
  constructor(props: any) {
    super(props);
    
    const params = new URLSearchParams(props.location.search);
    this.state = {
      loggedIn: false,
      loggedOutExplicitly: false,
      calc: undefined,
      database: undefined,
      saving: false,
      inWebView: !!params.get('webview')
    };

    this.editRow = this.editRow.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  editRow(row: JournalEntry): void {
    this.setState({saving: true });
    this.state.database?.save(row, () => {
      this.setState({saving: false, calc: this.state.database?.getCalc()});
    }, (message: string) => alert(message));
  };

  deleteRow(row: JournalEntry): void {
    this.setState({saving: true });
    this.state.database?.delete(row, () => {
      this.setState({saving: false, calc: this.state.database?.getCalc()});
    }, (message: string) => alert(message));
  }

  login(creds: AwsS3Config, fileName: string) {
    const s3Service = new AwsS3Service(creds);
    const database = new DataService(s3Service, fileName);
    database.load(() => {
      this.setState({calc: database.getCalc(), database: database, loggedIn: true });
    }, (err) => { alert(err); });
  }

  logout() {
    this.setState({
      database: undefined,
      calc: undefined,
      loggedIn: false,
      loggedOutExplicitly: true,
      saving: false
    });
  }
   
  render() {
    if (this.state.loggedIn && (this.state.database == null || this.state.calc == null)) {
      return (<>Loading...</>);
    }

    if (!this.state.loggedIn) {
      return (<LoginForm callback={this.login} inWebView={this.state.inWebView} loggedOut={this.state.loggedOutExplicitly} bucketRegion={this.props.data.site.siteMetadata.bucketRegion} />);
    }

    return (
    <>
      <Button variant="info" style={{float: 'right'}} onClick={this.logout}>Logout</Button>
      <MainForm data={this.state.database?.getRaw() || new JournalEntry[0]} calc={this.state.calc || new Calc(new JournalEntry[0])} editRow={this.editRow} deleteRow={this.deleteRow} saving={this.state.saving} />
    </>
    );
  }
}

