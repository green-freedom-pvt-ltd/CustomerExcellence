import React, { Component } from 'react';
import { Button, ButtonToolbar, ToggleButtonGroup,
  ToggleButton, Col, Table, FormControl, Form, FormGroup, ControlLabel
} from 'react-bootstrap';
import Login from './login';
import Cookies from 'universal-cookie';

const cookies = new Cookies();


export default class Logout extends Component{
  constructor(props) {
    super(props);
    this.state = {
      user_name: '',
      password: '',
      search_by: 1,
      error: "none"
    };
    cookies.set('authorization','asdasdasdasdasdasdasdasd', { path: '/' });
    console.log("cookie--------------------",cookies.get('authorization'));

  }


  render() {
   
    return (
      <div>
        <div>
          <h2>You have been successfully logged out</h2>
          <br/>
          <h3>Login again</h3>
        </div>
        <div>
          <Login />
        </div>
      </div>

    );
  }
}
