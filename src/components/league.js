import React, {Component} from 'react';
import { Button, Grid, Row, Col, Table, FormControl,Form, FormGroup,ControlLabel } from 'react-bootstrap';
import LeagueList from './leaguelist';
import Team from './team';

export default class League extends Component{
  constructor(props) {
    super(props);
    var path = window.location.pathname;
    path = path.split("/");
    this.state = {
      data: null,
      loading:false,
      league_id: null,     
    }
    if (path[2]) {
      this.state.league_id=path[2];
    }
  }

  render() {
    // if (this.state.league_id) {
    //   return (
    //      <div>
    //         <h1> Team list </h1>
    //        <Team league_id={this.state.league_id} />
    //     </div>   
    //   );
    // } else {
      return (
         <div>
            <h1> League list </h1>
           <LeagueList/>
        </div>   
      );
    // }
  }
}
