import React, { Component } from 'react';
import {
  Button, ButtonToolbar, ToggleButtonGroup,
  ToggleButton, Col, Table, FormControl, Form, FormGroup, ControlLabel
} from 'react-bootstrap';


class SearchForm extends Component {

  constructor(props) {
    super(props);

    var queryString = window.location.search;
    queryString = queryString.substring(1);
    this.parseQueryString = this.parseQueryString.bind(this);
    queryString =this.parseQueryString(queryString);
    this.state = {
      first_name: queryString.first_name=== undefined ?"":queryString.first_name,
      last_name: queryString.last_name=== undefined ?"":queryString.last_name,
      user_id: '',
      user_email: queryString.email=== undefined ?"":queryString.email,
      search_by: 1,
      error: "none",
     
    };

    this.handleFNameChange = this.handleFNameChange.bind(this);
    this.handleLNameChange = this.handleLNameChange.bind(this);
    this.handleIdChange = this.handleIdChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
   
  }
  parseQueryString( queryString ){
    var params = {}, queries, temp, i, l;
    // Split into key/value pairs
    queries = queryString.split("&");
    // Convert the array of strings into an object
    for ( i = 0, l = queries.length; i < l; i++ ) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }
    return params;
};

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

    switch (this.state.search_by) {
      case 1:
        if ((this.state.first_name === "") && (this.state.last_name === "")) {
          this.setState({
            error: "block",
          })
        }
        else if ((this.state.first_name !== "") && (this.state.last_name !== "")) {
          this.setState({
            error: "none",
          })
          window.location = "/search_list?first_name=" + this.state.first_name + "&last_name=" + this.state.last_name;
        }
        else if ((this.state.first_name !== "") && (this.state.last_name === "")) {
          window.location = "/search_list?first_name=" + this.state.first_name;
        }
        else {
          window.location = "/search_list?last_name=" + this.state.last_name;
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

    return (
      <div>
        <ButtonToolbar style={{ marginBottom: "10px" }} >
          <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
            <ToggleButton onClick={() => this.handleSearch(1)} value={1}>
              Search By Name
          </ToggleButton>
            <ToggleButton onClick={() => this.handleSearch(2)} value={2}>Search By User ID</ToggleButton>

            <ToggleButton onClick={() => this.handleSearch(3)} value={3}>Search By Email</ToggleButton>
          </ToggleButtonGroup>
        </ButtonToolbar>
        <span style={{ display: this.state.error,color:"red" }}>Enter search parameters</span>
        <Form style={{ paddingBottom: "10px" }} onSubmit={this.handleSubmit}>
          <FormGroup style={this.state.search_by === 1 ? { display: "flex", marginBottom: "10px" } : { display: "none" }} controlId="formInlineFirstName">
            <div className="col-sm-6" style={{ marginRight: "10px" }}>
              <div className="row">
                <ControlLabel>First Name</ControlLabel>
                {' '}
                <FormControl type="text" placeholder="Jane" ref="firstName" value={this.state.first_name} onChange={this.handleFNameChange} />
              </div>
            </div>
            <div className="col-sm-6">
              <div className="row">
                <ControlLabel>Last Name</ControlLabel>
                {' '}
                <FormControl type="text" placeholder="Doe" ref="lastName" value={this.state.last_name} onChange={this.handleLNameChange} />
              </div>
            </div>
            {' '}

          </FormGroup>
          {' '}
          {/* <FormGroup style={this.state.search_by === 1 ? { display: "block" } : { display: "none" }} controlId="formInlineLastName">
             
            </FormGroup>
            {' '} */}
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

export default SearchForm;