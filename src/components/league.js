import React, {Component} from 'react';
import { Table} from 'react-bootstrap';

export default class League extends Component{
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
                  <td>{league.impactleague_name}</td>
                  <td>{league.is_active ? "true" : "False"}</td>
                  <td>{league.start_date+" to "+league.end_date}</td>
              </tr>)
            });
    }


    return (
       <div>
          <h1> League list </h1>
         <div>
            <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>League  Name</th>
                  <th>Is active</th>
                  <th>Duration</th>
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
    return fetch('http://dev.impactrun.com/api/ced/impactleague/', {
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
