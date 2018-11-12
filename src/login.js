import React, { Component } from 'react';
import { Button, ButtonToolbar, ToggleButtonGroup,
  ToggleButton, Col, Table, FormControl, Form, FormGroup, ControlLabel
} from 'react-bootstrap';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export default class Login extends Component{
  constructor(props) {
    super(props);
    this.state = {
      user_name: '',
      password: '',
      search_by: 1,
      error: "none",
      is_login: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleFNameChange = this.handleFNameChange.bind(this);
    this.handleLNameChange = this.handleLNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.requestLogin = this.requestLogin.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleFNameChange(event) {
    this.setState({ user_name: event.target.value });
  }
  handleLNameChange(event) {
    this.setState({ password: event.target.value });
  }
  
  requestLogin(user_name, password){

      return fetch('http://api.impactrun.com/ced/v1/login', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "authorization": "user_id:"+user_name+",pass:"+password,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          var data_results = responseJson;
          cookies.set('authorization',responseJson.auth_token, { path: '/' });
          this.setState({
            is_login: true
          });
          window.location = "/user";
        })
        .catch((error) => {
          cookies.set('authorization','IsImVtYWlsIjoiaW5pdCIsIl9fdiI6ImluaXQiLCJfaWQiOiJpbml0In0sInN0Y', { path: '/' });
          this.setState({
            is_login: false
          });
        });
    }


  handleSubmit(event) {

    // console.log("/searchitem?user_name=" + this.state.user_name);
    // console.log('-------------------------------A name was submitted: ' + JSON.stringify(this.state));
    if ((this.state.user_name === "") && (this.state.password === "")) {
      this.setState({
        error: "block",
      })
      // console.log("/searchitem?user_name=" + this.state.user_name);
    }
    else if ((this.state.user_name !== "") && (this.state.password !== "")) {
      this.setState({
        error: "none",
      })
      // console.log("/searchitem?user_name=" + this.state.user_name + "&password=" + this.state.password);
    }
    event.preventDefault();
    this.requestLogin(this.state.user_name,this.state.password);
  }


  render() {
   
    return (
      <div>
        <Form style={{ paddingBottom: "10px" }} onSubmit={this.handleSubmit}>
          <FormGroup style={{ display: "flex",marginBottom:"10px" }} >
            <div className="col-sm-6" style={{marginRight:"10px"}}>
              <div className="row">
              <ControlLabel>User Name</ControlLabel>
              {' '}
              <FormControl id="user_name" type="text" placeholder="wolverine" ref="user_name" value={this.state.user_name} onChange={this.handleFNameChange} />
              </div>
            </div>
            <div className="col-sm-6">
            <div className="row">
              <ControlLabel>Password</ControlLabel>
              {' '}
              <FormControl id="password" type="password" placeholder=".'.'.'.'.'.'." ref="password" value={this.state.password} onChange={this.handleLNameChange} />
            </div>
            </div>
            {' '}

          </FormGroup>
          {' '}
          <Button type="submit" value="Submit">
            Login
          </Button>
        </Form>

      </div>

    );
  }
}
