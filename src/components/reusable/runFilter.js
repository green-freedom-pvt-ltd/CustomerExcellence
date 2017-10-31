import React, { Component } from 'react';
import { Pagination, DropdownButton, MenuItem, Checkbox , Button} from 'react-bootstrap';
import {
  Link
} from 'react-router-dom';
import {RingLoader, PropagateLoader} from 'react-spinners';
import Cookies from 'universal-cookie';
import Select from 'react-select';
import _ from "lodash";


const cookies = new Cookies();


export default class RunFilter extends Component {
  constructor(props) {
    console.log("inside runssssssssss container", props);
    super(props);
    this.state = {
      data: null,
      fetchUrl: 'http://dev.impactrun.com/api/ced/userFeedback/',
      user_id:"",
      run_id:"",
      client_run_id:"",
      filterOptions:"more",
    }
    this.logUserId = this.logUserId.bind(this);
    this.logRunId = this.logRunId.bind(this);
    this.logClientRunId = this.logClientRunId.bind(this);
    this.fetchLeagueNames = this.fetchLeagueNames.bind(this);
    this.onClickReply = this.onClickReply.bind(this);
    this.logIsFlag = this.logIsFlag.bind(this);
    this.logLeague = this.logLeague.bind(this);
    this.logCause = this.logCause.bind(this);


  }

  componentWillMount(){
    this.fetchLeagueNames();
  }


  fetchLeagueNames  (){
    return fetch('http://dev.impactrun.com/api/ced/impactleague/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': cookies.get('authorization')
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        var data_results = responseJson.results;
        var data_set = _.map(data_results,function(leg){ return {value: leg.impactleague_name.split(" ").join("%20"), label: leg.impactleague_name}});
        this.setState({
          league_names: data_set,
        });
      })
      .catch((error) => {
        // console.error(error);
        window.location = "/logout";

      });
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
    
    if(this.state.is_flag){
      path+='is_flag='+this.state.is_flag.value + '&'
    }

    if(this.state.league){
      path+='league='+this.state.league.value + '&'
    }

    if(this.state.cause){
      path+='cause='+this.state.cause.value + '&'
    }
    console.log('inside search path', path);
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
        console.log('inside componentWillMount feedback', this.state);
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

  logIsFlag(val) {
    console.log("Selected: " + JSON.stringify(val));
    this.setState({
      is_flag: val
    });
  }


  logLeague(val) {
    console.log("Selected: " + JSON.stringify(val));
    this.setState({league: val});
  }

  logCause(val) {
    console.log("Selected: " + JSON.stringify(val));
    this.setState({cause: val});
  }

  render() {
    // if (this.props.causeNames){
    //   this.setState({
    //   causeNames: this.props.causeNames
    // });
    // }


    var boolean_options = [
      { value: 'True', label: 'Yes' },
      { value: 'False', label: 'No' },
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
                <div className = 'row'>
                 <div className='col-sm-12 col-centered'>
                     <div className='col-sm-offset-8 col-sm-4'>
                        <a onClick={() =>  {this.setState({filterOptions:"less"})}} > less options</a>
                     </div>
                  </div>
                </div>
                <div className = 'row'>
    			         <div className='col-sm-12'>


    		               <div className='col-sm-4'>
    		                  <div className = 'row'>
                            <div className='col-sm-2'>
                              <h5>League</h5>
                            </div>
                            <div className='col-sm-9'>
                             <Select
                                name="form-field-name"
                                value={this.state.league}
                                options={this.state.league_names}
                                onChange={this.logLeague}
                              />
                            </div>
                          </div>
    		 			        	</div>

                        <div className='col-sm-4'>
                          <div className = 'row'>
                            <div className='col-sm-2'>
                              <h5>Cause</h5>
                            </div>
                            <div className='col-sm-9'>
                             <Select
                                name="form-field-name"
                                value={this.state.cause}
                                options={this.props.causeNames}
                                onChange={this.logCause}
                              />
                            </div>
                          </div>
                        </div>

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
                value={this.state.is_flag}
                options={boolean_options}
                onChange={this.logIsFlag}
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