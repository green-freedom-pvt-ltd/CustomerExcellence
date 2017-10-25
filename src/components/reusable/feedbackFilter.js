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
      fetchUrl: 'http://dev.impactrun.com/api/ced/userFeedback/'
    }
    this.logTag = this.logTag.bind(this);
    this.logSubTag = this.logSubTag.bind(this);
    this.logIsChat = this.logIsChat.bind(this);
    this.logIsResolved = this.logIsResolved.bind(this);
    this.onClickReply = this.onClickReply.bind(this);


  }

  onClickReply() {
    

    var path = "http://dev.impactrun.com/api/ced/userFeedback/" + '?'
    const formData = new FormData();
    console.log('inside search feedback filter', path);
    if(this.state.tag){
      path+='tag='+this.state.tag.value + '&'
    }
    if(this.state.sub_tag){
      path+='sub_tag='+this.state.sub_tag.value + '&'
    }
    if(this.state.is_chat){
      path+='is_chat='+this.state.is_chat.value + '&'
    }
    if(this.state.is_resolved){
      path+='is_resolved='+this.state.is_resolved.value + '&'
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


  logIsResolved(val) {
    console.log("Selected: " + JSON.stringify(val));
    this.setState({
      is_resolved: val
    });
  }

  logIsChat(val) {
    console.log("Selected: " + JSON.stringify(val));
    this.setState({
      is_chat: val
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
            <div className='col-sm-5'>
              <h5>Resolved</h5>
            </div>
            <div className='col-sm-7'>
             <Select
                name="form-field-name"
                value={this.state.is_resolved}
                options={boolean_options}
                onChange={this.logIsResolved}
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
                value={this.state.is_chat}
                options={boolean_options}
                onChange={this.logIsChat}
              />
            </div>
          </div>
        </div>
        <div className='col-sm-2'>
          <div className = 'row'>
            <div className='col-sm-7'>
              <Button onClick={() => {this.onClickReply()}}>
                  Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


// export default feedbackContainer;