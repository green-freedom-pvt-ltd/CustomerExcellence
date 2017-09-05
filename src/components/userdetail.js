import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Map from "./map.js";

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
    }
    this.Viewruns = this.Viewruns.bind(this);

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

        this.setState({
          userRun: responseJson,

        })
        console.log("user run", this.state.userRun);

      });
  }

  Viewruns() {
    if (this.state.userRun === null) {
      return;
    }
    else {
      if (this.state.userRun != null) {
        var runList = this.state.userRun.results.map((item, index) => {
          console.log("RUN USER", item);
          return (
            
            // <li key={index}>{item.run_id}</li>
            <tr key={index} onClick={() => this.loadLocation(item)}>
              <td>{item.run_id}</td>
              <td>{item.cause_run_title}</td>
              <td>{item.distance}</td>
              <td>{item.run_duration}</td>
            </tr>
          )
        })
      } else {
        runList;
      }

      return runList;

    }
  }



  loadLocation(item) {

    fetch("http://dev.impactrun.com/api/ced/runLocations/" + item.run_id, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic bmlra2k6Z3JlZW5mcmVlZG9tIQ=='
      }
    })
      .then((Response) => {
        console.log(Response);
        return Response.json()
      })
      .then((responseJson) => {

        this.setState({
          runLocation: responseJson,
          runInform:item,
          run_id:item.run_id,
          client_run_id:item.client_run_id,
          version:item.version,
          user_id:item.user_id,
          num_spike:item.num_spikes,
          steps:item.no_of_steps,
        })
      });

  }


  viewDataonClick(){
    if(this.state.runInform!==null){
      return(
        <div>
        <div className="form-group row">
          <label htmlFor="user_id-input" className="col-sm-4 col-form-label">User ID</label>
          <div className="col-sm-8">
            <input className="form-control" type="text" /*onChange={this.handleChange}*/   value={this.state.user_id=== null?"":this.state.user_id} id="user_id-input"/>
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="client_id-input" className="col-sm-4 col-form-label">Client Run ID</label>
          <div className="col-sm-8">
            <input className="form-control" /*onChange={this.handleChange1} */ type="text" value={this.state.client_run_id=== null?"":this.state.client_run_id} id="client_id-input" />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="version-input" className="col-sm-4 col-form-label">Version</label>
          <div className="col-sm-8">
            <input className="form-control"  type="text" value={this.state.version=== null?"":this.state.version} id="version-input" />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="spike-input" className="col-sm-4 col-form-label">Run ID</label>
          <div className="col-sm-8">
            <input className="form-control"  type="text" value={this.state.run_id=== null?"":this.state.run_id} id="spike-input" />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="app-version-input" className="col-sm-4 col-form-label">Num of Spike</label>
          <div className="col-sm-8">
            <input className="form-control" type="text" value={this.state.num_spike=== null?"":this.state.num_spike} id="app-version-input" />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="app-version-input" className="col-sm-4 col-form-label">Num of Steps</label>
          <div className="col-sm-8">
            <input className="form-control" type="text" value={this.state.steps=== null?"":this.state.steps} id="app-version-input" />
          </div>
        </div>
      </div>
      )
    }
    else
    {
      return;
    }
  }

  loadMap() {
    return <Map location={this.state.runLocation} />
  }
  render() {

    if (this.state.data != null) {

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

                      <div className="col-sm-7">
                        <div style={{ display: "flex", padding: "10px 0px" }}>
                          <div style={{ marginRight: "10px" }}>
                            <img src={dataObject.social_thumb} alt={"social-thumb-" + dataObject.first_name} style={{ width: "80px" }} className="img-circle" />
                          </div>
                          <div>
                            <h4 style={{ margin: "auto" }}>{dataObject.first_name + ' ' + dataObject.last_name}</h4>
                            <ul style={{ listStyle: "none", padding: "0px" }}>
                              <li>User Id : {dataObject.user_id}</li>
                              <li> Gender : {dataObject.gender_user}</li>
                              <li>Weight : {dataObject.body_weight}</li>
                            </ul>
                          </div>
                        </div>
                        <div style={{ display: "flex" }}>
                          <div className="item">
                            <h4>Total Raised</h4>
                            <p>{dataObject.total_amount.total_amount}</p>
                          </div>
                          <div className="item">
                            <h4>No. of Runs</h4>
                            <p>1065</p>
                          </div>
                          <div className="item">
                            <h4>Distance</h4>
                            <p>{totalDistance}</p>
                          </div>
                        </div>


                      </div>
                      <div className="col-sm-5">

                      </div>

                    </div>
                    <div className="box-top-left" style={{ width: "100%" }}>

                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Run ID</th>
                            <th>Cause</th>
                            <th>Distance</th>
                            <th>Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.Viewruns()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="col-sm-5">
                    <div className="box-top-left" style={{ minHeight: "400px", width: "100%" }}>
                      <div style={{ width: "100%", height: "274px", marginBottom: "15px", backgroundColor: "blue" }}>
                        {this.loadMap()}
                      </div>
                      <div>
                        {this.viewDataonClick()}
                      </div>
                    </div>
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

