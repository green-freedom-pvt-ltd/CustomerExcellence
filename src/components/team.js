import React, {Component} from 'react';
import { Button, Grid, Row, Col, Table, FormControl,Form, FormGroup,ControlLabel } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'


export default class Team extends Component{
  constructor(props) {
    console.log("inside team container", props);
    super(props);
     var path = window.location.pathname;
      path = path.split("/");
      console.log("------111--asd------",path);
      
      this.state = {
      data: null,
      loading:false,
      fetchUrl:'http://dev.impactrun.com/api/ced/teams/',
      league_id: null,     

    }
    if (path[2]) {
       this.state.fetchUrl+= '?league_id=' + path[2]
      console.log("inside feedback fetchUrl", this.state.fetchUrl);
    }
  }

  render() {
    var  league_data = this.state.data;
    if(league_data){
    var leagueList = league_data.results.map((league, index) => {
          return (
              <tr key={index}  >
                  <td>{index +1}</td>
                  <td>{league.impactleague}</td>
                  <td>
                    <Link to={"/teammembers/"+league.id +"/"}>
                      {league.team_name}
                    </Link>
                  </td>
                  <td>{league.team_captain}</td>
                  <td>{league.team_captain_phone}</td>
                  <td>{league.team_captain_email_id}</td>
                  <td>{league.team_code}</td>
                  <td>{league.team_count}</td>
              </tr>)
            });
    }


    return (
        <div>
         <h1> Team list </h1>
         <div className="row">
           <div className="col-md-10">
                <Table striped bordered condensed hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>League</th>
                      <th>Team Name</th>
                      <th>Team Captain</th>
                      <th>Captain Phone</th>
                      <th>Captain Email</th>
                      <th>Code</th>
                      <th>Count</th>
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
