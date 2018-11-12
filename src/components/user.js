import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Pagination, Grid, Row, Col, Table } from 'react-bootstrap';
import SearchForm from './searchform';
import Cookies from 'universal-cookie';

const cookies = new Cookies();


class User extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: false,
      userPath: 'http://api.impactrun.com/ced/v1/users/',
      nextPage: '',
      prevPage: '',
      activePage: 1,

    }
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentWillMount() {

    this.fetchLeaderboard(this.state.userPath);
  }

  fetchLeaderboard(path) {
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

        this.setState({
          data: responseJson,
          loading: true,
          prevPage: responseJson.previous,
          userPath: this.state.nextPage,
          nextPage: responseJson.next,

        })

      })
      .catch((error) => {
        // console.error(error);
        window.location = "/logout";
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

        if (this.state.data.results.length < 1) {
          return <tr><td colSpan="3">No Record Found..!!</td></tr>

        }
        else {
          var runList = this.state.data.results.map((item, index) => {

            return (
              // <li key={index}>{item.run_id}</li>
              <tr key={index}>
                <td>
                  {index + 1}
                </td>
                <td>
                  <Link to={"/userdetail/" + item.user_id}>
                    {item.user_id}
                  </Link>
                </td>
                <td>
                  <Link to={"/userdetail/" + item.user_id}>
                    {`${item.first_name} ${item.last_name}`}
                  </Link>
                </td>
                <td><a href={"mailto:" + item.email}>{item.email}</a></td>
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
  handleSelect(eventKey) {

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
      <div className="container">
        <div className="User-header">
          <Grid>
            <Row className="show-grid">
              <Col xs={12} md={8}> <h2>User</h2> </Col>
            </Row>
            <Row className="show-grid">

              <Col md={8}>
                <SearchForm />
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
            <div style={{ display: this.state.pageCount > 1 ? "block" : "none" }} id="pagination">
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