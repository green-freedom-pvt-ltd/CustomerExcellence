import React, { Component } from 'react';
import { Pagination, Table,Checkbox } from 'react-bootstrap';
import {
  Link
} from 'react-router-dom';


export default class Feedback extends Component {
  constructor(props) {
    // console.log("inside feedback container", props);
    super(props);
    this.state = {
      data: null,
      loading: false,
      activePage: 1,
      nextPage: '',
      prevPage: '',

      fetchUrl: 'http://dev.impactrun.com/api/ced/userFeedback/'
    }
    this.handleSelect = this.handleSelect.bind(this);
    if (props.user_id) {
      this.state.fetchUrl += '?user_id=' + props.user_id
      // console.log("inside feedback fetchUrl", this.state.fetchUrl);
    }
  }

  handleSelect(eventKey) {
    // console.log("Current Page", eventKey)
    // console.log("Page", this.state.userPath)
    // console.log("Prev Page", this.state.prevPage)
    if (this.state.activePage < eventKey) {
      this.fetchResults(this.state.nextPage);
    }
    else if (this.state.activePage > eventKey) {
      this.fetchResults(this.state.prevPage);
    }
    else {

    }
    this.setState({
      activePage: eventKey,

    });
  }

  componentWillMount() {
    this.fetchResults(this.state.fetchUrl);
  }

  fetchResults(path) {
    fetch(path, {
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
          loading: true,
          prevPage: responseJson.previous,
          userPath: this.state.nextPage,
          nextPage: responseJson.next,

        });
        // console.log('inside componentWillMount feedback', this.state.data);
      })
      .catch((error) => {
        // console.error(error);
      });
  }

  render() {
    var feedback_data = this.state.data;
    // console.log("------111--------", feedback_data);
    if (feedback_data) {
      if (this.state.prevPage === null) {
        this.state.pageCount = Math.ceil(feedback_data.count / feedback_data.results.length);
      }

      if (this.state.data.results.length < 1) {
        return <tr><td colSpan="12" style={{textAlign:"center"}}>No Record Found..!!</td></tr>

      }
      else{
        var feedbackList = feedback_data.results.map((feedback, index) => {
          var epoch_timestamp = feedback.client_time_stamp
          var feedback_date_time = new Date(epoch_timestamp)
          return (
            <tr key={index} className={feedback.is_replied ? "success" : "default"}>
              <td>{index + 1}</td>
              <td>
                <Link to={"/userdetail/" + feedback.user_id}>
                  {feedback.user_id}
                </Link>
              </td>
              <td><a href={"mailto:" + feedback.email}>{feedback.email}</a></td>
              <td>{feedback_date_time.toUTCString()}</td>
              <td>{feedback.feedback ? feedback.feedback : "-"}</td>
              <td><Checkbox checked={feedback.is_replied} onChange={feedback.is_replied=false} >
                      {feedback.is_replied}
                  </Checkbox>
              </td>
              <td>{feedback.resolution ? feedback.resolution : "-"}</td>
              <td>{feedback.run_id}</td>
              <td>{feedback.phone_number}</td>
              <td>{feedback.is_chat ? "yes" : "no"}</td>
              <td>{feedback.tag}</td>
              <td>{feedback.sub_tag}</td>
              <td>{feedback.client_run_id}</td>
              <td>{feedback.feedback_app_version}</td>
              <td>{feedback.is_ios ? "yes" : "no"}</td>
            </tr>)
        });

      }
     
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
                <th>Is replied</th>
                <th>Resolution</th>
                <th>Run Id</th>
                <th>Phone Number</th>
                <th>Chat</th>
                <th>Tag</th>
                <th>Sub Tag</th>
                <th>Client Run Id</th>
                <th>App Version</th>
                <th>Is iOS</th>
              </tr>
            </thead>
            <tbody>
              {feedbackList}
            </tbody>
          </Table>
          <div style={{display:this.state.pageCount>1?"block":"none"}} id="pagination">
            <Pagination
              prev
              next
              first
              last
              ellipsis
              boundaryLinks
              items={this.state.pageCount}
              maxButtons={3}
              activePage={this.state.activePage}
              onSelect={this.handleSelect} />
          </div>
        </div>
      </div>
    );
  }
}


// export default feedbackContainer;