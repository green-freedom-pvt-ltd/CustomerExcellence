import React, { Component } from 'react';
import { Pagination, Table,Checkbox , Button, Modal} from 'react-bootstrap';
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
      showDistanceModal: false,
      showFlagModal: false,
      loading: true,
      is_flag: false,
      fetchUrl: 'http://localhost:8000/api/ced/runs/',
      fetchLocationUrl: 'http://dev.impactrun.com/api/ced/runLocations/',
      fetchPositionUrl: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=19.21193940000,72.97623070000&sensor=true'
    }
    if (path[2]) {
       this.state.fetchUrl+= '?run_id=' + path[2]
       this.state.fetchLocationUrl+= path[2] +'/'
      // console.log("inside feedback fetchUrl", this.state.fetchUrl);
    }
    this.handleChange = this.handleChange.bind(this);

  }


  handleChange(event) {
    this.setState({added_distance: event.target.value});
  }

  componentWillMount() {
    this.fetchRunDetails(this.state.fetchUrl);
    this.fetchRunLocation(this.state.fetchLocationUrl);
    // this.fetchMapLocation(this.state.fetchPositionUrl);
  }

  // fetchMapLocation(path) {
  //   console.log('this.state.data.runDetails.results[0].start_location_lat----',this.state.data);
  //   fetch(path, {
  //     method: 'GET'
  //   })
  //     .then((response) => response.json())
  //     .then((responseJson) => {
  //       this.setState({
  //         position: responseJson,

  //       });
  //       console.log('inside run location detail ', this.state.position);
  //     })
  //     .catch((error) => {
  //      console.error(error);
  //       // window.location = "/logout";
  //     });
  //   }


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
          is_flag: responseJson.results[0].is_flag,
          current_distance: responseJson.results[0].distance,
          current_amount: responseJson.results[0].run_amount,

        });
        var location_path = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+this.state.data.results[0].start_location_lat+','+this.state.data.results[0].start_location_long+'&sensor=true'
        fetch(location_path, {
          method: 'GET'
        })
          .then((response) => response.json())
          .then((responseJson) => {
            this.setState({
              position: responseJson,

            });
            // console.log('inside run location detail ', this.state.is_flag);
          })
          .catch((error) => {
           console.error(error);
            // window.location = "/logout";
          });


        // console.log('inside run detail ', this.state.data);
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
        // console.log('inside run location detail ', this.state.runLocation);
      })
      .catch((error) => {
       console.error(error);
        // window.location = "/logout";
      });
    }      

 loadMap() {
  if(this.state.runLocation){
        return (<Map location={this.state.runLocation} />);
        } else {
        return (
          <div className='col-xs-12'>
              No location data
          </div>);
        }
  }

  updateRun() {
    
    var run_details = this.state.data.results[0];
    var path = "http://localhost:8000/api/ced/runupdate/" + run_details.run_id+'/'
    const formData = new FormData();
    var new_distance = (this.state.added_distance*1) + this.state.current_distance
    var new_amount = (this.state.added_distance*10) + this.state.current_amount
    console.log("return put saved for ",new_distance,new_amount);
    formData.append('user_id', run_details.user_id);
    formData.append('start_time', run_details.start_time);
    formData.append('run_amount', new_amount);
    formData.append('run_duration', run_details.run_duration);
    formData.append('avg_speed', run_details.avg_speed);
    formData.append('distance', new_distance);
    // formData.append('is_flag', !run_details.is_flag);
    console.log('inside put top run',formData);
    this.setState({ showModal: false })
    return fetch(path, {
      method: 'PUT',
      body: formData,
     
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('inside put run', responseJson);
        // window.location = "/feedback";
        window.location.reload();

      })
      .catch((error) => {
        console.error(error);
      });
  }



  flagRun() {
    var run_details = this.state.data.results[0];
    
    var path = "http://localhost:8000/api/ced/runupdate/" + run_details.run_id+'/'
    const formData = new FormData();
    
    console.log("return put saved for ",path);
    formData.append('user_id', run_details.user_id);
    formData.append('start_time', run_details.start_time);
    formData.append('run_amount', run_details.run_amount);
    formData.append('run_duration', run_details.run_duration);
    formData.append('avg_speed', run_details.avg_speed);
    formData.append('distance', run_details.distance);
    formData.append('is_flag', !run_details.is_flag);
    console.log('inside put top run',formData);
    this.setState({ showModal: false })
    return fetch(path, {
      method: 'PUT',
      body: formData,
     
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('inside put run', responseJson);
        // window.location = "/feedback";
        window.location.reload();

      })
      .catch((error) => {
        console.error(error);
      });
  }



  render() {
        var runDetails = this.state.data;
        // if(runDetails){
        // console.log("runDetails-----------------------",runDetails.results[0]);
        // }

        var detailSection = () =>{
          if(runDetails){
            // console.log("runDetails-----------------------",runDetails.results[0]);
            return (
              <div className='row box-top-left'>
                <div className='col-xs-12'>
                  <div className='row'>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>User Id</th>
                          <th>Start Time</th>
                          <th>Distance</th>
                          <th>Duration</th>
                          <th>Cause</th>
                          <th>Steps</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{runDetails.results[0].user_id}</td>
                          <td>{runDetails.results[0].start_time}</td>
                          <td>{Math.round(runDetails.results[0].distance*100) / 100} km</td>
                          <td>{runDetails.results[0].run_duration}</td>
                          <td>{runDetails.results[0].cause_run_title}</td>
                          <td>{runDetails.results[0].no_of_steps}</td>
                        </tr>
                      </tbody>
                    </Table>            
                  </div>
                  <div className='row'>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Location</th>
                          <th>Is Flagged</th>
                          <th>Device</th>
                          <th>Speed</th>
                          <th>Raised</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{ this.state.position ? this.state.position.results[0].formatted_address :"No data"}</td>
                          <td>{runDetails.results[0].is_flag ? "Yes" : "No"}</td>
                          <td>{runDetails.results[0].is_ios ? "iOS" : "android"}</td>
                          <td>{Math.round(runDetails.results[0].avg_speed*100) / 100} km/s</td>
                          <td>{runDetails.results[0].run_amount}</td>
                        </tr>
                      </tbody>
                    </Table>            
                  </div>
                  <div className='row'>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Run Id</th>
                          <th>Client Run Id</th>
                          <th>End Time</th>
                          <th>Spikes</th>
                          <th>Calories</th>
                          <th>Team Id</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{runDetails.results[0].run_id}</td>
                          <td>{runDetails.results[0].client_run_id}</td>
                          <td>{runDetails.results[0].end_time}</td>
                          <td>{runDetails.results[0].num_spikes}</td>
                          <td>{Math.round(runDetails.results[0].calories_burnt)}</td>
                          <td>{runDetails.results[0].team_id}</td>
                        </tr>
                      </tbody>
                    </Table>            
                  </div>
                </div>
                
              </div>
              )
          } else {
            return (
              <div>
                No data
              </div>

              )
          }
        };


    // TODO: logic for calculating the distance between all lat long and adding individial distances
    

    //     var finalData = [];
    //     var finalDataObject = {};
    //     var last_location = null;

    //     function getLocation(state) {

    //         function combineBatch(n) {
    //             var location = {
    //                 position: {
    //                     lat: n.lat,
    //                     lng: n.lon
    //                 }

    //             }
    //             return location;
    //         }
    //         // finalData = _.concat(finalData,_.map(state.location_array, combineBatch));
    //         finalData = _.map(state.location_array, combineBatch);
    //         var paused_data = [];
    //         var paused_data_object = {};
    //         finalDataObject = { finalData: _.reverse(finalData) };
    //         // console.log('paused_data',paused_data);
    //         // console.log("Final Data",finalData.length,finalDataObject);
    //         if (last_location) {
    //             if (_.first(finalData)) {
    //                 paused_data = [last_location, _.first(finalData)]
    //             } else {
    //                 paused_data = [last_location, last_location]
    //             }
    //             paused_data_object = { finalData: paused_data };
    //             console.log('paused_data', paused_data, paused_data_object);
    //         } else {
    //             paused_data = [_.first(finalData), _.first(finalData)]
    //             paused_data_object = { finalData: paused_data };
    //         }
    //         last_location = _.last(finalData);
    //         finalDataObject = _.concat(finalDataObject, paused_data_object);
    //         //  concat paused_data
    //         return finalDataObject;

    //     }
    //     if (this.state.runLocation){
    //       console.log("DATA", this.state.runLocation);
    //       var state = this.state.runLocation.results;
    //       finalData = _.map(state, getLocation);
    //       finalData = _.remove(finalData, function (n) {
    //           return n[0].finalData.length > 0;
    //       });
    //       console.log("Final Dataaaaaaaaaaaa", finalData[0][0]);
          

    //       var totalLength = _.map(finalData[0][0].finalData, addDistance);

    //     }

    //   function addDistance(location) {

    //       var distance = calculateDistance(location.position)
          
    //         return dist
    //     }


    //   function calculateDistance(lat1, lon1, lat2, lon2, unit) {

    //         var radlat1 = Math.PI * lat1/180
    //         var radlat2 = Math.PI * lat2/180
    //         var radlon1 = Math.PI * lon1/180
    //         var radlon2 = Math.PI * lon2/180
    //         var theta = lon1-lon2
    //         var radtheta = Math.PI * theta/180
    //         var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    //         dist = Math.acos(dist)
    //         dist = dist * 180/Math.PI
    //         dist = dist * 60 * 1.1515
    //         if (unit=="K") { dist = dist * 1.609344 }
    //         if (unit=="N") { dist = dist * 0.8684 }
    //         return dist
    //     }



    // function getLocation(state) {

    //         function combineBatch(n) {
    //             var location = {
    //                 position: {
    //                     lat: n.lat,
    //                     lng: n.lon
    //                 }

    //             }
    //             return location;
    //         }
    //         // finalData = _.concat(finalData,_.map(state.location_array, combineBatch));
    //         finalData = _.map(state.location_array, combineBatch);
    //         var paused_data = [];
    //         var paused_data_object = {};
    //         finalDataObject = { finalData: _.reverse(finalData) };
    //         // console.log('paused_data',paused_data);
    //         // console.log("Final Data",finalData.length,finalDataObject);
    //         if (last_location) {
    //             if (_.first(finalData)) {
    //                 paused_data = [last_location, _.first(finalData)]
    //             } else {
    //                 paused_data = [last_location, last_location]
    //             }
    //             paused_data_object = { finalData: paused_data };
    //             console.log('paused_data', paused_data, paused_data_object);
    //         } else {
    //             paused_data = [_.first(finalData), _.first(finalData)]
    //             paused_data_object = { finalData: paused_data };
    //         }
    //         last_location = _.last(finalData);
    //         finalDataObject = _.concat(finalDataObject, paused_data_object);
    //         //  concat paused_data
    //         return finalDataObject;

    //     }

  	// var mapSection = () =>{
   //    if(this.state.runLocation){
   //      return (
   //          <div className='col-xs-12'>
   //            <Map location={this.state.runLocation} />
   //          </div>
   //        )
   //      } else {
   //        <div className='col-xs-12'>
   //            No location data
   //        </div>
   //      }
  	// };


    return (
      <div>
        <div className='row'>
        <div className='col-sm-offset-4 col-xs-2'>
           <Button
            bsStyle="default"
            bsSize="large"
            onClick={() => this.setState({ showDistanceModal: true })}>
            Update Distance
          </Button>
          <Modal show={this.state.showDistanceModal} onHide={() => this.setState({ showDistanceModal: false })}>
              <Modal.Header closeButton>
                <Modal.Title> Flagging Run</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <div className='row'>
                <div className='col-sm-6'>
                  Increase distance by 
                </div>
                <div className='col-sm-6'>
                  <input type="text" value={this.state.added_distance} onChange={this.handleChange} name="my-input-field"/>
                </div>
                <div className='col-sm-6'>
                  Updated distance -  
                </div>
                <div className='col-sm-6'>
                  {(this.state.added_distance*1) + this.state.current_distance}
                </div>
                <div className='col-sm-6'>
                  Updated amount 
                </div>
                <div className='col-sm-6'>
                  {(this.state.added_distance*10) + this.state.current_amount}
                </div>
              </div>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={() => this.updateRun()}>Update</Button>
                <Button onClick={() => this.setState({ showDistanceModal: false })}>Cancle</Button>
              </Modal.Footer>
            </Modal>
        </div>
        <div className='col-xs-2'>
           <Button
            bsStyle="default"
            bsSize="large"
            onClick={() => this.setState({ showFlagModal: true })}>
            {this.state.is_flag ? 'Unflag Run': 'Flag Run'}
          </Button>
          <Modal show={this.state.showFlagModal} onHide={() => this.setState({ showFlagModal: false })}>
              <Modal.Header closeButton>
                <Modal.Title> Flagging Run</Modal.Title>
              </Modal.Header>
              <Modal.Body>
               <tr >
                <td>
                Are you sure you want to {this.state.is_flag ? "unflag" : "flag" } this run ?
                </td>
              </tr>

              </Modal.Body>
              <Modal.Footer>
                <Button onClick={() => this.flagRun()}>Yes</Button>
                <Button onClick={() => this.setState({ showFlagModal: false })}>No</Button>
              </Modal.Footer>
            </Modal>
          </div>
        	<div className="col-sm-12">
            <div style={{  width: "100%",marginTop: "10px" }}>
              <div style={{ width: "100%", height: "350px"}}>
                {this.loadMap()}
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className="col-sm-12">
            <br/>
            <div style={{  marginLeft: "10px", width: "100%", height: "100%"}}>
              {detailSection()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}


// export default feedbackContainer;