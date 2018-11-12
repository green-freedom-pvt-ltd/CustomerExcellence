import React, { Component } from 'react';
import { Button, Grid, Row, Col, Table, FormControl, Form, FormGroup, ControlLabel } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import { RingLoader, PropagateLoader } from 'react-spinners';
import Cookies from 'universal-cookie';
const cookies = new Cookies();


export default class TeamMembers extends Component {
  constructor(props) {
    super(props);
    var path = window.location.pathname;
    path = path.split("/");
    this.state = {
      data: null,
      loading: true,
      fetchUrl: 'http://api.impactrun.com/ced/v1/employeelist/',
      team_id: null,

    }
    if (path[2]) {
      this.state.fetchUrl += '?team_id=' + path[2]
    }
  }

  render() {
    var league_data = this.state.data;
    if (!this.state.loading || league_data) {
      let leagueList = '';
      if (league_data.results.length === 0) {
        leagueList = (

          <tr>
            <td colSpan={9} style={{ textAlign: "center" }}>No Records Found!!</td>
          </tr>
        )

      }
      else {

        leagueList = league_data.results.map((league, index) => {
 
          return (
            <tr key={index}  >
              <td style={{ textAlign: "center", verticalAlign: "middle" }}>{index + 1}</td>
              <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                <Link to={"/userdetail/" + league.user + "/"}>
                  {league.user}
                </Link>
              </td>
              <td colSpan={2} style={{ textAlign: "center", verticalAlign: "middle" }}>
                <div style={{ display:"flex",alignItems: "center" }}>

                  <div className="col-sm-4" style={{ textAlign: "center", verticalAlign: "middle" }}><img className="img-circle" style={{ marginRight: "10px" }} src={league.user_image} alt={"profile" + index} width={70} height={70} /></div>
                  <div className="col-sm-8" style={{ textAlign: "center", verticalAlign: "middle" }}><span>{league.user_name}</span></div>
                </div>
              </td>
              <td style={{ textAlign: "center", verticalAlign: "middle" }}>{league.date_registered}</td>
              <td style={{ textAlign: "center", verticalAlign: "middle" }}>{league.is_logout ? 'No' : 'Yes'}</td>
              <td style={{ textAlign: "center", verticalAlign: "middle" }}>{league.team}</td>
              <td style={{ textAlign: "center", verticalAlign: "middle" }}>{league.impactleague_id}</td>
              <td style={{ textAlign: "center", verticalAlign: "middle" }}>{league.department ? league.department : '-'}</td>
              <td style={{ textAlign: "center", verticalAlign: "middle" }}>{league.city ? league.city : '-'}</td>
            </tr>)

        })

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
            <div className="col-sm-12">
              <Table striped bordered condensed hover>
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>#</th>
                    <th style={{ textAlign: "center" }}>User</th>
                    <th style={{ textAlign: "center" }} colSpan={2}>User Name</th>
                    <th style={{ textAlign: "center" }}>Registration Date</th>
                    <th style={{ textAlign: "center" }}>Logged In</th>
                    <th style={{ textAlign: "center" }}>Team Name</th>
                    <th style={{ textAlign: "center" }}>Impact League</th>
                    <th style={{ textAlign: "center" }}>Department</th>
                    <th style={{ textAlign: "center" }}>City</th>
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
    else {
      return (

        <div className='col-sm-offset-6 col-sm-6 col-centered'>
          <PropagateLoader
            color={'#123abc'}
            size={20}
            loading={this.state.loading}

          />
        </div>
      )
    }




  }

  componentWillMount() {
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
          loading: false
        });
        return;
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
