import React, { Component } from 'react';
import { Pagination, DropdownButton, MenuItem, Checkbox , Button} from 'react-bootstrap';
import {
  Link
} from 'react-router-dom';
import {RingLoader, PropagateLoader} from 'react-spinners';
import Cookies from 'universal-cookie';
import Select from 'react-select';


const cookies = new Cookies();


export default class RunFilter extends Component {
  constructor(props) {
    // console.log("inside feedback container", props);
    super(props);
    this.state = {
      data: null,
      fetchUrl: 'http://dev.impactrun.com/api/ced/userFeedback/',
      user_id:"",
      run_id:"",
      client_run_id:"",
      filterOptions:"less",
    }
    this.logUserId = this.logUserId.bind(this);
    this.logRunId = this.logRunId.bind(this);
    this.logClientRunId = this.logClientRunId.bind(this);
    this.logIsChat = this.logIsChat.bind(this);
    this.onClickReply = this.onClickReply.bind(this);

  }

  onClickReply() {
    

    var path = "http://localhost:8000/api/ced/runs/?"
    const formData = new FormData();
    console.log('inside search run filter', this.state);
    if(this.state.user_id){
      path+='user_id='+this.state.user_id + '&'
    }
    if(this.state.run_id){
      path+='run_id='+this.state.run_id + '&'
    }
    if(this.state.client_run_id){
      path+='client_run_id='+this.state.client_run_id + '&'
    }
    
    
    if(this.state.is_replied){
      path+='is_replied='+this.state.is_replied.value + '&'
    }
    console.log('inside search feedback filter', path);
    return fetch(path, {
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
        this.props.callbackFromParent(responseJson);
        console.log('inside componentWillMount feedback', this.state.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  logUserId(event) {
    this.setState({user_id: event.target.value});
  }

  logRunId(event) {
    this.setState({run_id: event.target.value});

  }

 logClientRunId(event) {
    this.setState({client_run_id: event.target.value});
  }
 

  // logUserId(val) {
  //   console.log("Selected: user_id " + JSON.stringify(val));
  //   this.setState({
  //     user_id: val
  //   });
  // }

  logIsChat(val) {
    console.log("Selected: " + JSON.stringify(val));
    this.setState({
      is_chat: val
    });
  }

  render() {
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

    var replyFeedback = () => {
          if(this.state.filterOptions === "less"){
          	console.log("------------------", this.state.filterOptions);
            return (
              <div className='col-sm-offset-8 col-sm-4'>
              		<a onClick={() => {this.setState({filterOptions:"more"})}} > more options</a>
 			</div>
          )
          } else {
            return (
            	<div className = 'row'>
			        <div className='col-sm-12 col-centered'>
		               <div className='col-sm-offset-8 col-sm-4'>
		              		<a onClick={() =>  {this.setState({filterOptions:"less"})}} > less options</a>
		 				</div>
			        </div>
			        <div className='col-sm-12 col-centered'>
		               <div className='col-sm-offset-8 col-sm-4'>
		               filter one
		 				</div>
			        </div>
			    </div>
          )
          }
        };

    return (
     <div className = 'row'>
      <div className = 'row'>
        <div className='col-sm-12 col-centered'>
        </div>
        <div className='col-sm-2'>
          <div className = 'row'>
            <div className='col-sm-12'>
              <h5>User Id</h5>
            </div>
            <div className='col-sm-12'>
              <input type="text" value={this.state.user_id} onChange={this.logUserId} name="my-input-field"/>
          	</div>
          </div>
        </div>

       <div className='col-sm-2'>
          <div className = 'row'>
            <div className='col-sm-12'>
              <h5>Run Id</h5>
            </div>
            <div className='col-sm-12'>
              <input type="text" value={this.state.run_id} onChange={this.logRunId} name="my-input-field"/>
          	</div>
          </div>
        </div>


    	<div className='col-sm-2'>
          <div className = 'row'>
            <div className='col-sm-12'>
              <h5>Client Id</h5>
            </div>
            <div className='col-sm-12'>
              <input type="text" value={this.state.client_run_id} onChange={this.logClientRunId} name="my-input-field"/>
          	</div>
          </div>
        </div>

 		<div className='col-sm-2'>
          <div className = 'row'>
            <div className='col-sm-12'>
              <h5>Flag</h5>
            </div>
            <div className='col-sm-12'>
             <Select
                name="form-field-name"
                value={this.state.is_chat}
                options={boolean_options}
                onChange={this.logIsChat}
              />
            </div>
          </div>
        </div>

        <div className='col-sm-2'>
          <div className = 'row'>
          <br/>
          <br/>
            <div className='col-sm-12'>
              <Button onClick={() => {this.onClickReply()}}>
                  Search
              </Button>
            </div>
          </div>
        </div>
      </div>

        <div className = 'row'>
          <br/>
              {replyFeedback()}
 		</div>
     </div>
    );
  }
}


// export default feedbackContainer;