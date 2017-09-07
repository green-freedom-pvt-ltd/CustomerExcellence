import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Pagination, Grid,Row, Col,Table } from 'react-bootstrap';
import NameForm from './runform';

class User extends Component {
    
      constructor(props) {
        super(props);
        this.state = {
          data: null,
          loading: false,
          userPath: 'http://dev.impactrun.com/api/leagueleaderboard/?impactleague=7',
          nextPage: '',
          prevPage: '',
          activePage: 1,
    
        }
        this.handleSelect = this.handleSelect.bind(this);
      }
    
      componentWillMount() {
        console.log("In Will MOunt");
    
        this.fetchLeaderboard(this.state.userPath);
      }
    
      fetchLeaderboard(path) {
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
              data: responseJson,
              loading: true,
              prevPage: responseJson.previous,
              userPath: this.state.nextPage,
              nextPage: responseJson.next,
    
            })
            console.log("Data", this.state.data);
    
          });
      }
      // handleNext() {
    
      //   this.fetchLeaderboard(this.state.nextPage);
    
      // }
      // handlePrev() {
      //   console.log("Prev", this.state.prevPage)
      //   this.fetchLeaderboard(this.state.prevPage);
      // }
      leaderboard() {
        if (this.state.data === null) {
          return;
        }
        else {
          if (this.state.prevPage === null) {
            this.state.pageCount = Math.ceil(this.state.data.count / this.state.data.results.length);
          }
    
       
          if (this.state.data != null) {
    
    
            var runList = this.state.data.results.map((item, index) => {
    
              return (
                // <li key={index}>{item.run_id}</li>
                <tr key={index}>
                  <td>
                    <Link to={"/userdetail/" + item.user.user_id}>
                      {`${item.user.first_name} ${item.user.last_name}`}
                    </Link>
                  </td>
                  <td>John</td>
                  <td>Carter</td>
                  <td>johncarter@mail.com</td>
                </tr>
              )
            })
          } else {
            runList;
          }
    
          return runList;
    
        }
      }
      handleSelect(eventKey) {
        console.log("Current Page", eventKey)
        console.log("Page", this.state.userPath)
        console.log("Prev Page", this.state.prevPage)
        if (this.state.activePage < eventKey) {
          this.fetchLeaderboard(this.state.nextPage);
        }
        else if (this.state.activePage > eventKey) {
          this.fetchLeaderboard(this.state.prevPage);
        }
        else {
    
        }
        this.setState({
          activePage: eventKey,
    
        });
      }
      render() {
        return (
          <div className="User">
            <div className="User-header">
              <Grid>
                <Row className="show-grid">
                  <Col xs={12} md={8}> <h2>User</h2> </Col>
                </Row>
                <Row className="show-grid">
    
                  <Col md={8}>
                    <NameForm />
                  </Col>
    
    
                </Row>
              </Grid>
            </div>
            <div className="User-header">
              <Col xs={12} md={8}>
                <Table striped bordered condensed hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>User ID</th>
                      <th>Name</th>
                      <th>Username</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!this.state.loading ? <tr style={{ textAlign: "center", width: "100%" }}><td colSpan="4">Loading...</td></tr> : null}
                    {this.leaderboard()}
                  </tbody>
                </Table>
                <div id="test">
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
                {/* <ButtonGroup>
                  <Button onClick={() => this.handlePrev()}>Prev</Button>
                  <Button></Button>
                  <Button onClick={() => this.handleNext()}>Next</Button>
                </ButtonGroup> */}
              </Col>
            </div>
          </div>
        );
      }
    }


export default User;