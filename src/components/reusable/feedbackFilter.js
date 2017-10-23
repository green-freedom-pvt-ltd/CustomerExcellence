import React, { Component } from 'react';
import { Pagination, DropdownButton, MenuItem, Checkbox , Button} from 'react-bootstrap';
import {
  Link
} from 'react-router-dom';
import {RingLoader, PropagateLoader} from 'react-spinners';
import Cookies from 'universal-cookie';
import Select from 'react-select';


const cookies = new Cookies();


export default class FeedbackFilter extends Component {
  constructor(props) {
    // console.log("inside feedback container", props);
    super(props);
    this.state = {
      data: null,
      fetchUrl: 'http://localhost:8000/api/ced/userFeedback/'
    }
    this.logTag = this.logTag.bind(this);
    this.logSubTag = this.logSubTag.bind(this);
    this.logIsChat = this.logIsChat.bind(this);
    this.logIsResolved = this.logIsResolved.bind(this);


  }
  logIsResolved(val) {
    console.log("Selected: " + JSON.stringify(val));
    this.setState({
      resolved: val
    });
  }

  logIsChat(val) {
    console.log("Selected: " + JSON.stringify(val));
    this.setState({
      chat: val
    });
  }

  logTag(val) {
    console.log("Selected: " + JSON.stringify(val));
    this.setState({
      tag: val
    });
  }

 logSubTag(val) {
    console.log("Selected: " + JSON.stringify(val));
    this.setState({
      sub_tag: val
    });
  }
 
  render() {
    var tag_options = [
      { value: 'pastworkout', label: 'pastworkout' },
      { value: 'question', label: 'question' },
      { value: 'feedback', label: 'feedback' },
      { value: 'else', label: 'else' },
      { value: 'flag', label: 'flag' },
      { value: 'sad', label: 'sad' },
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

    return (
      <div className = 'row'>
        <div className='col-sm-12 col-centered'>
          <h2>filters</h2>
        </div>

        <div className='col-sm-2'>
          <div className = 'row'>
            <div className='col-sm-2'>
              <h5>Tag</h5>
            </div>
            <div className='col-sm-10'>
             <Select
                name="form-field-name"
                value={this.state.tag}
                options={tag_options}
                onChange={this.logTag}
              />
            </div>
          </div>
        </div>

        <div className='col-sm-3'>
          <div className = 'row'>
            <div className='col-sm-4'>
              <h5>Sub Tag</h5>
            </div>
            <div className='col-sm-8'>
             <Select
                name="form-field-name"
                value={this.state.sub_tag}
                options={sub_tag_options}
                onChange={this.logSubTag}
              />
            </div>
          </div>
        </div>
        <div className='col-sm-2'>
          <div className = 'row'>
            <div className='col-sm-3'>
              <h5>Chat</h5>
            </div>
            <div className='col-sm-9'>
             <Select
                name="form-field-name"
                value={this.state.chat}
                options={boolean_options}
                onChange={this.logIsChat}
              />
            </div>
          </div>
        </div>
      <div className='col-sm-2'>
          <div className = 'row'>
            <div className='col-sm-5'>
              <h5>Resolved</h5>
            </div>
            <div className='col-sm-7'>
             <Select
                name="form-field-name"
                value={this.state.resolved}
                options={boolean_options}
                onChange={this.logIsResolved}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}


// export default feedbackContainer;