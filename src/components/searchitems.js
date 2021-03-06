import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Pagination, Grid, Row, Col, Table } from 'react-bootstrap';
import SearchForm from './searchform';
import userSection from './usercomponent';
import {RingLoader, CircleLoader} from 'react-spinners';
import Cookies from 'universal-cookie';

const cookies = new Cookies();


export default class SearchItem extends Component {
    constructor(props) {
        super(props);
        var searchQuery = window.location.search;
        this.state = {
            query: searchQuery,
            data: '',
            nextPage: '',
            prevPage: '',
            activePage: 1,
            loading: true,
        }
        this.fetchResults("http://dev.impactrun.com/api/ced/users/" + searchQuery);
        this.handleSelect = this.handleSelect.bind(this);
    }
    fetchResults(query) {
        fetch(query, {
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
                    prevPage: responseJson.previous,
                    userPath: this.state.nextPage,
                    nextPage: responseJson.next,
                    loading: false,
                })
            });
    }

    Viewruns() {
        if (this.state.data === null || this.state.data === "") {
            return;
        }
        else {
            if (this.state.prevPage === null) {
                this.state.pageCount = Math.ceil(this.state.data.count / this.state.data.results.length);
              }
              if (this.state.data.results.length < 1) {
                return <tr><td colSpan="4" style={{textAlign:"center"}}>No Record Found..!!</td></tr>
      
              }
           else{
            var runList = this.state.data.results.map((item, index) => {
                return (
                    // <li key={index}>{item.run_id}</li>
                    <tr key={index}>
                        <td>
                            <Link to={"/userdetail/" + item.user_id}>
                                {item.user_id}
                            </Link>
                        </td>
                        <td>{item.first_name + " " + item.last_name}</td>
                        <td><a href={"mailto:"+item.email}>{item.email}</a></td>
                        <td>{item.birthday}</td>
                    </tr>
                )
            })
           }
            return runList;
        }
    }
    handleSelect(eventKey) {
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

    render() {
        if (this.state.data !== null || this.state.data != '') {
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
                                    <userSection/>
                                </Col>
                            </Row>
                        </Grid>
                    </div>
                    <div className="container">
                        <div className="box-top-left" style={{ width: "100%" }}>
                            <div className='row'>
                              <div className='col-sm-offset-6 col-sm-6 col-centered'>
                                <CircleLoader
                                        color={'#123abc'} 
                                        size={100}
                                        loading={this.state.loading} 
                                      />
                              </div>
                            </div>
                            <Table className="table table-striped">
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
                                    maxButtons={3}
                                    activePage={this.state.activePage}
                                    onSelect={this.handleSelect} />
                            </div>
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