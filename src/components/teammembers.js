import React, {Component} from 'react';
import { Button, Grid, Row, Col, Table, FormControl,Form, FormGroup,ControlLabel } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'


export default class TeamMembers extends Component{
  constructor(props) {
    console.log("inside team member container", props);
    super(props);
     var path = window.location.pathname;
      path = path.split("/");
      console.log("------member------",path);
      
      this.state = {
      data: null,
      loading:false,
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
                  <td>{league.team_code}</td>
                  <td>{league.city}</td>
                  <td>{league.department}</td>
              </tr>)
            });
    }


    return (
       <div>
         <div className="row">
           <div className="col-sm-6">
                <Table striped bordered condensed hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>User</th>
                      <th>City</th>
                      <th>Department</th>
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
          loading:true

        });
        console.log('inside componentWillMount Team',this.state.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
