// import React, {Component} from 'react';

// export default class Run extends Component{
// render(){
//     return (
//         <div>This is Run page</div>
//     );
// }
// }


import React, { Component } from 'react';
import { Pagination, Table,Checkbox , Button} from 'react-bootstrap';
import {
  Link
} from 'react-router-dom';
import RunFilter from "./reusable/runFilter"
import {RingLoader, PropagateLoader} from 'react-spinners';
import Cookies from 'universal-cookie';
import _ from "lodash";

const cookies = new Cookies();


export default class Run extends Component {
  constructor(props) {
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
      fetchUrl: 'http://localhost:8000/api/ced/runs/'
    }
    this.handleSelect = this.handleSelect.bind(this);
    this.myCallback = this.myCallback.bind(this);
    if (props.user_id) {
      this.state.fetchUrl += '?user_id=' + props.user_id
      // console.log("inside feedback fetchUrl", this.state.fetchUrl);
    }
  }


 

  handleReply(event) {
    console.log("inside handle reply ",event);
  }

  handleSelect(eventKey) {
    // console.log("Current Page", eventKey)
    // console.log("Page", this.state.userPath)
    // console.log("Prev Page", this.state.prevPage)
    if (this.state.activePage < eventKey) {
      this.fetchResults(this.state.nextPage);
    }
    else if (this.state.activePage > eventKey) {
      this.fetchResults(this.state.prevPage);
    }
    else {

    }
    this.setState({
      activePage: eventKey,

    });
  }

  componentWillMount() {
    this.fetchResults(this.state.fetchUrl);
  }

  fetchResults(path) {
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
          loading: false,
          prevPage: responseJson.previous,
          userPath: this.state.nextPage,
          nextPage: responseJson.next,

        });
        // console.log('inside componentWillMount feedback', this.state.data);
      })
      .catch((error) => {
       console.error(error);
        // window.location = "/logout";
      });
  }

   handleCheckbox(event) {
      console.log("inside handleCheckbox",event, this);
      if (this) {
      this.setState({childVisible: !this.state.childVisible});
      } 
    }

    myCallback (dataFromChild) {
        this.setState({
          data: dataFromChild,
          loading: false,
          prevPage: dataFromChild.previous,
          userPath: this.state.nextPage,
          nextPage: dataFromChild.next,

        });
        console.log('----------listDataFromChild', this.state.listDataFromChild);
    }

  render() {
    var feedback_data = this.state.data;
    if (feedback_data) {
    console.log("------111--------", feedback_data.count);
      if (this.state.prevPage === null) {
        this.state.pageCount = Math.ceil(feedback_data.count / feedback_data.results.length);
      }
      this.state.count = feedback_data.count;

        var email_subject = "Impact Feedback"

        var feedbackList = feedback_data.results.map((run, index) => {
        console.log('Run--------------------------',Run);
          return (
            
            <tr key={index} className={run.is_replied ? "success" : "default"}>
              <td>{index + 1}</td>
              <td>
                <Link to={"/userdetail/" + run.user_id}>
                  {run.user_id}
                </Link>
              </td>
              <td>{run.run_id}</td>
              <td>{run.start_time}</td>
              <td>{run.run_duration}</td>
              <td>{run.distance}</td>
              <td>{run.run_amount}</td>
            </tr>)
        });

      }
     


    return (
      <div>
        <div className='row'>
          <div className='col-sm-offset-6 col-sm-6 col-centered'>
            <PropagateLoader
                    color={'#123abc'} 
                    size={20}
                    loading={this.state.loading} 
                  />
          </div>
          <div className='col-sm-6'>
              <h1> Runs list </h1>
          </div>
          <div className='col-sm-6'>
              <h1> Total Count {this.state.count} </h1>
          </div>
          <div className='col-sm-12'>
              <RunFilter callbackFromParent={this.myCallback} />
          </div>
        </div>

          <div className='row'>
        	<br/>

            <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>User Id</th>
                  <th>Run Id</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Distance</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {feedbackList}
              </tbody>
            </Table>
            <div style={{display:this.state.pageCount>1?"block":"none"}} id="pagination">
              <Pagination
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                items={this.state.pageCount}
                maxButtons={5}
                activePage={this.state.activePage}
                onSelect={this.handleSelect} />
            </div>
          </div>
      </div>
    );
  }
}


// export default feedbackContainer;