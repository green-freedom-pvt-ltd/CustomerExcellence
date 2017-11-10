import React, { Component } from 'react';
import logo from './images/logo1.png';
import './App.css';
import Runs from './components/runs';
import RunsDetail from './components/rundetail';
import Feedback from './components/feedback';
import League from './components/league';
import Team from './components/team';
import TeamMembers from './components/teammembers';
import SearchList from './components/searchitems';
import Dashboard from './dashboards/dashboard';
import User from './components/user';
import Login from './login';
import Logout from './logout';
import UserDetail from './components/userdetail';
import {
  BrowserRouter as Router,
  Route,
  Link

} from 'react-router-dom';


// var search_state = { value: '' };

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container-fluid">
          <header>
            <nav className="navbar navbar-default navbar-fixed-top" style={{    padding: "5px"}}>
              <div className="container">
                {/* <!-- Brand and toggle get grouped for better mobile display --> */}
                <div className="navbar-header page-scroll">
                  <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                  </button>
                  <a className="navbar-brand" href="/login" style={{ padding: "5px" }}>
                    <img src={logo}  alt="site-logo" />
                  </a>
                </div>
                {/* <!-- Collect the nav links, forms, and other content for toggling --> */}
                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                  <ul className="nav navbar-nav navbar-right">
                    {/* <li className="hidden">
                    <a href="#page-top"></a>
                </li>
                <li className="page-scroll">
                    <a href="#portfolio">Portfolio</a>
                </li>
                <li className="page-scroll">
                    <a href="#about">About</a>
                </li>
                <li className="page-scroll">
                    <a href="#contact">Contact</a>
                </li> */}
                    <li ><Link to="/user">User</Link></li>
                    <li ><Link to="/runs">Runs</Link></li>
                    <li ><Link to="/feedback">Feedback</Link></li>
                    <li ><Link to="/league">Leagues</Link></li>
                    <li ><Link to="/dashboards">Dashboard</Link></li>
                    <li ><Link to="/logout">Logout</Link></li>
                  </ul>
                </div>
                {/* <!-- /.navbar-collapse --> */}
              </div>
              {/* <!-- /.container-fluid --> */}
            </nav>
          </header>
          <section>
            <div className="">
              <div className="content-wrapper">
                <div style={{ flex: 1, padding: '10px' }}>
                  <Route path="/user" component={User} exact />
                  <Route path="/search_list" render={() => <SearchList />} />
                  <Route path="/feedback" render={() => <Feedback />} />
                  <Route path="/league" render={() => <League />} />
                  <Route path="/leagueteams" render={() => <Team />} />
                  <Route path="/teammembers" render={() => <TeamMembers />} />
                  <Route path="/userdetail" render={() => <UserDetail />} />
                  <Route path="/runs" render={() => <Runs />} />
                  <Route path="/rundetail" render={() => <RunsDetail />} />
                  <Route path="/dashboards" render={() => <Dashboard />} />
                  <Route path="/login" render={() => <Login />} />
                  <Route path="/logout" render={() => <Logout />} />
                  
                  {/* <Route path={path} render={routeProps => <LeaguePage {...routeProps} path={path} />} history={history} />
                      <Route path="/description" render={routeProps => <Example {...routeProps} />} history={history} /> */}
                </div>
              </div>
            </div>
          </section>

        </div>
      </Router>
    )

  }
}

export default App;
