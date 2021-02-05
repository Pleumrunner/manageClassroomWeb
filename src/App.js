import React from 'react';
import './App.css';
import Sidebar from './screens/components/Sidebar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './screens/page/Home';
import Reports from './screens/page/Reports';
import Seatmap from './screens/page/Seatmap';
import Attendants from './screens/page/Attendants';
import Login from './screens/page/Login';
import Navbarnew from './screens/components/Navbarnew';

function App() {
  return (
    <>
      <Router>
        <div className='row'>
          <div className='col-2'>
            <div className='container m-5'>
              <Sidebar />
            </div>
          </div>
          <div className='col'>
          <Navbarnew/>
          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/reports' component={Reports} />
            <Route path='/seatmap' component={Seatmap} />
            <Route path='/attendants' component={Attendants} />
            <Route path='/login' component={Login} />
          </Switch>
        </div>
        </div>
      </Router>
    </>
  );
}

export default App;