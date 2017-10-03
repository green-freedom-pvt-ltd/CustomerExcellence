import React, {Component} from 'react';
import { Button, Grid, Row, Col, Table, FormControl,Form, FormGroup,ControlLabel } from 'react-bootstrap';
import {BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import './info.css';
import _ from "lodash";
import {defaultRanges, Calendar, DateRange } from 'react-date-range';


const leaguecausedata = require('./leaguecausedata.js');



export default class Overall extends Component{
	
	constructor(props) {
    console.log("inside runsinfo container", props);
    super(props);
      this.state = {
      loading:false,
      data: null,
      overall: null,
      leagues: null,
      causes: null,
      y_axis:'total_distance',
      // fetchUrl:'http://dev.impactrun.com/api/statistics/?start_date=2017-09-01+21:00:59&end_date=2017-09-28+21:00:59&cause_id=5&team_id=122',
      fetchUrl:'http://dev.impactrun.com/api/statistics/?start_date=2017-09-21T05:30:00&end_date=2017-09-28T05:30:00',
    }
  }

	  handleSelect(date){
	        console.log(date); // Momentjs object 
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
      	console.log('data_results-----------------',leaguecausedata);
      	// console.log(_.filter(data_results,{event_date:'2017-09-01T05:30:00'}));
      	// console.log("2017-09-01T05:30:00" ,_.filter(data_results,function(num){ return num.event_date == '2017-09-01T05:30:00'}));
      	// console.log("2017-09-02T05:30:00" ,_.filter(data_results,function(num){ return num.event_date == '2017-09-02T05:30:00'}));
      	// var unique_dates = _uniq(data_results, (num) => {return })
      	var final_data = [];
      	
      	for (var i = 7; i >= 1; i--) {
      		var event_date 
      			event_date = '2017-09-2' + i+ 'T05:30:00';
      		// if(i<10){
      		// 	event_date = '2017-09-0' + i+ 'T05:30:00';
      		// } else {
      		// 	event_date = '2017-09-' + i+ 'T05:30:00';
      		// }
      		// var end_date = '2017-09-' + i+ 'T05:30:00';
      		var data_set = _.filter(data_results,function(num){ return num.event_date == event_date});
      		// console.log('data_set------------',event_date, data_set);
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
      	console.log('data_set------------',final_data);
        this.setState({
          data: final_data,
          loading:true

        });
        console.log('inside componentWillMount runsinfo',this.state.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
  	if (this.state.data){
      return (
      	<div className="row">
      		<div className="row">
      		</div>
      		<div className="row">
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
		     </div>
      	</div>
      );
 	 } else {
 	 	  return (
      	<div>
      		<h1> Graph POC </h1>
      	</div>
      	);
  	}
  }
}