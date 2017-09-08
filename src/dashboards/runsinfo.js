import React, {Component} from 'react';
import { Button, Grid, Row, Col, Table, FormControl,Form, FormGroup,ControlLabel } from 'react-bootstrap';
import {BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import './info.css';

class SimpleLineChart extends Component{
	render () {
		console.log('----------------inside run info');
		var data = [
		      {name: '7 Sept', Rupees: 4000, pv: 2400, amt: 2400},
		      {name: '6 Sept', Rupees: 3000, pv: 1398, amt: 2210},
		      {name: '5 Sept', Rupees: 2000, pv: 9800, amt: 2290},
		      {name: '4 Sept', Rupees: 2780, pv: 3908, amt: 2000},
		      {name: '3 Sept', Rupees: 1890, pv: 4800, amt: 2181},
		      {name: '2 Sept', Rupees: 2390, pv: 3800, amt: 2500},
		      {name: '1 Sept', Rupees: 3490, pv: 4300, amt: 2100},
		     
				];

  	return (
    	<BarChart width={900} height={500} data={data}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
	       <XAxis dataKey="name"/>
	       <YAxis/>
	       <CartesianGrid strokeDasharray="3 3"/>
	       <Tooltip/>
	       <Legend />
	       <Bar dataKey="Rupees" fill="#82ca9d" />
      </BarChart>
    );
  }
}





export default class RunInfo extends Component{
  render() {
      return (
      	<div>
      		<h1> Graph POC </h1>
        	<SimpleLineChart />
      	</div>
      );
  }
}

