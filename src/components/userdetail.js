import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import Map from "./map.js";
import { Pagination } from 'react-bootstrap';
import Feedback from './feedback';

export default class UserDetail extends Component {
  constructor(props) {
    super(props);
    var path = window.location.pathname;
    path = path.split("/");
    path = path[2];
    this.state = {
      user_id: path,
      userRun: null,
      runLocation: "",
      activePage: 1,
      activeItem: '',
      id: '',
    }
    this.Viewruns = this.Viewruns.bind(this);
    this.handleSelect = this.handleSelect.bind(this);

    // searchedItem = window.location.search;       
  }
  componentWillMount() {
    this.fetchRuns('http://dev.impactrun.com/api/ced/runs/?user_id=' + this.state.user_id);
  }
  componentDidMount() {
    fetch('http://dev.impactrun.com/api/ced/users/' + this.state.user_id + '/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic bmlra2k6Z3JlZW5mcmVlZG9tIQ=='
      }
    })
      .then((Response) => Response.json())
      .then((responseJson) => {

        this.setState({
          data: responseJson,

        })
        console.log(this.state.data);


      });



  }


  fetchRuns(path) {
    fetch(path, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic bmlra2k6Z3JlZW5mcmVlZG9tIQ=='
      }
    })
      .then((Response) => Response.json())
      .then((responseJson) => {
        console.log("PREV", responseJson)
        this.setState({
          userRun: responseJson,
          prevPage: responseJson.previous,
          userPath: this.state.nextPage,
          nextPage: responseJson.next,

        })
        console.log("user run", this.state.userRun);

      });
  }

  Viewruns() {

    if (this.state.userRun === null) {
      return;
    }
    else {
      if (this.state.prevPage === null) {
        this.state.pageCount = Math.ceil(this.state.userRun.count / this.state.userRun.results.length);
      }
      if (this.state.userRun != null) {

        if (this.state.userRun.results.length < 1) {
          return <tr><td colSpan="6" style={{textAlign:"center"}}>No Record Found..!!</td></tr>

        }
        else {
          var runList = this.state.userRun.results.map((item, index) => {
            var color = (this.state.id === item.run_id) ? 'active-item' : '';
            let startTime = this.getTime(item.start_time)
            let totalDistance = parseFloat(item.distance).toFixed(2);
            return (

              // <li key={index}>{item.run_id}</li>
              <tr className={color} style={{ cursor: "pointer" }} key={index} onClick={() => this.loadLocation(item, item.run_id)}>
                <td>{startTime}</td>
                <td>{item.cause_run_title}</td>
                <td>{totalDistance}km</td>
                <td>&#8377; {item.run_amount}</td>
                <td>{parseFloat(item.calories_burnt).toFixed(2)}</td>
                <td>{item.run_duration}</td>

              </tr>
            )
          })
        }

      } else {
        runList;
      }

      return runList;

    }
  }

  getTime(time) {
    var Date1 = new Date(time)
    Date1 = Date1.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    return Date1;
  }

  loadLocation(item, itemId) {

    fetch('http://dev.impactrun.com/api/ced/runLocations/' + item.run_id + '/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic bmlra2k6Z3JlZW5mcmVlZG9tIQ=='
      }
    })
      .then((Response) => {

        return Response.json()
      })
      .then((responseJson) => {
        let startEpochTime = new Date(item.start_time_epoch);
        let endEpochTime = new Date(item.end_time_epoch);
        this.setState({
          runLocation: responseJson,
          runInform: item,
          run_id: item.run_id,
          client_run_id: item.client_run_id,
          version: item.version,
          user_id: item.user_id,
          num_spike: item.num_spikes,
          steps: item.no_of_steps,
          activeItem: (itemId === item.run_id) ? '' : '',
          id: item.run_id,
          app_version: item.app_version,
          cause_run_title: item.cause_run_title,
          device_name: item.device_name,
          distance: item.distance,
          run_amount: item.run_amount,
          run_duration: item.run_duration,
          avg_speed: item.avg_speed,
          calories_burnt: item.calories_burnt,
          device_id: item.device_id,
          cause_id: item.cause_id,
          is_flag: item.is_flag,
          is_ios: item.is_ios,
          start_location_lat: item.start_location_lat,
          start_location_long: item.start_location_long,
          start_time: item.start_time,
          start_time_epoch: startEpochTime.toUTCString(),
          end_location_lat: item.end_location_lat,
          end_location_long: item.end_location_long,
          end_time: item.end_time,
          end_time_epoch: endEpochTime.toUTCString(),
          num_updates: item.num_updates,
          os_version: item.os_version,
          peak_speed: item.peak_speed,
          team_id: item.team_id


        })
        this.Viewruns();
      });

  }
  handleSelect(eventKey) {
    console.log("Current Page", eventKey)

    console.log("Prev Page", this.state.prevPage)
    if (this.state.activePage + 1 === eventKey) {
      this.fetchRuns(this.state.nextPage);
    }
    else if (this.state.activePage - 1 === eventKey) {
      this.fetchRuns(this.state.prevPage);
    }
    else {
      let runPath = "http://dev.impactrun.com/api/ced/runs/?page=" + eventKey + "&user_id=" + this.state.user_id
      console.log("Run Path", runPath);
      this.fetchRuns(runPath);
    }
    this.setState({
      activePage: eventKey,

    });
  }

  viewDataonClick() {
    if (this.state.runInform !== null) {
      return (
        <div className="run-detail" style={{ overflowY: "scroll", overflowX: "hidden", maxHeight: "250px" }}>
          <div className="form-group row">
            <label htmlFor="spike-input" className="col-sm-4 col-form-label">Run ID</label>
            <div className="col-sm-8">
              <input className="form-control" readOnly type="text" value={this.state.run_id === null ? "" : this.state.run_id} id="spike-input" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="start_time-input" className="col-sm-4 col-form-label">Start Time</label>
            <div className="col-sm-8">
              <input className="form-control" readOnly type="text" value={this.state.start_time === null ? "" : this.state.start_time} id="start_time-input" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="start_location_lat-input" className="col-sm-4 col-form-label">Start Location Lat</label>
            <div className="col-sm-8">
              <input className="form-control" readOnly type="text" /*onChange={this.handleChange}*/ value={this.state.start_location_lat === null ? "" : this.state.start_location_lat} id="start_location_lat-input" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="start_location_long-input" className="col-sm-4 col-form-label">Start Location Long</label>
            <div className="col-sm-8">
              <input className="form-control" readOnly /*onChange={this.handleChange1} */ type="text" value={this.state.start_location_long === null ? "" : this.state.start_location_long} id="start_location_long-input" />
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="start_time_epoch-input" className="col-sm-4 col-form-label">Start Time Epoch</label>
            <div className="col-sm-8">
              <input className="form-control" readOnly type="text" value={this.state.start_time_epoch === null ? "" : this.state.start_time_epoch} id="start_time_epoch-input" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="client_id-input" className="col-sm-4 col-form-label">Client Run ID</label>
            <div className="col-sm-8">
              <input className="form-control" readOnly /*onChange={this.handleChange1} */ type="text" value={this.state.client_run_id === null ? "" : this.state.client_run_id} id="client_id-input" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="version-input" className="col-sm-4 col-form-label">Version</label>
            <div className="col-sm-8">
              <input className="form-control" readOnly type="text" value={this.state.version === null ? "" : this.state.version} id="version-input" />
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="user_id-input" className="col-sm-4 col-form-label">User ID</label>
            <div className="col-sm-8">
              <input className="form-control" type="text" readOnly /*onChange={this.handleChange}*/ value={this.state.user_id === null ? "" : this.state.user_id} id="user_id-input" />
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="app-version-input" className="col-sm-4 col-form-label">Num of Spike</label>
            <div className="col-sm-8">
              <input className="form-control" readOnly type="text" value={this.state.num_spike === null ? "" : this.state.num_spike} id="app-version-input" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="app-version-input" className="col-sm-4 col-form-label">Num of Steps</label>
            <div className="col-sm-8">
              <input className="form-control" readOnly type="text" value={this.state.steps === null ? "" : this.state.steps} id="app-version-input" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="app_version-input" className="col-sm-4 col-form-label">App Version</label>
            <div className="col-sm-8">
              <input className="form-control" readOnly type="text" /*onChange={this.handleChange}*/ value={this.state.app_version === null ? "" : this.state.app_version} id="app_version-input" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="cause_run_title-input" className="col-sm-4 col-form-label">Cause</label>
            <div className="col-sm-8">
              <input className="form-control" readOnly /*onChange={this.handleChange1} */ type="text" value={this.state.cause_run_title === null ? "" : this.state.cause_run_title} id="cause_run_title-input" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="device_name-input" className="col-sm-4 col-form-label">Device Name</label>
            <div className="col-sm-8">
              <input className="form-control" readOnly type="text" value={this.state.device_name === null ? "" : this.state.device_name} id="device_name-input" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="distance-input" className="col-sm-4 col-form-label">Distance</label>
            <div className="col-sm-8">
              <input className="form-control" readOnly type="text" value={this.state.distance === null ? "" : this.state.distance} id="distance-input" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="run_amount-input" className="col-sm-4 col-form-label">Amount Raised</label>
            <div className="col-sm-8">
              <input className="form-control" readOnly type="text" value={this.state.run_amount === null ? "" : this.state.run_amount} id="run_amount-input" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="run_duration-input" className="col-sm-4 col-form-label">Run Duration</label>
            <div className="col-sm-8">
              <input className="form-control" type="text" value={this.state.run_duration === null ? "" : this.state.run_duration} id="app-version-input" readOnly />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="avg_speed-input" className="col-sm-4 col-form-label">Avg. Speed</label>
            <div className="col-sm-8">
              <input className="form-control" readOnly type="text" /*onChange={this.handleChange}*/ value={this.state.avg_speed === null ? "" : this.state.avg_speed} id="avg_speed-input" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="calories_burnt-input" className="col-sm-4 col-form-label">Calories Burnt</label>
            <div className="col-sm-8">
              <input className="form-control" readOnly /*onChange={this.handleChange1} */ type="text" value={this.state.calories_burnt === null ? "" : this.state.calories_burnt} id="calories_burnt-input" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="device_id-input" className="col-sm-4 col-form-label">Device ID</label>
            <div className="col-sm-8">
              <input className="form-control" readOnly type="text" value={this.state.device_id === null ? "" : this.state.device_id} id="device_id-input" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="cause_id-input" className="col-sm-4 col-form-label">Cause Id</label>
            <div className="col-sm-8">
              <input className="form-control" readOnly type="text" value={this.state.cause_id === null ? "" : this.state.cause_id} id="cause_id-input" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="is_flag-input" className="col-sm-4 col-form-label">Flagged</label>
            <div className="col-sm-8">
              <input className="form-control" readOnly type="text" value={this.state.is_flag === null ? "" : this.state.is_flag} id="is_flag-input" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="is_ios-input" className="col-sm-4 col-form-label">Is IOS</label>
            <div className="col-sm-8">
              <input className="form-control" type="text" value={this.state.is_ios === null ? "" : this.state.is_ios} id="is_ios-input" readOnly />
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="end_location_lat-input" className="col-sm-4 col-form-label">End Location Lat</label>
            <div className="col-sm-8">
              <input className="form-control" readOnly type="text" value={this.state.end_location_lat === null ? "" : this.state.end_location_lat} id="end_location_lat-input" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="end_location_long-input" className="col-sm-4 col-form-label">End Location Long</label>
            <div className="col-sm-8">
              <input className="form-control" type="text" value={this.state.end_location_long === null ? "" : this.state.end_location_long} id="end_location_long-input" readOnly />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="end_time-input" className="col-sm-4 col-form-label">End Time</label>
            <div className="col-sm-8">
              <input className="form-control" readOnly type="text" /*onChange={this.handleChange}*/ value={this.state.end_time === null ? "" : this.state.end_time} id="end_time-input" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="end_time_epoch-input" className="col-sm-4 col-form-label">End Time Epoch</label>
            <div className="col-sm-8">
              <input className="form-control" readOnly /*onChange={this.handleChange1} */ type="text" value={this.state.end_time_epoch === null ? "" : this.state.end_time_epoch} id="end_time_epoch-input" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="num_updates-input" className="col-sm-4 col-form-label">Num of Updates</label>
            <div className="col-sm-8">
              <input className="form-control" readOnly type="text" value={this.state.num_updates === null ? "" : this.state.num_updates} id="num_updates-input" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="os_version-input" className="col-sm-4 col-form-label">OS Version</label>
            <div className="col-sm-8">
              <input className="form-control" readOnly type="text" value={this.state.os_version === null ? "" : this.state.os_version} id="os_version-input" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="peak_speed-input" className="col-sm-4 col-form-label">Peak Speed</label>
            <div className="col-sm-8">
              <input className="form-control" readOnly type="text" value={this.state.peak_speed === null ? "" : this.state.peak_speed} id="peak_speed-input" />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="team_id-input" className="col-sm-4 col-form-label">Team ID</label>
            <div className="col-sm-8">
              <input className="form-control" type="text" value={this.state.team_id === null ? "" : this.state.team_id} id="team_id-input" readOnly />
            </div>
          </div>

        </div>
      )
    }
    else {
      return;
    }
  }

  loadMap() {
    return <Map location={this.state.runLocation} />
  }
  render() {

    if (this.state.data != null) {
      console.log('----------------------------------------',dataObject);
      var dataObject = this.state.data.results[0];
      let totalDistance = parseFloat(dataObject.total_distance.total_distance).toFixed(2);
      return (
        <div className="User">
          <div className="User-header">
            <div className="container">
              <section>
                <div className="row">
                  <div className="col-sm-7" >
                    <div className="box-top-left" >

                      <div className="col-sm-8">
                        <div style={{ display: "flex", padding: "10px 0px" }}>
                          <div style={{ marginRight: "10px" }}>
                            <img src={dataObject.social_thumb} alt={"social-thumb-" + dataObject.first_name} style={{ width: "80px" }} className="img-circle" />
                          </div>
                          <div>
                            <h4 style={{ margin: "auto" }}>{dataObject.user_id + ' ' + dataObject.first_name + ' ' + dataObject.last_name}</h4>
                            <ul style={{ listStyle: "none", padding: "0px" }}>
                              <li>Email : <a href={"mailto:" + dataObject.email}>{dataObject.email}</a></li>
                              <li>Gender : {dataObject.gender_user}</li>
                              <li>Weight : {dataObject.body_weight}</li>
                            </ul>
                          </div>
                        </div>
                        <div style={{ display: "flex" }}>
                          <div className="item">
                            <p style={{ color: "rgba(0, 0, 0, 0.37)", fontWeight: "bold" }}>Total Raised</p>
                            <p>&#8377; {dataObject.total_amount.total_amount === null ? 0 : dataObject.total_amount.total_amount}</p>
                          </div>
                          <div className="item">
                            <p style={{ color: "rgba(0, 0, 0, 0.37)", fontWeight: "bold" }}>No. of Runs</p>
                            <p>--</p>
                          </div>
                          <div className="item">
                            <p style={{ color: "rgba(0, 0, 0, 0.37)", fontWeight: "bold" }}>Distance</p>
                            <p>{totalDistance === "NaN" ? 0 : totalDistance} km</p>
                          </div>
                          <div className="item">
                            <p style={{ color: "rgba(0, 0, 0, 0.37)", fontWeight: "bold" }}>Team Code</p>
                            <p> 
                              <Link to={"/teammembers/"+dataObject.team_code +"/"}>
                                {dataObject.team_code === null ? "Not in League" : dataObject.team_code}
                              </Link>
                            </p>
                          </div>
                        </div>


                      </div>
                      <div className="col-sm-4">

                      </div>

                    </div>
                    <div className="box-top-left" style={{ width: "100%" }}>

                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Start Time</th>
                            <th>Cause</th>
                            <th>Distance</th>
                            <th>Impact</th>
                            <th>Calories</th>
                            <th>Duration</th>
                          </tr>
                        </thead>
                        <tbody style={{ color: "rgba(0, 0, 0, 0.37)", fontWeight: "bold", fontSize: "12px" }}>
                          {this.Viewruns()}
                        </tbody>
                      </table>
                    <div style={{display:this.state.pageCount>1?"block":"none"}} id="pagination">
                    <Pagination
                        prev
                        next
                        first
                        last
                        ellipsis
                        boundaryLinks
                        items={this.state.pageCount}
                        maxButtons={3}
                        activePage={this.state.activePage}
                        onSelect={this.handleSelect} />
                    </div>
                      
                    </div>
                  </div>
                  <div className="col-sm-5">
                    <div className="box-top-left" style={{ minHeight: "400px", width: "100%" }}>
                      <div style={{ width: "100%", height: "274px", marginBottom: "15px", backgroundColor: "rgba(173, 186, 216, 0.45)", border: "6px solid rgba(51, 122, 183, 0.61)" }}>
                        {this.loadMap()}
                      </div>
                      <div>
                        {this.viewDataonClick()}
                      </div>
                    </div>
                  </div>

                </div>
                <div className="row">
                  <div className="col-sm-5">
                    <Feedback user_id={dataObject.user_id} />
                  </div>
                </div>


              </section>
            </div>

          </div>
        </div>

      );
    }
    else {
      return (
        <div>Loading...</div>
      );

    }

  }
}

