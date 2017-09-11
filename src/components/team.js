import React, {Component} from 'react';
import {Table } from 'react-bootstrap';

export default class Team extends Component{
  constructor(props) {
    console.log("inside league container", props);
    super(props);
    this.state = {
      data: null,
      loading:false,
    }
  }

  render() {
    var  league_data = this.state.data;
    console.log("------111--------",league_data);
    if(league_data){
    var leagueList = league_data.results.map((league, index) => {
          return (
              <tr key={index}  >
                  <td>{index +1}</td>
                  <td>{league.impactleague}</td>
                  <td>{league.team_name}</td>
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
         <div>
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
    );
  }

  componentWillMount(){
    return fetch('http://dev.impactrun.com/api/ced/teams/', {
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
        console.log('inside componentWillMount League',this.state.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
