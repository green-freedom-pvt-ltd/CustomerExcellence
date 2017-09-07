import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Pagination, Grid,Row, Col,Table } from 'react-bootstrap';
import NameForm from './runform';


export default class SearchItem extends Component {
    constructor(props) {
        super(props);
        console.log("SEARCH PAGE", window.location.search);
        var searchQuery = window.location.search;
        this.state = {
            query: searchQuery,
            data: '',
        }
        this.fetchResults(searchQuery);
    }
    fetchResults(query) {
        console.log("Data", 'http://dev.impactrun.com/api/ced/users' + query)
        fetch("http://dev.impactrun.com/api/ced/users/" + query, {
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

Viewruns() {
        if (this.state.data === null || this.state.data === "") {
            return;
        }
        else {
            var runList = this.state.data.results.map((item, index) => {
                console.log("RUN USER", item);
                return (
                    // <li key={index}>{item.run_id}</li>
                    <tr key={index}>
                        <td>
                            <Link to={"/userdetail/" + item.user_id}>
                                {item.user_id}
                            </Link>
                        </td>
                        <td>{item.first_name + " " + item.last_name}</td>
                        <td>{item.email}</td>
                        <td>{item.birthday}</td>
                    </tr>
                )
            })
            return runList;
        }
    }

    render() {
        if (this.state.data !== null || this.state.data != '') {
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
                <div className="box-top-left" style={{ width: "100%" }}>

                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Birthday</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.Viewruns()}
                        </tbody>
                    </table>
                </div>
                </div>
                </div>
            );
        }
        else {
            <div>Test</div>
        }
    }

}