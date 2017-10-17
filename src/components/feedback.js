import React, { Component } from 'react';
import { Pagination, Table,Checkbox , Button} from 'react-bootstrap';
import {
  Link
} from 'react-router-dom';
import FeedbackModal from "./feedbackModal"
import {RingLoader, PropagateLoader} from 'react-spinners';
import Cookies from 'universal-cookie';

const cookies = new Cookies();


export default class Feedback extends Component {
  constructor(props) {
    // console.log("inside feedback container", props);
    super(props);
    this.state = {
      data: null,
      loading: true,
      activePage: 1,
      nextPage: '',
      prevPage: '',
      childVisible: false,

      fetchUrl: 'http://localhost:8000/api/ced/userFeedback/'
    }
    this.handleSelect = this.handleSelect.bind(this);
    if (props.user_id) {
      this.state.fetchUrl += '?user_id=' + props.user_id
      // console.log("inside feedback fetchUrl", this.state.fetchUrl);
    }
  }


 

  handleReply(event) {
    console.log("inside handle reply ",event);
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
        'Authorization': cookies.get('authorization')
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          data: responseJson,
          loading: false,
          prevPage: responseJson.previous,
          userPath: this.state.nextPage,
          nextPage: responseJson.next,

        });
        // console.log('inside componentWillMount feedback', this.state.data);
      })
      .catch((error) => {
       console.error(error);
        window.location = "/logout";
      });
  }

   handleCheckbox(event) {
      console.log("inside handleCheckbox",event, this);
      if (this) {
      this.setState({childVisible: !this.state.childVisible});
      } 
    }

    onClickReply(feedback_id) {
      // this.setState({childVisible: !this.state.childVisible});
      console.log("feedback_id----------",feedback_id);
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
      var resolutionFields = (feedback,index) => {
          return (
              <tr key={index} className={feedback.is_replied ? "success" : "default"}>
                <td>
                  <Checkbox onChange={this.handleCheckbox} >
                      {feedback.is_replied}
                  </Checkbox>
                </td>
                <td>
                  <input type="text" name="my-input-field" onChange={this.handleCheckbox} readOnly={feedback.is_replied} />
                </td>
                <td>
                  <Button onClick={() => {this.onClickReply(feedback.id)}}>
                      Save
                  </Button>
                </td>
              </tr>
              )
      }

      var replyFeedback = (feedback,index) => {
          var epoch_timestamp = feedback.client_time_stamp
          var feedback_date_time = new Date(epoch_timestamp)
          if(feedback.is_replied){
            return (
              <tr key={index} className={feedback.is_replied ? "success" : "default"}>
                <td>
                   <td>{feedback.resolution ? feedback.resolution : "-"}</td>
                </td>
              </tr>
          )
          } else {
            return (
              <tr key={index} className={feedback.is_replied ? "success" : "default"}>
                <td>
                  <FeedbackModal feedback_id={feedback.id}/>
                </td>

                {this.state.childVisible ? resolutionFields(feedback,index) : null }

              </tr>
          )
          }
        };

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
              <td>{feedback_date_time.toLocaleString()}</td>
              <td>{feedback.feedback ? feedback.feedback : "-"}</td>
              
              {replyFeedback(feedback,index)}
              
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
        <div className='row'>
          <div className='col-sm-offset-6 col-sm-6 col-centered'>
            <PropagateLoader
                    color={'#123abc'} 
                    size={20}
                    loading={this.state.loading} 
                  />
          </div>
          <div className='col-sm-12'>
              <h1> Feedback list </h1>
          </div>
          
        </div>

          <div className='row'>
            <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>User Id</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Feedback</th>
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