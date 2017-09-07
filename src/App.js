import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Runs from './components/runs';
import Feedback from './components/feedback';
import League from './components/league';
import Team from './components/team';
import TeamMembers from './components/teammembers';
import SearchList from './components/searchitems'
import _ from "lodash";

import {
  Pagination, ButtonGroup, Button, ButtonToolbar, ToggleButtonGroup,
  ToggleButton, Grid, Row, Col, Table, FormControl, Form, FormGroup, ControlLabel
} from 'react-bootstrap';
import UserDetail from './components/userdetail';
import {
  BrowserRouter as Router,
  Route,
  Link

} from 'react-router-dom';


var search_state = { value: '' };


class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      user_id: '',
      user_email: '',
      search_by: 1,
      error: "none"
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleFNameChange = this.handleFNameChange.bind(this);
    this.handleLNameChange = this.handleLNameChange.bind(this);
    this.handleIdChange = this.handleIdChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleFNameChange(event) {
    this.setState({ first_name: event.target.value });
  }
  handleLNameChange(event) {
    this.setState({ last_name: event.target.value });
  }
  handleIdChange(event) {
    this.setState({ user_id: event.target.value });
  }
  handleEmailChange(event) {
    this.setState({ user_email: event.target.value });
  }
  handleSearch(value) {

    this.setState({
      error: "none",
      search_by: value
    })



  }
  handleSubmit(event) {

    console.log("/searchitem?first_name=" + this.state.first_name);
    console.log('-------------------------------A name was submitted: ' + JSON.stringify(this.state));
    switch (this.state.search_by) {
      case 1:
        if ((this.state.first_name === "") && (this.state.last_name === "")) {
          this.setState({
            error: "block",
          })
          console.log("/searchitem?first_name=" + this.state.first_name);
        }
        else if ((this.state.first_name !== "") && (this.state.last_name !== "")) {
          this.setState({
            error: "none",
          })
          window.location = "/search_list?first_name=" + this.state.first_name + "&last_name=" + this.state.last_name;
          console.log("/searchitem?first_name=" + this.state.first_name + "&last_name=" + this.state.last_name);
        }
        else if ((this.state.first_name !== "") && (this.state.last_name === "")) {
          window.location = "/search_list?first_name=" + this.state.first_name;
          console.log("SEARCh /searchitem?first_name=" + this.state.first_name);
        }
        else {
          window.location = "/search_list?last_name=" + this.state.last_name;
          console.log("/searchitem?last_name=" + this.state.last_name);
        }

        break;
      case 2:
        if (this.state.user_id === "") {
          this.setState({
            error: "block",
          })
        }
        else {
          window.location = "/userdetail/" + this.state.user_id;
        }

        break;
      case 3:
        if (this.state.user_email === "") {
          this.setState({
            error: "block",
          })
        }
        else {
          window.location = "/search_list?email=" + this.state.user_email;
        }

        break;

      default:
        break;
    }
    event.preventDefault();
  }


  render() {
    console.log("SEARCH", this.state.search_by);
    return (
      <div>
        <ButtonToolbar style={{ paddingBottom: "10px" }}>
          <ToggleButtonGroup type="radio" onChange={this.handleSearch} name="options" defaultValue={1}>
            <ToggleButton value={1}>
              Search By Name
        </ToggleButton>
            <ToggleButton value={2}>Search By User ID</ToggleButton>

            <ToggleButton value={3}>Search By Email</ToggleButton>
          </ToggleButtonGroup>
        </ButtonToolbar>
        <span style={{ display: this.state.error }}>Enter search parameters</span>
        <Form style={{ paddingBottom: "10px" }} onSubmit={this.handleSubmit}>
          <FormGroup style={this.state.search_by === 1 ? { display: "block" } : { display: "none" }} controlId="formInlineFirstName">
            <ControlLabel>First Name</ControlLabel>
            {' '}
            <FormControl type="text" placeholder="Jane" ref="firstName" value={this.state.user_name} onChange={this.handleFNameChange} />
          </FormGroup>
          {' '}
          <FormGroup style={this.state.search_by === 1 ? { display: "block" } : { display: "none" }} controlId="formInlineLastName">
            <ControlLabel>Last Name</ControlLabel>
            {' '}
            <FormControl type="text" placeholder="Doe" ref="lastName" value={this.state.user_name} onChange={this.handleLNameChange} />
          </FormGroup>
          {' '}
          <FormGroup style={this.state.search_by === 2 ? { display: "block" } : { display: "none" }} controlId="formInlineEmail">
            <ControlLabel>User Id</ControlLabel>
            {' '}
            <FormControl type="number" placeholder="123" value={this.state.user_id} onChange={this.handleIdChange} />
          </FormGroup>
          {' '}
          <FormGroup style={this.state.search_by === 3 ? { display: "block" } : { display: "none" }} controlId="formInlineEmail">
            <ControlLabel>Email</ControlLabel>
            {' '}
            <FormControl type="email" placeholder="jane.doe@example.com" value={this.state.user_email} onChange={this.handleEmailChange} />
          </FormGroup>
          {' '}
          <Button type="submit" value="Submit">

            Search
        </Button>
        </Form>

      </div>

    );
  }
}




