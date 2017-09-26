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
      }
     if (props.feedback_id) {
          this.state.feedback_id = props.feedback_id;
          console.log("inside feedback fetchUrl", props.feedback_id);
        }
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
                  <Checkbox>
                      
                  </Checkbox>
                </td>
                <td>
                  <input type="text" name="my-input-field"/>
                </td>
                <td>
                  <Button onClick={() => {}}>
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
