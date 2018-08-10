import React, {Component} from 'react';
import { Button, Grid, Row, Col, Table, FormControl,Form, FormGroup,ControlLabel, Modal , Checkbox} from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'


export default class FeedbackModal extends Component{
    constructor(props) {
      super(props);
        this.state = {
        showModal: false,
        feedback_id:0,
        resolution: '',
      }
    this.handleChange = this.handleChange.bind(this);
      
     if (props.feedback_id) {
          this.state.feedback_id = props.feedback_id;
          // console.log("inside feedback fetchUrl", props.feedback_id);
        }
    }
    
  handleChange(event) {
    this.setState({resolution: event.target.value});
  }


  putFeedbackReply(feedback_id) {
    var path = "http://dev.impactrun.com/api/userFeedback/" + feedback_id+'/'
    const formData = new FormData();
    formData.append('resolution', this.state.resolution);
    formData.append('is_replied', true);
    // return console.log("return put saved for ", this.state.resolution)
    return fetch(path, {
      method: 'PUT',
      body: formData,
     
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ showModal: false })
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
              bsStyle="primary"
              bsSize="large"
              onClick={() => this.setState({ showModal: true })}>
              Resolve
            </Button>

            <Modal show={this.state.showModal} onHide={this.close}>
              <Modal.Header closeButton>
                <Modal.Title> reply for  {this.state.feedback_id}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
               <tr key={this.state.feedback_id} >
                <td>
                  <input type="text" value={this.state.resolution} onChange={this.handleChange} name="my-input-field"/>
                </td>
                <td>
                  <Button onClick={() => this.putFeedbackReply(this.state.feedback_id)}>
                      Save
                  </Button>
                </td>
              </tr>

              </Modal.Body>
              <Modal.Footer>
                <Button onClick={() => this.setState({ showModal: false })}>Close</Button>
              </Modal.Footer>
            </Modal>
          </div>
        );
      }
}
