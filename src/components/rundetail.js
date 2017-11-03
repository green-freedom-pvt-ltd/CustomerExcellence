import React, { Component } from 'react';
import { Pagination, Table,Checkbox , Button} from 'react-bootstrap';
import {
  Link
} from 'react-router-dom';
import RunFilter from "./reusable/runFilter"
import RunModal from "./reusable/runModal"
import {RingLoader, PropagateLoader} from 'react-spinners';
import Cookies from 'universal-cookie';
import _ from "lodash";
import Map from "./map.js";

const cookies = new Cookies();


export default class RunDetail extends Component {
  constructor(props) {
  	var path = window.location.pathname;
    path = path.split("/");
    // console.log("inside feedback container", props);
    super(props);
    this.state = {
      data: null,
      loading: true,
      activePage: 1,
      nextPage: '',
      prevPage: '',
      childVisible: false,
      count: 0,
      fetchUrl: 'http://localhost:8000/api/ced/runs/',
      fetchLocationUrl: 'http://dev.impactrun.com/api/ced/runLocations/'
    }
    if (path[2]) {
       this.state.fetchUrl+= '?run_id=' + path[2]
       this.state.fetchLocationUrl+= path[2] +'/'
      // console.log("inside feedback fetchUrl", this.state.fetchUrl);
    }
  }



  componentWillMount() {
    this.fetchRunDetails(this.state.fetchUrl);
    this.fetchRunLocation(this.state.fetchLocationUrl);
  }

  fetchRunDetails(path) {
    fetch(path, {
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

        });
        console.log('inside run detail ', this.state.data);
      })
      .catch((error) => {
       console.error(error);
        // window.location = "/logout";
      });
  		}


  fetchRunLocation(path) {
    fetch(path, {
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
          runLocation: responseJson,

        });
        console.log('inside run location detail ', this.state.runLocation);
      })
      .catch((error) => {
       console.error(error);
        // window.location = "/logout";
      });
      }      

 loadMap() {
  if(this.state.runLocation){
        return <Map location={this.state.runLocation} />
        } else {
          <div className='col-xs-12'>
              No location data
          </div>
        }
  }

  render() {

  	var mapSection = () =>{
      if(this.state.runLocation){
        return (
            <div className='col-xs-12'>
              <Map location={this.state.runLocation} />
            </div>
          )
        } else {
          <div className='col-xs-12'>
              No location data
          </div>
        }
  	};

  	var detailSection = () =>{
  		return (
  			<div className='col-xs-12'>
	        	Run detail for {this.state.data}
	        </div>
  			)
  	};


    return (
      <div>
        <div className='row'>
        	<div className="col-sm-12">
            <div style={{  width: "100%" }}>
              <div style={{ width: "100%", height: "300px"}}>
                {this.loadMap()}
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
            {detailSection()}
        </div>
      </div>
    );
  }
}


// export default feedbackContainer;