class User extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: false,
      userPath: 'http://dev.impactrun.com/api/leagueleaderboard/?impactleague=7',
      nextPage: '',
      prevPage: '',
      activePage: 1,

    }
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentWillMount() {
    console.log("In Will MOunt");

    this.fetchLeaderboard(this.state.userPath);
  }

  fetchLeaderboard(path) {
    fetch(path, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic bmlra2k6Z3JlZW5mcmVlZG9tIQ=='
      }
    })
      .then((Response) => Response.json())
      .then((responseJson) => {

        this.setState({
          data: responseJson,
          loading: true,
          prevPage: responseJson.previous,
          userPath: this.state.nextPage,
          nextPage: responseJson.next,

        })
        console.log("Data", this.state.data);

      });
  }
  // handleNext() {

  //   this.fetchLeaderboard(this.state.nextPage);

  // }
  // handlePrev() {
  //   console.log("Prev", this.state.prevPage)
  //   this.fetchLeaderboard(this.state.prevPage);
  // }
  leaderboard() {
    if (this.state.data === null) {
      return;
    }
    else {
      if (this.state.prevPage === null) {
        this.state.pageCount = Math.ceil(this.state.data.count / this.state.data.results.length);
      }

      console.log("Total Page", this.state.pageCount)
      if (this.state.data != null) {


        var runList = this.state.data.results.map((item, index) => {

          return (
            // <li key={index}>{item.run_id}</li>
            <tr key={index}>
              <td>
                <Link to={"/userdetail/" + item.user.user_id}>
                  {`${item.user.first_name} ${item.user.last_name}`}
                </Link>
              </td>
              <td>John</td>
              <td>Carter</td>
              <td>johncarter@mail.com</td>
            </tr>
          )
        })
      } else {
        runList;
      }

      return runList;

    }
  }
  handleSelect(eventKey) {
    console.log("Current Page", eventKey)
    console.log("Page", this.state.userPath)
    console.log("Prev Page", this.state.prevPage)
    if (this.state.activePage < eventKey) {
      this.fetchLeaderboard(this.state.nextPage);
    }
    else if (this.state.activePage > eventKey) {
      this.fetchLeaderboard(this.state.prevPage);
    }
    else {

    }
    this.setState({
      activePage: eventKey,

    });
  }
  render() {
    return (
      <div className="User">
        <div className="User-header">
          <Grid>
            <Row className="show-grid">
              <Col xs={12} md={8}> <h2>User</h2> </Col>
            </Row>
            <Row className="show-grid">

              <Col md={8}>
                <NameForm />
              </Col>


            </Row>
          </Grid>
        </div>
        <div className="User-header">
          <Col xs={12} md={8}>
            <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Username</th>
                </tr>
              </thead>
              <tbody>
                {!this.state.loading ? <tr style={{ textAlign: "center", width: "100%" }}><td colSpan="4">Loading...</td></tr> : null}
                {this.leaderboard()}
              </tbody>
            </Table>
            <div id="test">
              <Pagination
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                items={this.state.pageCount}
                maxButtons={3}
                activePage={this.state.activePage}
                onSelect={this.handleSelect} />
            </div>
            {/* <ButtonGroup>
              <Button onClick={() => this.handlePrev()}>Prev</Button>
              <Button></Button>
              <Button onClick={() => this.handleNext()}>Next</Button>
            </ButtonGroup> */}
          </Col>
        </div>
      </div>
    );
  }
}





class App extends Component {
  render() {
    return (
      <Router>
        <div style={{ display: 'flex' }}>
          <div style={{
            padding: '10px',
            // width: '20%',
            background: '#f0f0f0'
          }}>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              <li><Link to="/">User</Link></li>
              <li><Link to="/runs">Runs</Link></li>
              <li><Link to="/feedback">Feedback</Link></li>
              <li><Link to="/league">Leagues</Link></li>
            </ul>
          </div>
          <div style={{ flex: 1, padding: '10px' }}>
            <Route path="/" component={User} exact />
            <Route path="/search_list" render={() => <SearchList />} />
            <Route path="/feedback" render={() => <Feedback />} />
            <Route path="/league" render={() => <League />} />
            <Route path="/leagueteams" render={() => <Team />} />
            <Route path="/teammembers" render={() => <TeamMembers />} />
            <Route path="/userdetail" render={() => <UserDetail />} />
            <Route path="/runs" render={() => <Runs />} />

            {/* <Route path={path} render={routeProps => <LeaguePage {...routeProps} path={path} />} history={history} />
        <Route path="/description" render={routeProps => <Example {...routeProps} />} history={history} /> */}
          </div>
        </div>
      </Router>
    )

  }
}

export default App;
