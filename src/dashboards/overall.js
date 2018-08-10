import React, {Component} from 'react';
import { Button, Grid, Row, Col, Table, FormControl,Form, FormGroup,ControlLabel } from 'react-bootstrap';
import {BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import './info.css';
import _ from "lodash";
import {defaultRanges, Calendar, DateRange } from 'react-date-range';
import moment from 'moment';
import {RingLoader, ClimbingBoxLoader} from 'react-spinners';
const leaguecausedata = require('./leaguecausedata.js');



export default class Overall extends Component{
	
	constructor(props) {
    // // console.log("inside runsinfo container", props);
    super(props);
      this.state = {
      loading:true,
      data: null,
      overall: null,
      leagues: null,
      causes: null,
      y_axis:'total_distance',
      date:null,
      // fetchUrl:'http://dev.impactrun.com/api/statistics/?start_date=2017-09-01+21:00:59&end_date=2017-09-28+21:00:59&cause_id=5&team_id=122',
      fetchUrl:'http://dev.impactrun.com/api/statistics/?start_date=2017-09-21T05:30:00&end_date=2017-09-28T05:30:00',
      fetchShortUrl:'http://dev.impactrun.com/api/statistics/',
      overall_data:[],
    }
    this.handleSelect = this.handleSelect.bind(this);
    this.fetchNewData = this.fetchNewData.bind(this);
    this.reloadData = this.reloadData.bind(this);
  }

  	handleSelect(date){
        // this.fetchNewData(date);
        this.setState({
          date: date
        });
    	// console.log(date);

        // // return console.log('inside date change',this.fetchNewData(date));

    }

    reloadData(){
    	// console.log('reload---------------------');
    	 this.setState({
         loading:true
        });
    	this.fetchNewData([]);
    }

    fetchNewData(final_data,next_url){
    	var date = this.state.date;
    	var startTime = moment(date.startDate);
        var endTime = moment(date.endDate);

        var start_date_query = startTime.year() + "-" + (startTime.month() + 1) + "-" + startTime.date()
        var end_date_query = endTime.year() + "-" + (endTime.month() + 1) + "-" + endTime.date()
    	var url_date = '?start_date='+ start_date_query +'T05:30:00'+ '&end_date=' + end_date_query +'T05:30:00';
        // console.log('inside fetchNewData', date, url_date ); // Momentjs object 
        var final_fetch_url = this.state.fetchShortUrl + url_date
        if(next_url){
        	final_fetch_url = next_url;
        }

	    return fetch(final_fetch_url, {
	      method: 'GET',
	      headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json',
	        'Authorization': 'Basic bmlra2k6Z3JlZW5mcmVlZG9tIQ=='
	      }
	    })
	      .then((response) => response.json())
	      .then((responseJson) => {
	      	if(responseJson.next){
	      		next_url=responseJson.next;
	      	} else {
	      		if (responseJson.previous){
	      			next_url=null;
	      		}
	      	}
	      	var data_results = responseJson.results;
	      	var final_data = [];
	        var days = this.state.date.endDate.diff(this.state.date.startDate,'days') + 1;
    		var state_date  = this.state.date;
    		let startTime = moment(state_date.startDate);

	        
	        for (var i = 0; i < days; i++) {

	      		var event_date ;
	      		var event_date_query = startTime
	      		if (i>0){
	      		event_date_query = startTime.add(1,'days');
	      		}
				// var start_date_query = event_date_query.year() + "-" + (event_date_query.month() + 1) + "-" + event_date_query.date()
				event_date = event_date_query.format("YYYY-MM-DD") + 'T05:30:00';
		        // console.log('inside fetch ',i ,startTime.format("YYYY-MM-DD"), event_date);
	      		var data_set = _.filter(data_results,function(num){ return num.event_date == event_date});
	      		// if(data_set.length >0){
	      			// console.log('data_set --------------------------------',data_set);
		      		var total_distance = _.reduce(data_set, function(memo, num){ return memo + parseFloat(num.total_distance); }, 0);
		      		var total_duration = _.reduce(data_set, function(memo, num){ return memo + parseFloat(num.total_duration); }, 0);
			        var total_steps = _.reduce(data_set, function(memo, num){ return memo + parseFloat(num.total_steps); }, 0);
			        var total_amount = _.reduce(data_set, function(memo, num){ return memo + parseFloat(num.total_amount); }, 0);
			        var run_count = _.reduce(data_set, function(memo, num){ return memo + parseFloat(num.run_count); }, 0);
			        var total_spikes = _.reduce(data_set, function(memo, num){ return memo + parseFloat(num.total_spikes); }, 0);
		      		var user_count = _.reduce(data_set, function(memo, num){ return memo + parseFloat(num.user_count); }, 0);
		      		
		      		final_data.push(
		            {event_date:event_date,
		              total_distance:total_distance,
		              total_duration:total_duration,
		              total_steps:total_steps,
		              total_amount:total_amount,
		              run_count:run_count,
		              total_spikes:total_spikes,
		              user_count:user_count,
		               });
	      		// }
	      	}
      		// var overall_data = this.state.overall_data;
      		// overall_data=overall_data.push(final_data);
	      	// console.log('overall_data-------------------------',overall_data);
	        this.setState({
	          data: final_data,
	          loading:false,
	          // overall_data:overall_data
	        });
	        if(next_url){
	        	this.setState({
		         loading:true
		        });
		        this.fetchNewData(final_data,next_url);
	        }

	      })
	      .catch((error) => {
	        // console.error(error);
	      });
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
      	var data_results = responseJson.results;
      	// // console.log('data_results-----------------',leaguecausedata);
      	var final_data = [];
		var aggregate_data = {
			total_distance: 0,
			total_duration: 0,
			total_steps: 0,
			total_amount: 0,
			run_count: 0,
			total_spikes: 0,
			user_count: 0,
		}
      	for (var i = 7; i >= 1; i--) {
      		var event_date ;
      		event_date = '2017-09-2' + i+ 'T05:30:00';

      		var data_set = _.filter(data_results,function(num){ return num.event_date == event_date});

      		var total_distance = _.reduce(data_set, function(memo, num){ return memo + parseFloat(num.total_distance); }, 0);
      		var total_duration = _.reduce(data_set, function(memo, num){ return memo + parseFloat(num.total_duration); }, 0);
	        var total_steps = _.reduce(data_set, function(memo, num){ return memo + parseFloat(num.total_steps); }, 0);
	        var total_amount = _.reduce(data_set, function(memo, num){ return memo + parseFloat(num.total_amount); }, 0);
	        var run_count = _.reduce(data_set, function(memo, num){ return memo + parseFloat(num.run_count); }, 0);
	        var total_spikes = _.reduce(data_set, function(memo, num){ return memo + parseFloat(num.total_spikes); }, 0);
      		var user_count = _.reduce(data_set, function(memo, num){ return memo + parseFloat(num.user_count); }, 0);
      		final_data.push(
            {event_date:event_date,
              total_distance:total_distance,
              total_duration:total_duration,
              total_steps:total_steps,
              total_amount:total_amount,
              run_count:run_count,
              total_spikes:total_spikes,
              user_count:user_count,
               })
      	}
        this.setState({
          data: final_data,
          loading:false
        });
      })
      .catch((error) => {
        // console.error(error);
      });
  }

  render() {
  	var wellStyles = {maxWidth: 500, margin: '0 auto 10px'};
  	if (true){
      return (
      	<div className="row">
      		<div className="row">
	      		<div className="col-sm-8">

			     	<h1> Range filter </h1>
			     	<div>
	                <DateRange
			            linkedCalendars={ true }
			            ranges={ defaultRanges }
			            onInit={ this.handleSelect }
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
      		
      		<div className="row">
	      		<div className="col-sm-8">
		      		<h1> Overall </h1>
		        	<BarChart width={600} height={400} data={this.state.data}
			            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
				       <XAxis dataKey="event_date"/>
				       <YAxis/>
				       <CartesianGrid strokeDasharray="3 3"/>
				       <Tooltip/>
				       <Legend />
				       <Bar dataKey={this.state.y_axis} fill="#8884d8" />
		      		</BarChart>
		      	</div>
		      	<div className="col-sm-4">
      				<div className="row">
      					<div className="col-sm-12">
							<Button onClick={() => this.reloadData()} bsSize="large" block>
			                      Reload
			                </Button>
		      			</div>
						<div className="col-sm-12">
				      		<Button onClick={() => this.setState({y_axis:'total_distance'})}>
			                      Distance
			                  </Button>
			                  <Button onClick={() => this.setState({y_axis:'total_steps'})}>
			                      Steps
			                  </Button>
			                  <Button onClick={() => this.setState({y_axis:'total_duration'})}>
			                      Duration
			                  </Button>
			                  <Button onClick={() => this.setState({y_axis:'total_amount'})}>
			                      Total Amount
			                  </Button>
			                  <Button onClick={() => this.setState({y_axis:'run_count'})}>
			                      Run Count
			                  </Button>
			                  <Button onClick={() => this.setState({y_axis:'total_spikes'})}>
			                      Total Spikes
			                  </Button>
			                  <Button onClick={() => this.setState({y_axis:'user_count'})}>
			                      User Count
			                  </Button>
		      			</div>
		      			<div className="col-sm-6" >
							 <ClimbingBoxLoader
						          color={'#123abc'} 
						          size={20}
						          loading={this.state.loading} 
						        />
		      			</div>
		      		</div>
		      	</div>
		     </div>
      	</div>
      );
 	 } else {
 	 	  return (
      	<div>
      		<h1> Loding Data </h1>
      		 <div className="row">
		        <RingLoader
		          color={'#123abc'} 
		          loading={this.state.loading} 
		        />
		    </div>  
      	</div>
      	);
  	}
  }
}