import React, { Component } from 'react';
import { Pagination, DropdownButton, MenuItem, Checkbox , Button} from 'react-bootstrap';
import {
  Link
} from 'react-router-dom';
import {RingLoader, PropagateLoader} from 'react-spinners';
import Cookies from 'universal-cookie';
import _ from "lodash";
import Select from 'react-select';
import {defaultRanges, Calendar, DateRange } from 'react-date-range';
import moment from 'moment';

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
      filterOptions:"less",
      loading: false,

    }
    this.logUserId = this.logUserId.bind(this);
    this.logRunId = this.logRunId.bind(this);
    this.logClientRunId = this.logClientRunId.bind(this);
    this.fetchLeagueNames = this.fetchLeagueNames.bind(this);
    this.onClickSearch = this.onClickSearch.bind(this);
    this.logIsFlag = this.logIsFlag.bind(this);
    this.logLeague = this.logLeague.bind(this);
    this.logCause = this.logCause.bind(this);
    this.logIsIOs = this.logIsIOs.bind(this);
    this.logMinDistance = this.logMinDistance.bind(this);
    this.logMaxDistance = this.logMaxDistance.bind(this);
    this.logMinSteps = this.logMinSteps.bind(this);
    this.logMaxSteps = this.logMaxSteps.bind(this);
    this.logMinDuration = this.logMinDuration.bind(this);
    this.logMaxDuration = this.logMaxDuration.bind(this);
    this.handleSelect = this.handleSelect.bind(this);


  }

    handleSelect(date){
      // this.fetchNewData(date);
      this.setState({
        date: date
      });
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


  onClickSearch() {
    this.setState({
      loading: true,
    });
    var path = "http://dev.impactrun.com/api/ced/runs/?"
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

    if(this.state.is_iOS){
      path+='is_ios='+this.state.is_iOS.value + '&'
    }

    if(this.state.distance_less){
      path+='distance_less='+this.state.distance_less + '&'
    }

    if(this.state.distance_more){
      path+='distance_more='+this.state.distance_more + '&'
    }   

    if(this.state.steps_less){
      path+='steps_less='+this.state.steps_less + '&'
    }

    if(this.state.steps_more){
      path+='steps_more='+this.state.steps_more + '&'
    } 

    if(this.state.duration_less){
      path+='duration_less='+this.state.duration_less*60 + '&'
    }

    if(this.state.duration_more){
      path+='duration_more='+this.state.duration_more*60 + '&'
    }  

    if(this.state.date){
      var date = this.state.date;
      var startTime = moment(date.startDate);
      var endTime = moment(date.endDate);
      var start_date_query = startTime.year() + "-" + (startTime.month() + 1) + "-" + startTime.date()
      var end_date_query = endTime.year() + "-" + (endTime.month() + 1) + "-" + endTime.date()
      if(start_date_query){
        path+='start_date='+start_date_query + '&'
      }

      if(end_date_query){
        path+='end_date='+end_date_query + '&'
      }  
    }

    console.log('inside end_date_query --------------', start_date_query,end_date_query);


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

onClickClear() {
    
    var path = "http://dev.impactrun.com/api/ced/runs/?"
    this.state = {
      data: null,
      fetchUrl: 'http://dev.impactrun.com/api/ced/userFeedback/',
      user_id:"",
      run_id:"",
      client_run_id:"",
      filterOptions:"more",
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

  handleChange() {
    console.log('Change');
  }

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

  logIsIOs(val) {
    console.log("Selected: " + JSON.stringify(val));
    this.setState({is_iOS: val});
  }

  logMinDistance(event) {
    this.setState({distance_less: event.target.value});
  }

  logMaxDistance(event) {
    this.setState({distance_more: event.target.value});
  }

  logMinSteps(event) {
    this.setState({steps_less: event.target.value});
  }

  logMaxSteps(event) {
    this.setState({steps_more: event.target.value});
  }


  logMinDuration(event) {
    this.setState({duration_less: event.target.value});
  }

  logMaxDuration(event) {
    this.setState({duration_more: event.target.value});
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

    var moreFilterOptions = () => {
          if(this.state.filterOptions === "less"){

            console.log("------------------", this.state.filterOptions);
            return (
              <div className='col-sm-offset-9 col-sm-3'>
                  <a onClick={() => {this.setState({filterOptions:"more"})}} > more options</a>
              </div>
          )
          } else {
            return (
              <div className = 'box-top-left'>
                <div className = 'row'>
                 <div className='col-sm-12 col-centered'>
                     <div className='col-sm-offset-9 col-sm-3'>
                        <a onClick={() =>  {this.setState({filterOptions:"less"})}} > less options</a>
                     </div>
                  </div>
                </div>
                <div className = 'row'>
                   <div className='col-sm-12'>


                       <div className='col-sm-3'>
                          <div className = 'row'>
                            <div className='col-sm-3'>
                              <h5>League</h5>
                            </div>
                            <div className='col-sm-8'>
                             <Select
                                name="form-field-name"
                                value={this.state.league}
                                options={this.state.league_names}
                                onChange={this.logLeague}
                              />
                            </div>
                          </div>
                        </div>

                        <div className='col-sm-3'>
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

                        <div className='col-sm-3'>
                          <div className = 'row'>
                            <div className='col-sm-2'>
                              <h5>iOS</h5>
                            </div>
                            <div className='col-sm-9'>
                             <Select
                              name="form-field-name"
                              value={this.state.is_iOS}
                              options={boolean_options}
                              onChange={this.logIsIOs}
                            />
                            </div>
                          </div>
                        </div>

                  </div>
                  <div className='col-sm-4'>
                    <br/>
                    <br/>
                    <br/>
                    <div className='col-sm-12'>
                          <div className = 'row'>
                            <div className='col-sm-3'>
                              <h5>Distance </h5>
                            </div>
                            <div className='col-sm-2'>
                              <input type="text" size="6" value={this.state.distance_less} onChange={this.logMinDistance}/>
                            </div>
                            <div className='col-sm-1 col-centered'>
                                to
                            </div>
                             <div className='col-sm-2'>
                              <input type="text" size="6" value={this.state.distance_more} onChange={this.logMaxDistance}/>
                            </div>
                            <div className='col-sm-3'>
                              <h7>km </h7>
                            </div>
                         </div>
                        </div>

                         <br/>
                         <br/>
                         <br/>

                         <div className='col-sm-12'>
                          <div className = 'row'>
                            <div className='col-sm-3'>
                              <h5>Steps</h5>
                            </div>
                            <div className='col-sm-2'>
                              <input type="text" size="6" value={this.state.steps_less} onChange={this.logMinSteps}/>
                            </div>
                            <div className='col-sm-1 col-centered'>
                                to
                            </div>
                             <div className='col-sm-2'>
                              <input type="text" size="6" value={this.state.steps_more} onChange={this.logMaxSteps}/>
                            </div>
                            <div className='col-sm-3'>
                              <h7> count </h7>
                            </div>
                         </div>
                        </div>

                         <br/>
                         <br/>
                         <br/>

                         <div className='col-sm-12'>
                          <div className = 'row'>
                            <div className='col-sm-3'>
                              <h5>Duration</h5>
                            </div>
                            <div className='col-sm-2'>
                              <input type="text" size="6" value={this.state.duration_less} onChange={this.logMinDuration}/>
                            </div>
                            <div className='col-sm-1 col-centered'>
                                to
                            </div>
                             <div className='col-sm-2'>
                              <input type="text" size="6" value={this.state.duration_more} onChange={this.logMaxDuration}/>
                            </div>
                            <div className='col-sm-3'>
                              <h7> minutes </h7>
                            </div>
                         </div>
                        </div>

                  </div>

                  <div className='col-sm-8'>
                  <br/>
                    <DateRange
                      linkedCalendars={ true }
                      ranges={ defaultRanges }
                      onChange={ this.handleSelect }
                      theme={{
                        DateRange      : {
                          background   : '#ffffff'
                        },
                        Calendar       : {
                          background   : 'transparent',
                          color        : '#95a5a6',
                        },
                        MonthAndYear   : {
                          background   : '#A9A9A9',
                          color        : '#2F4F4F'
                        },
                        MonthButton    : {
                          background   : '#c0392b'
                        },
                        MonthArrowPrev : {
                          borderRightColor : '#d96659',
                        },
                        MonthArrowNext : {
                          borderLeftColor : '#d96659',
                        },
                        Weekday        : {
                          background   : '#A9A9A9',
                          color        : '#2F4F4F'
                        },
                        Day            : {
                          transition   : 'transform .1s ease, box-shadow .1s ease, background .1s ease'
                        },
                        DaySelected    : {
                          background   : '#8e44ad'
                        },
                        DayActive    : {
                          background   : '#8e44ad',
                          boxShadow    : 'none'
                        },
                        DayInRange     : {
                          background   : '#9b59b6',
                          color        : '#fff'
                        },
                        DayHover       : {
                          background   : '#ffffff',
                          color        : '#7f8c8d',
                          transform    : 'scale(1.1) translateY(-10%)',
                          boxShadow    : '0 2px 4px rgba(0, 0, 0, 0.4)'
                        }
                      }}
                   />
                  </div>
                </div>
              </div>
          )
          }
        };

    return (
     <div className = 'row'>
      <div className = 'row'>
        <div className='col-sm-offset-8 col-sm-4 col-centered'>
            <PropagateLoader
                    color={'#123abc'} 
                    size={20}
                    loading={this.state.loading} 
                  />
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
              <Button onClick={() => {this.onClickSearch()}}>
                  Search
              </Button>
            </div>
          </div>
        </div>


      </div>

        <div className = 'row'>
          <br/>
              {moreFilterOptions()}
    </div>
     </div>
    );
  }
}


// export default feedbackContainer;