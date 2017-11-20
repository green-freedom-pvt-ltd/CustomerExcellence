import React, { Component } from 'react';
import { Pagination, Table,Checkbox , Button} from 'react-bootstrap';
import {
  Link
} from 'react-router-dom';
import FeedbackModal from "./feedbackModal"
import FeedbackFilter from "./reusable/feedbackFilter"
import {RingLoader, PropagateLoader} from 'react-spinners';
import Cookies from 'universal-cookie';
import _ from "lodash";

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
      count: 0,
      fetchUrl: 'http://dev.impactrun.com/api/ced/userFeedback/'
    }
    this.handleSelect = this.handleSelect.bind(this);
    this.myCallback = this.myCallback.bind(this);
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
        // window.location = "/logout";
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

    myCallback (dataFromChild) {
        this.setState({
          data: dataFromChild,
          loading: false,
          prevPage: dataFromChild.previous,
          userPath: this.state.nextPage,
          nextPage: dataFromChild.next,

        });
        console.log('----------listDataFromChild', this.state.listDataFromChild);
    }

  render() {
    var feedback_data = this.state.data;
    if (feedback_data) {
    console.log("------111--------", feedback_data.count);
      if (this.state.prevPage === null) {
        this.state.pageCount = Math.ceil(feedback_data.count / feedback_data.results.length);
      }
      this.state.count = feedback_data.count;
      // if (this.state.data.results.length < 1) {
      //   return <tr><td colSpan="12" style={{textAlign:"center"}}>No Record Found..!!</td></tr>

      // }
      // else{
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

        var tag_options = [
          { label: 'Past Workout', value: 'pastworkout' },
          { label: 'Question', value: 'question' },
          { label: 'Feedback', value: 'feedback' },
          { label: 'Else', value: 'else' },
          { label: 'Flag', value: 'flag' },
          { label: 'Sad', value: 'sad' },
        ];

        var boolean_options = [
          { value: 'True', label: 'Yes' },
          { value: 'False', label: 'No' },
        ];

        var sub_tag_options = [
          { value: 'less', label: 'Less distance recorded' },
          { value: 'more', label: 'More distance recorded' },
          { value: 'scratched', label: 'Why is it scratched off' },
          { value: 'notvehicle', label: 'I was not in a vehicle' },
          { value: 'leaderboardadd', label: 'Impact missing in Leaderboard' },
          { value: 'stillelse', label: 'Something else' },
          { value: 'notaccurate', label: 'Distance not accurate' },
          { value: 'workoutmissing', label: 'Workout missing from history' },
          { value: 'gpsissue', label: 'Issue with GPS' },
          { value: 'zerodistance', label: 'Zero distance recorded' },
        ];

        var email_options = [
          { value: 'less', label: "Hi ,%0A%0AThis is regarding your feedback about less distance recorded.%0A%0AWe consider speed, step count and activity recognition data to determine if you are walking, running or moving in a vehicle(cycle or motor). %0AOur algorithm is also based on GPS, so on a few occasions due to weak signal, quality of gps chip, dense trees, steep hills, tall buildings or even clouds, slight inaccuracy creeps in. %0ADue to this, it becomes difficult for the device to identify mobility. Accurate counting is of prime importance for us as we convert your distance into money for charity. %0A%0AWe went through your workout history and there seems a slight problem with the gps of your device, please ensure you turn on your GPS for every workout.%0A%0AWe feel deeply regretted that you had to face this problem. We are constantly improving our algorithms to make your walks and jogs accurate.%0A%0ACould you please answer these questions to help us help you resolve this issue?%0A%0A1. How do you measure actual distance apart from Impact app?%0A2. Is there is any difference in the distance on screen between during%0Athe workout(On your during walk/jog  screen) and after completion of your workout?%0A3.  It would be very helpful if you can share a screen shot or two to help us better diagnose.%0A%0AWe value your feedback, let us know if this answered your question.%0A%0AHappy Impacting! Get Fit Do Good.%0A%0AAbhijeet,%0ATeam Impact.%0APowerful avalanches begin with small shifts." },
          { value: 'more', label: "Hi ,%0A%0AThis is regarding your feedback .%0A%0A%0AWe value your feedback, let us know if this answered your question.%0A%0AHappy Impacting. Get Fit Do Good.%0A%0AAbhijeet,%0ATeam Impact.%0A%0AIf everyone is moving forward together, success takes care of itself." },
          { value: 'scratched', label: "Hi ,%0AThis is regarding your feedback about your run being scratched.%0AWe at impact run have made an algorithm that auto flags all suspicious and near to impossible runs as your run distance was more than 50km, it mistook that run as cheating.%0AIts been rectified  now and your past workout is visible in the leaderboard too.%0AWe feel deeply regretted that you had to face this problem. We are constantly improving our algorithms from you feedback and run data.%0A%0AWe value your feedback, let us know if this answered your question.%0A%0AHappy Impacting! Get Fit Do Good!%0A%0AAbhijeet,%0ATeam Impact.%0A%0APowerful avalanches begin with small shifts." },
          { value: 'notvehicle', label: "Hi ,%0AThis is regarding your feedback about not being in a vehicle.%0A%0AWe consider your speed, step count and activity recognition data to determine if you are walking, running or moving in a vehicle(cycle or motor). %0AOur algorithm is also based on GPS, so on a few occasions due to weak signal, quality of gps chip, dense trees, steep hills, tall buildings, or even heavy cloud, slight inaccuracy creeps in. %0ADue to this, it becomes difficult for the device to identify mobility. Accurate counting is of prime importance for us as we convert your distance into money for charity. %0A%0AWe went through your workout history and there seems a problem with the gps of your device, please ensure that GPS is turned on everytime.%0A%0AWe feel deeply regretted that you had to face this problem and are constantly improving our algorithms from your feedback and workout data.%0AWe value your feedback, let us know if this answered your question.%0A%0AHappy Impacting. Get Fit Do Good.%0A%0AAbhijeet,%0ATeam Impact.%0A%0APowerful avalanches begin with small shifts." },
          { value: 'leaderboardadd', label: "Hi ,%0A%0AThanks for informing us about this.%0A%0AWe have checked your workouts. %0A %0ASometimes due to bad network coverage it takes time to sync your workouts to leaderboard.%0ABut don't be disheartened, all your walks and jogs and the impact created is stored safely in our database.%0A%0AIt will definitely show up in a few of hours, if not right away.%0A%0AWe feel deeply regretted that you had to face this problem and are constantly improving our algorithms from your feedback and workout data.%0A%0AWe value your feedback, let us know if this answered your question.%0A%0AHappy Impacting. Get Fit Do Good.%0A%0AAbhijeet,%0ATeam Impact.%0A%0APowerful avalanches begin with small shifts." },
          { value: 'stillelse', label: "Hi ,%0A%0AThis is regarding your feedback .%0A%0A%0AWe value your feedback, let us know if this answered your question.%0A%0AHappy Impacting. Get Fit Do Good.%0A%0AAbhijeet,%0ATeam Impact.%0A%0AIf everyone is moving forward together, success takes care of itself." },
          { value: 'notaccurate', label: "Hi ,%0AThis is regarding your feedback about inaccurate tracking.%0A%0AWe consider speed, step count and activity recognition data to determine whether you are walking, running or moving in a vehicle (cycle or motor). %0AWe went through your workout history and there seems a problem with the gps of your device, please ensure you turn on GPS everytime you walk, jog with us.%0A%0AOur algorithm is based on GPS, so on a few occasions due to weak signal, quality of gps chip, dense trees, steep hills, tall buildings, or even heavy clouds, slight inaccuracy creeps in. %0ADue to this, it becomes difficult for the device to identify mobility. Accurate counting is of prime importance for us as we convert your distance into money for charity. %0A%0AMost Android phones made in the last couple of years have had fairly solid GPS sensors. %0AThe keys to a good GPS are clear access to the sky and slgiht patience :)%0A %0AWe feel deeply regretted that you had to face this problem. We are constantly improving our algorithms from you feedback and run data.%0A%0AWe value your feedback, let us know if this answered your question.%0A%0AHappy Impacting. Get Fit Do Good.%0A%0A%0AAbhijeet,%0ATeam Impact.%0A%0APowerful avalanches begin with small shifts." },
          { value: 'workoutmissing', label: "Hi ,%0A%0AThis is regarding your feedback .%0A%0A%0AWe value your feedback, let us know if this answered your question.%0A%0AHappy Impacting. Get Fit Do Good.%0A%0AAbhijeet,%0ATeam Impact.%0A%0AIf everyone is moving forward together, success takes care of itself."},
          { value: 'gpsissue', label: "Hi ,%0A%0AThis is regarding your feedback about bad GPS.%0A%0AWe consider speed, step count and activity recognition data to determine if you are walking, running or moving in a vehicle(cycle or motor). %0AOur algorithm is also based on GPS, so on a few occasions due to weak signal, quality of gps chip, dense trees, steep hills, tall buildings, or even heavy cloud, slight inaccuracy creeps in. %0ADue to this, it becomes difficult for the device to identify mobility. Accurate counting is of prime importance for us as we convert your distance into money for charity. %0A%0ATo improve GPS signal, keep the device in one place for a few seconds and make sure the device's data communications are enabled. This allows the phone's GPS to get better hints about its location. %0A%0AMost Android phones made in the last couple of years have had fairly solid GPS sensors. %0AThe keys to a good GPS are clear access to the sky and patience :) We will check why your signal was inaccurate.%0A%0AWe value your feedback, let us know if this answered your question.%0A%0AHappy Impacting. Get Fit Do Good.%0A%0A<Your Name>,%0ATeam Impact.%0A%0APowerful avalanches begin with small shifts." },
          { value: 'zerodistance', label: "Hi ,%0A%0AThis is regarding your feedback regarding zero distance recorded.%0A%0AWe consider speed, step count and activity recognition data to determine whether you are walking, running or moving in a vehicle (cycle or motor). %0A%0AWe went through your workout history and there seems a problem with the gps of your device, please ensure you turn on GPS everytime you walk, jog with us.%0A%0AOur algorithm is based on GPS, so on a few occasions due to weak signal, quality of gps chip, dense trees, steep hills, tall buildings, or even heavy clouds, slight inaccuracy creeps in. %0ADue to this, it becomes difficult for the device to identify mobility. Accurate counting is of prime importance for us as we convert your distance into money for charity. %0A%0AMost Android phones made in the last couple of years have had fairly solid GPS sensors. %0AThe keys to a good GPS are clear access to the sky and slgiht patience :)%0A %0AWe feel deeply regretted that you had to face this problem. We are constantly improving our algorithms from you feedback and run data.%0A%0AWe value your feedback, let us know if this answered your question.%0A%0AHappy Impacting. Get Fit Do Good.%0A%0A<Your Name>,%0ATeam Impact.%0A%0APowerful avalanches begin with small shifts" },
        ];

        var email_subject = "Impact Feedback"

        var feedbackList = feedback_data.results.map((feedback, index) => {
          var epoch_timestamp = feedback.client_time_stamp
          var feedback_date_time = new Date(epoch_timestamp)
          var tag_lable = _.find(tag_options, function(o) { return o.value == feedback.tag; });
          var sub_tag_lable = _.find(sub_tag_options, function(o) { return o.value == feedback.sub_tag; });
          var email_body = _.find(email_options, function(o) { return o.value == feedback.sub_tag; });
          var email_body_content ="Hi ,%0A%0AThis is regarding your feedback .%0A%0A%0AWe value your feedback, let us know if this answered your question.%0A%0AHappy Impacting. Get Fit Do Good.%0A%0AAbhijeet,%0ATeam Impact.%0A%0AIf everyone is moving forward together, success takes care of itself.";
          if (email_body){
          var email_body_content =email_body.label;
          // console.log('email_body_content------------',email_body_content);
          }
          return (
            
            <tr key={index} className={feedback.is_replied ? "success" : "default"}>
              <td>{index + 1}</td>
              <td>
                <Link to={"/userdetail/" + feedback.user_id} target='_blank'>
                  {feedback.user_id}
                </Link>
              </td>
              <td><a href={"https://mail.google.com/mail/u/1/?view=cm&fs=1&to="+feedback.email+"&su="+email_subject+"&body="+email_body_content+"&tf=1"} target="_blank">{feedback.email}</a></td>
              <td>{feedback_date_time.toLocaleString()}</td>
              <td>{tag_lable ? tag_lable.label : "No Tag"}</td>
              <td>{sub_tag_lable ? sub_tag_lable.label : "No Sub Tag"}</td>
              <td>{feedback.feedback ? feedback.feedback : "-"}</td>
                {replyFeedback(feedback,index)}
              <td>
                <Link to={"/rundetail/" + feedback.run_id} target='_blank'>
                  {feedback.run_id}
                </Link>
              </td>
              <td>{feedback.phone_number}</td>
              <td>{feedback.is_chat ? "Yes" : "No"}</td>
              <td>{feedback.client_run_id}</td>
              <td>{feedback.feedback_app_version}</td>
              <td>{feedback.is_ios ? "Yes" : "No"}</td>
            </tr>)
        });

      }
     
    // }


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
          <div className='col-sm-6'>
              <h1> Feedback list </h1>
          </div>
          <div className='col-sm-6'>
              <h1> Total Count {this.state.count} </h1>
          </div>
          <div className='col-sm-12'>
              <FeedbackFilter callbackFromParent={this.myCallback} />
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
                  <th>Tag</th>
                  <th>Sub Tag</th>
                  <th>Feedback</th>
                  <th>Resolution</th>
                  <th>Run Id</th>
                  <th>Phone Number</th>
                  <th>Chat</th>
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
                maxButtons={5}
                activePage={this.state.activePage}
                onSelect={this.handleSelect} />
            </div>
          </div>
      </div>
    );
  }
}


// export default feedbackContainer;