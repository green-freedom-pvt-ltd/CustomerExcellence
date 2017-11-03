import React, {Component} from 'react';
import { Button, Grid, Row, Col, Table, FormControl,Form, FormGroup,ControlLabel, Modal , Checkbox} from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'


export default class RunModal extends Component{
    constructor(props) {
      super(props);
        this.state = {
        showModal: false,
        run_id:0,
        resolution: '',
      }
    this.handleChange = this.handleChange.bind(this);
      
     if (props) {
          console.log("inside feedback fetchUrl", props);
        }
    }
    
  handleChange(event) {
    this.setState({resolution: event.target.value});
  }


  putRun() {
    var path = "http://localhost:8000/api/ced/runupdate/" + this.props.data.run_id+'/'
    const formData = new FormData();
    
    console.log("return put saved for ",this.props.data)
    formData.append('user_id', this.props.data.user_id);
    formData.append('start_time', this.props.data.start_time);
    formData.append('run_amount', this.props.data.run_amount);
    formData.append('run_duration', this.props.data.run_duration);
    formData.append('avg_speed', this.props.data.avg_speed);
    formData.append('distance', this.props.data.distance);
    formData.append('is_flag', !this.props.data.is_flag);
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
        // window.location.reload();

      })
      .catch((error) => {
        console.error(error);
      });
  }

      // close() {
      //   this.setState({ showModal: false });
      // }

      // open() {
      //   this.setState({ showModal: true });
      // }

      render() {
        
        return (
          <div>
            <Button
              bsStyle="default"
              bsSize="small"
              onClick={() => this.setState({ showModal: true })}>
              {this.props.data.is_flag ? "unflag" : "flag" }
            </Button>

            <Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })}>
              <Modal.Header closeButton>
                <Modal.Title> Flagging Run</Modal.Title>
              </Modal.Header>
              <Modal.Body>
               <tr key={this.state.run_id} >
                <td>
                Are you sure you want to {this.props.data.is_flag ? "unflag" : "flag" } this run ?
                </td>
              </tr>

              </Modal.Body>
              <Modal.Footer>
                <Button onClick={() => this.putRun()}>Yes</Button>
                <Button onClick={() => this.setState({ showModal: false })}>No</Button>
              </Modal.Footer>
            </Modal>
          </div>
        );
      }
}
