import React,{Component} from 'react';
import {
    Pagination, ButtonGroup, Button, ButtonToolbar, ToggleButtonGroup,
    ToggleButton, Grid, Row, Col, Table, FormControl, Form, FormGroup, ControlLabel
  } from 'react-bootstrap';


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

  export default NameForm;