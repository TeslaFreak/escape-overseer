import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import LiveView from './views/LiveView';
import ControlView from './views/ControlView';
import EventConfigView from './views/EventConfigView';
import MetricsView from './views/MetricsView';
import SettingsView from './views/SettingsView';
import MainOverlay from './MainOverlay';
import './css/App.css';

class App extends Component {
  render() {
    return (
      <MainOverlay viewName={'control'}>
        <Switch>
          <Route exact path='/' component={ControlView}/>
          <Route path='/control' component={ControlView}/>
          <Route path='/eventconfig' component={EventConfigView}/>
          <Route path='/metrics' component={MetricsView}/>
          <Route path='/settings' component={SettingsView}/>
        </Switch>
      </MainOverlay>
    );
  }
}

export default App;
