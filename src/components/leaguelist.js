import React, {Component} from 'react';
import { Button, Grid, Row, Col, Table, FormControl,Form, FormGroup,ControlLabel } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import Cookies from 'universal-cookie';
import {RingLoader, PropagateLoader} from 'react-spinners';

const cookies = new Cookies();


export default class LeagueList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading:true,
     
    }
  }

  render() {
    var  league_data = this.state.data;

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

    if (this.state.data){
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
    } else {
      return (
         <div className='row'>
            <div className='col-sm-offset-6 col-sm-6 col-centered'>
              <PropagateLoader
                color={'#123abc'} 
                size={20}
                loading={this.state.loading} 
              /> 
            </div>   
        </div>   
      );
    }
  }

  componentWillMount(){
    return fetch('http://api.impactrun.com/ced/v1/impactleague/', {
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
        // console.error(error);
        window.location = "/logout";

      });
  }
}
