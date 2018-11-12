import React, {Component} from 'react';
import { Button, Grid, Row, Col, Table, FormControl,Form, FormGroup,ControlLabel } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import {CSVLink, CSVDownload} from 'react-csv';
import {RingLoader, PropagateLoader} from 'react-spinners';
import Cookies from 'universal-cookie';
const cookies = new Cookies();


export default class Team extends Component{
  constructor(props) {
    super(props);
     var path = window.location.pathname;
      path = path.split("/");
      
      this.state = {
      data: null,
      loading:true,
      fetchUrl:'http://api.impactrun.com/ced/v1/teams/',
      league_id: null,
      csvData:[['index', 'Team Id', 'Team Name', 'Captain', 'Phone Number','Email', 'Code', 'Count']],

    }
    if (path[2]) {
       this.state.fetchUrl+= '?league_id=' + path[2]
    }
  }

  render() {
    var  league_data = this.state.data;
    if(league_data){
    var leagueList = league_data.results.map((league, index) => {
      var nextTeam = [index +1,league.id,league.team_name,league.team_captain,league.team_captain_phone,league.team_captain_email_id,league.team_code,league.team_count]
      this.state.csvData.push(nextTeam);
          return (
              <tr key={index}  >
                  <td>{index +1}</td>
                  <td>{league.id}</td>
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

    const csvData =[
      ['firstname', 'lastname', 'email'] ,
      ['Ahmed', 'Tomi' , 'ah@smthing.co.com'] ,
      ['Raed', 'Labes' , 'rl@smthing.co.com'] ,
      ['Yezzi','Min l3b', 'ymin@cocococo.com']
    ];

    return (
        <div>
         <div className="row">
           <div className="col-md-6">
              <h1> Team list </h1>
           </div>
           <div className='col-sm-offset-6 col-sm-6 col-centered'>
              <PropagateLoader
                color={'#123abc'} 
                size={20}
                loading={this.state.loading} 
              /> 
            </div>   
           <div className="col-md-6">
              <br/>
              <br/>
              <CSVLink data={this.state.csvData} >Download CSV</CSVLink>
           </div>
         </div>
         <div className="row">
           <div className="col-md-10">
                <Table striped bordered condensed hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Team Id</th>
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
        'Authorization': cookies.get('authorization')
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          data: responseJson,
          loading:false

        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
