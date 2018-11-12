import React, { Component } from 'react';
import UserComponent from './usercomponent';
import Map from "./map.js";
import Feedback from './feedback';
import moment from 'moment';
import Cookies from 'universal-cookie';
const cookies = new Cookies();




var totalRuns;
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
    this.viewRuns = this.viewRuns.bind(this);
    this.handleSelect = this.handleSelect.bind(this);

    // searchedItem = window.location.search;       
  }
  componentWillMount() {
    this.fetchRuns('http://dev.impactrun.com/api/ced/runs/?user_id=' + this.state.user_id);
  }
  componentDidMount() {
    try {
      fetch('http://api.impactrun.com/ced/v1/users/' + this.state.user_id + '/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': cookies.get('authorization')
        }
      })
        .then((Response) => {
          if(Response.status === 401){
            window.location = "/logout";
          }
          return Response.json();
        })
        .then((responseJson) => {
          this.setState({
            data: responseJson,
          })
          // console.log(this.state.data);
        })
    } catch (error) {

      return error;
    }


  }


  fetchRuns(path) {
    fetch(path, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': cookies.get('authorization')

      }
    })
      .then((Response) => Response.json())
      .then((responseJson) => {
        // console.log("PREV", responseJson)
        this.setState({
          userRun: responseJson,
          prevPage: responseJson.previous,
          userPath: this.state.nextPage,
          nextPage: responseJson.next,

        })
        // console.log("user run", this.state.userRun);

      });
  }

  viewRuns() {

    if (this.state.userRun === null) {
      return;
    }
    else {
      if (this.state.prevPage === null) {
        totalRuns = this.state.userRun.count;
        this.state.pageCount = Math.ceil(this.state.userRun.count / this.state.userRun.results.length);
      }
      if (this.state.userRun != null) {

        if (this.state.userRun.results.length < 1) {
          return <tr><td colSpan="6" style={{ textAlign: "center" }}>No Record Found..!!</td></tr>

        }
        else {
          var runList = this.state.userRun.results.map((item, index) => {
            // var color = (this.state.id === item.run_id) ? 'active-item' : '';
            // console.log('item-0-------0000000000000-------------',item);
            let startTime = this.getTime(item.start_time)

            let totalDistance = parseFloat(item.distance).toFixed(2);
            let estimatedDistance = parseFloat((item.estimated_distance / 1000) - totalDistance).toFixed(2);
            let googleFitDistance = parseFloat((item.google_fit_distance / 1000) - totalDistance).toFixed(2);
            var distance = totalDistance + ' / ' + estimatedDistance + ' / ' + googleFitDistance;

            let totalSteps = parseFloat(item.no_of_steps * .0007).toFixed(2);
            let estimatedSteps = parseFloat((item.estimated_steps - item.no_of_steps) * .0007).toFixed(2);
            let googleFitSteps = parseFloat((item.google_fit_steps - item.no_of_steps) * .0007).toFixed(2);
            var steps = item.no_of_steps + ' steps / ' + totalSteps + ' / ' + estimatedSteps + ' / ' + googleFitSteps;

            let totalCalories = parseFloat(item.calories_burnt).toFixed(2);
            let estimadedCalories = parseFloat(item.estimated_calories - item.calories_burnt).toFixed(2);
            var calories = totalCalories + ' / ' + estimadedCalories;


            let startEpochTime = new Date(item.start_time);
            let startDateTime = startEpochTime.getDate() + "/" + (startEpochTime.getMonth() + 1) + "/" + startEpochTime.getFullYear() + "  " + startTime
            var runDuration = moment.duration(item.run_duration);
            var timeMinutes = (runDuration.seconds() / 60) + runDuration.minutes() + (runDuration.hours() * 60);
            var averageSpeed = (60 * item.distance) / timeMinutes;
            var redColor = 100 + Math.round(averageSpeed * 2);
            var greenColor = Math.round(200 - (averageSpeed * 3));
            var backgroundColor = "rgb( " + redColor + ", " + greenColor + ", 0)";
            return (

              // <li key={index}>{item.run_id}</li>
              <tr className={item.is_flag ? "danger" : (this.state.id === item.run_id) ? 'active-item' : ''} style={{ cursor: "pointer" }} key={index} onClick={() => this.loadLocation(item, item.run_id)}>
                <td>{startDateTime}</td>
                <td>{item.cause_run_title}</td>
                <td>{distance} km</td>
                <td>{steps} km</td>
                <td>{calories}</td>
                <td>{item.run_id}</td>
                <td>{item.team_id}</td>
                <td style={{ backgroundColor: backgroundColor }}>{item.run_duration}</td>

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

    fetch('http://api.impactrun.com/ced/v1/runLocations/' + item.run_id + '/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': cookies.get('authorization')
      }
    })
      .then((Response) => {

        return Response.json()
      })
      .then((responseJson) => {
        //console.log("ITEM...",item);
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
          team_id: item.team_id,
          estimated_calories: item.estimated_calories,
          estimated_distance: item.estimated_distance / 1000,
          estimated_steps: item.estimated_steps,
          google_fit_distance: item.google_fit_distance / 1000,
          google_fit_steps: item.google_fit_steps,
          usain_bolt_count: item.usain_bolt_count

        })
        this.viewRuns();
      });

  }
  handleSelect(eventKey) {
    if (this.state.activePage + 1 === eventKey) {
      this.fetchRuns(this.state.nextPage);
    }
    else if (this.state.activePage - 1 === eventKey) {
      this.fetchRuns(this.state.prevPage);
    }
    else {
      let runPath = "http://dev.impactrun.com/api/ced/runs/?page=" + eventKey + "&user_id=" + this.state.user_id
      this.fetchRuns(runPath);
    }
    this.setState({
      activePage: eventKey,

    });
  }

  viewDataonClick() {
    var renderRuns = [
      { "id": "run-input", "text": "Run ID", "state": this.state.run_id },
      { "id": "start_time-input", "text": "Start Time", "state": this.state.start_time },
      { "id": "start_time_epoch-input", "text": "Start Time Epoch", "state": this.state.start_time_epoch },
      { "id": "end_time-input", "text": "End Time", "state": this.state.end_time },
      { "id": "end_time_epoch-input", "text": "End Time Epoch", "state": this.state.end_time_epoch },
      { "id": "steps-input", "text": "Num of Steps", "state": this.state.steps },
      { "id": "spike-input", "text": "Num of Spike", "state": this.state.num_spike },
      { "id": "run_duration-input", "text": "Run Duration", "state": this.state.run_duration },
      { "id": "avg_speed-input", "text": "Avg. Speed", "state": this.state.avg_speed },
      { "id": "calories_burnt-input", "text": "Calories Burnt", "state": this.state.calories_burnt },
      { "id": "device_name-input", "text": "Device Name", "state": this.state.device_name },
      { "id": "distance-input", "text": "Distance", "state": this.state.distance },
      { "id": "run_amount-input", "text": "Amount Raised", "state": this.state.run_amount },
      { "id": "client_id-input", "text": "Client Run ID", "state": this.state.client_run_id },
      { "id": "version-input", "text": "Version", "state": this.state.version },
      { "id": "user_id-input", "text": "User ID", "state": this.state.user_id },
      { "id": "app_version-input", "text": "App Version", "state": this.state.app_version },
      { "id": "cause_run_title-input", "text": "Cause", "state": this.state.cause_run_title },
      { "id": "device_id-input", "text": "Device ID", "state": this.state.device_id },
      { "id": "cause_id-input", "text": "Cause Id", "state": this.state.cause_id },
      { "id": "is_flag-input", "text": "Flagged", "state": this.state.is_flag },
      { "id": "is_ios-input", "text": "Is IOS", "state": this.state.is_ios },
      { "id": "num_updates-input", "text": "Num of Updates", "state": this.state.num_updates },
      { "id": "os_version-input", "text": "OS Version", "state": this.state.os_version },
      { "id": "peak_speed-input", "text": "Peak Speed", "state": this.state.peak_speed },
      { "id": "team_id-input", "text": "Team ID", "state": this.state.team_id },
      { "id": "start_location_lat-input", "text": "Start Location Lat", "state": this.state.start_location_lat },
      { "id": "start_location_long-input", "text": "Start Location Long", "state": this.state.start_location_long },
      { "id": "end_location_lat-input", "text": "End Location Lat", "state": this.state.end_location_lat },
      { "id": "end_location_long-input", "text": "End Location Long", "state": this.state.end_location_long },
      { "id": "estimated_calories-input", "text": "Estimated calories", "state": this.state.estimated_calories },
      { "id": "estimated_distance-input", "text": "Estimated distance", "state": this.state.estimated_distance },
      { "id": "estimated_steps-input", "text": "Estimated steps", "state": this.state.estimated_steps },
      { "id": "google_fit_distance-input", "text": "Google fit steps", "state": this.state.google_fit_steps },
      { "id": "usain_bolt_count-input", "text": "Usain bolt count", "state": this.state.usain_bolt_count },
      { "id": "google_fit_distance-input", "text": "Google fit distance", "state": this.state.google_fit_distance }

    ]

    if (this.state.runInform !== null) {
      var runInformation = renderRuns.map((item, index) => {
        if (item.id === "run-input") {
          return (
            <div key={index} className="form-group row" title="click to see run detail">
              <label htmlFor={item.id} className="col-sm-4 col-form-label" style={{ cursor: "pointer" }}>{item.text}</label>
              <div className="col-sm-8" onClick={() => { return this.state.run_id === undefined ? "" : window.open('/rundetail/' + this.state.run_id) }}>
                <input className="form-control" style={{ cursor: "pointer" }} readOnly type="text" value={item.state === null ? "" : item.state} id={item.id} />
              </div>
            </div>
          )
        }
        else {
          return (
            <div key={index} className="form-group row">
              <label htmlFor={item.id} className="col-sm-4 col-form-label">{item.text}</label>
              <div className="col-sm-8">
                <input className="form-control" readOnly type="text" value={item.state === null ? "" : item.state} id={item.id} />
              </div>
            </div>
          )
        }
      })
      return (
        <div className="run-detail" style={{ overflowY: "scroll", overflowX: "hidden", maxHeight: "372px" }}>
          {runInformation}
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
    if (this.state.data != null || typeof this.state.data !== 'undefined') {

      if (this.state.data.count > 0) {
        var dataObject = this.state.data.results[0];

        return (
          <div className="User">
            <div className="User-header">
              <div className="container">
                <section>
                  <div className="row">
                    <UserComponent
                      handleselect={this.handleSelect}
                      dataobject={dataObject}
                      activepage={this.state.activePage}
                      runview={this.viewRuns()}
                      pagecount={this.state.pageCount}
                      runcount={totalRuns}
                    />
                    <div className="row">
                      <div className="col-sm-5">
                        <div className="box-top-left" style={{ minHeight: "400px", width: "100%" }}>
                          <div style={{ width: "100%", height: "350px", marginBottom: "15px", backgroundColor: "rgba(173, 186, 216, 0.45)", border: "6px solid rgba(51, 122, 183, 0.61)" }}>
                            {this.loadMap()}
                          </div>
                          <div>
                            {this.viewDataonClick()}
                          </div>
                        </div>
                      </div>

                    </div>
                    <div className="row">

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
        return <div>User not Available</div>
      }
    }
    else {

      return (
        <div>Loading...</div>
      );

    }

  }
}

