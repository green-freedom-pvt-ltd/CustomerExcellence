import React, {Component} from 'react';
import { Button, Grid, Row, Col, Table, FormControl,Form, FormGroup,ControlLabel } from 'react-bootstrap';
import {BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import './info.css';
import _ from "lodash";
import Overall from './overall'

export default class Dashboard extends Component{
	
  render() {
 	 	  return (
      	<div>
      		<Overall/>
      	</div>
      	);
    }
}