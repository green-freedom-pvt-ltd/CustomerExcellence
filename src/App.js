import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Runs from './components/runs';
import Feedback from './components/feedback';
import League from './components/league';
import Team from './components/team';
import TeamMembers from './components/teammembers';
import SearchList from './components/searchitems'
import _ from "lodash";
import User from './components/user';
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
        <div style={{ display: 'flex' }}>
          <div style={{
            padding: '10px',
            // width: '20%',
            background: '#f0f0f0'
          }}>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              <li><Link to="/">User</Link></li>
              <li><Link to="/runs">Runs</Link></li>
              <li><Link to="/feedback">Feedback</Link></li>
              <li><Link to="/league">Leagues</Link></li>
            </ul>
          </div>
          <div style={{ flex: 1, padding: '10px' }}>
            <Route path="/" component={User} exact />
            <Route path="/search_list" render={() => <SearchList />} />
            <Route path="/feedback" render={() => <Feedback />} />
            <Route path="/league" render={() => <League />} />
            <Route path="/leagueteams" render={() => <Team />} />
            <Route path="/teammembers" render={() => <TeamMembers />} />
            <Route path="/userdetail" render={() => <UserDetail />} />
            <Route path="/runs" render={() => <Runs />} />

            {/* <Route path={path} render={routeProps => <LeaguePage {...routeProps} path={path} />} history={history} />
        <Route path="/description" render={routeProps => <Example {...routeProps} />} history={history} /> */}
          </div>
        </div>
      </Router>
    )

  }
}

export default App;
