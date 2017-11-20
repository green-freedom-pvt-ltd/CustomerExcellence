import React, {Component} from 'react';
import { Button, Grid, Row, Col, Table, FormControl,Form, FormGroup,ControlLabel } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import {RingLoader, PropagateLoader} from 'react-spinners';


export default class TeamMembers extends Component{
  constructor(props) {
    console.log("inside team member container", props);
    super(props);
     var path = window.location.pathname;
      path = path.split("/");
      console.log("------member------",path);
      this.state = {
      data: null,
      loading:true,
      fetchUrl:'http://dev.impactrun.com/api/ced/employeelist/',
      team_id: null,     

    }
    if (path[2]) {
       this.state.fetchUrl+= '?team_id=' + path[2]
      console.log("inside feedback fetchUrl", this.state.fetchUrl);
    }
  }

  render() {
    var  league_data = this.state.data;
    if(league_data){
    var leagueList = league_data.map((league, index) => {
          return (
              <tr key={index}  >
                  <td>{index +1}</td>
                  <td>
                    <Link to={"/userdetail/"+league.user +"/"}>
                      {league.user}
                    </Link>
                  </td>
                  <td>{league.date_registered}</td>
                  <td>{league.is_logout ? 'No' : 'Yes'}</td>
                  <td>{league.team}</td>
                  <td>{league.department ? league.department : '-' }</td>
                  <td>{league.id}</td>
              </tr>)
            });
    }


    return (
       <div>
         <div className="row">
         <div className='col-sm-offset-6 col-sm-6 col-centered'>
              <PropagateLoader
                color={'#123abc'} 
                size={20}
                loading={this.state.loading} 
              /> 
            </div>   
           <div className="col-sm-6">
                <Table striped bordered condensed hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>User</th>
                      <th>Registration Date</th>
                      <th>Logged In</th>
                      <th>Code</th>
                      <th>Department</th>
                      <th>Employee Id</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leagueList}
                  </tbody>
                </Table>
            </div>
          </div>
      </div>   
    );
  }

  componentWillMount(){
    return fetch(this.state.fetchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic bmlra2k6Z3JlZW5mcmVlZG9tIQ=='
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          data: responseJson,
          loading:false

        });
        console.log('inside componentWillMount Team',this.state.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
