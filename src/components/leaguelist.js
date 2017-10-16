import React, {Component} from 'react';
import { Button, Grid, Row, Col, Table, FormControl,Form, FormGroup,ControlLabel } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import Cookies from 'universal-cookie';

const cookies = new Cookies();


export default class LeagueList extends Component{
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
    console.log("------league data--------",league_data);
    console.log("cookie--------------------",cookies.get('authorization'));

    if(league_data){
    var leagueList = league_data.results.map((league, index) => {
          return (
              <tr key={index}  >
                  <td>{index +1}</td>
                  <td>
                     <Link to={"/leagueteams/"+league.id +"/"}>
                      {league.impactleague_name}
                    </Link>
                  </td>
                  <td>{league.is_active ? "true" : "False"}</td>
                  <td>{league.start_date+" to "+league.end_date}</td>
                  <td>{league.team_size}</td>
              </tr>)
            });
    }


    return (
       <div>
          <div className="row">
            <div className="col-sm-10">
             <div>
                <Table striped bordered condensed hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>League  Name</th>
                      <th>Is active</th>
                      <th>Duration</th>
                      <th>Team Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leagueList}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
      </div>   
    );
  }

  componentWillMount(){
    return fetch('http://localhost:8000/api/ced/impactleague/', {
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
          loading:true

        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
