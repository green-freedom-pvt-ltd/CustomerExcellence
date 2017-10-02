import React, {Component} from 'react';
import { Button, Grid, Row, Col, Table, FormControl,Form, FormGroup,ControlLabel } from 'react-bootstrap';
import {BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import './info.css';
import _ from "lodash";


export default class Dashboard extends Component{
	
	constructor(props) {
    console.log("inside runsinfo container", props);
    super(props);
      this.state = {
      loading:false,
      data: null,
      // fetchUrl:'http://dev.impactrun.com/api/statistics/?start_date=2017-09-01+21:00:59&end_date=2017-09-28+21:00:59&cause_id=5&team_id=122',
      fetchUrl:'http://dev.impactrun.com/api/statistics/?start_date=2017-09-21T05:30:00&end_date=2017-09-28T05:30:00',
    }
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
      	console.log('data_results-----------------',data_results);
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
      		final_data.push({event_date:event_date,total_distance:total_distance,total_duration:total_duration,total_steps:total_steps })
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
      		<div className="col-sm-6">
	      		<h1> total_distance </h1>
	        	<BarChart width={400} height={200} data={this.state.data}
		            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
			       <XAxis dataKey="event_date"/>
			       <YAxis/>
			       <CartesianGrid strokeDasharray="3 3"/>
			       <Tooltip/>
			       <Legend />
			       <Bar dataKey="total_distance" fill="#82ca9d" />
	      		</BarChart>
	      	</div>
	      	<div className="col-sm-6">
	      		<h1> total_duration </h1>
	        	<BarChart width={400} height={200} data={this.state.data}
		            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
			       <XAxis dataKey="event_date"/>
			       <YAxis/>
			       <CartesianGrid strokeDasharray="3 3"/>
			       <Tooltip/>
			       <Legend />
			       <Bar dataKey="total_duration" fill="#FF5733" />
	      		</BarChart>
	      	</div>
	      	<div className="col-sm-6">
	      		<h1> total_steps </h1>
	        	<BarChart width={400} height={200} data={this.state.data}
		            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
			       <XAxis dataKey="event_date"/>
			       <YAxis/>
			       <CartesianGrid strokeDasharray="3 3"/>
			       <Tooltip/>
			       <Legend />
			       <Bar dataKey="total_steps" fill="#3D55FF" />
	      		</BarChart>
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