import React, { Component } from 'react';
import { Button, Grid, Row, Col, Table, FormControl,Form, FormGroup,ControlLabel } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

// export default class Feedback extends Component{
// render(){
//     return (
//         <div>This is Feedback page</div>
//     );
// }
// }



export default class Feedback extends Component{
  constructor(props) {
    console.log("inside feedback container", props);
    super(props);
    this.state = {
      data: null,
      loading:false,
      fetchUrl:'http://dev.impactrun.com/api/ced/userFeedback/'
    }
    if (props.user_id){
      this.state.fetchUrl+= '?user_id=' + props.user_id
      console.log("inside feedback fetchUrl", this.state.fetchUrl);

    }
  }

  render() {
    var  feedback_data = this.state.data;
    console.log("------111--------",feedback_data);
    if(feedback_data){
    var feedbackList = feedback_data.results.map((feedback, index) => {
      var epoch_timestamp = feedback.client_time_stamp
      var feedback_date_time = new Date(epoch_timestamp)
          return (
              <tr key={index}>
                  <td>{index +1}</td>
                  <td>
                    <Link to={"/userdetail/"+feedback.user_id}>
                      {feedback.user_id}
                  </Link>
                  </td>
                  <td><a href={"mailto:"+feedback.email}>{feedback.email}</a></td>
                  <td>{feedback_date_time.toUTCString()}</td>
                  <td>{feedback.feedback ? feedback.feedback : "-"}</td>
                  <td>{feedback.run_id}</td>
                  <td>{feedback.phone_number}</td>
                  <td>{feedback.is_chat ? "yes" : "no"}</td>
                  <td>{feedback.tag}</td>
                  <td>{feedback.sub_tag}</td>
                  <td>{feedback.feedback_app_version}</td>
                  <td>{feedback.is_ios ? "yes" : "no"}</td>
              </tr>)
            });
    }


    return (
       <div>
          <h1> Feedback list </h1>
         <div>
            <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>User Id</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Feedback</th>
                  <th>Run Id</th>
                  <th>Phone Number</th>
                  <th>Chat</th>
                  <th>Tag</th>
                  <th>Sub Tag</th>
                  <th>App Version</th>
                  <th>Is iOS</th>
                </tr>
              </thead>
              <tbody>
                {feedbackList}
              </tbody>
            </Table>
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
        console.log('inside componentWillMount feedback',this.state.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}


// export default feedbackContainer;