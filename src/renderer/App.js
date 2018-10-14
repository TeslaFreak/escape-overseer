import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import LiveView from './views/LiveView';
import ControlView from './views/ControlView';
import EventConfigView from './views/EventConfigView';
import MetricsView from './views/MetricsView';
import SettingsView from './views/SettingsView';
import MainOverlay from './MainOverlay';
import { MuiThemeProvider } from '@material-ui/core/styles';
import {EOTheme, EODarkTheme} from './EscapeOverseerTheme'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {theme: 'dark'};
  }

  toggleTheme = () => {
    this.setState({theme: this.state.theme=='dark' ? 'light' : 'dark'});
  }

  render() {
    return (

      <MuiThemeProvider theme={this.state.theme=='light' ? EOTheme : EODarkTheme}>
        <Switch>
          <Route path='/live' component={() => <MuiThemeProvider theme={EOTheme}><LiveView/></MuiThemeProvider>}/>
          <MainOverlay toggleTheme={this.toggleTheme}>
            <Switch>
              <Route exact path='/' component={ControlView}/>
              <Route path='/control' component={ControlView}/>
              <Route path='/eventconfig' component={EventConfigView}/>
              <Route path='/metrics' component={MetricsView}/>
              <Route path='/settings' component={SettingsView}/>
            </Switch>
          </MainOverlay>
        </Switch>
      </MuiThemeProvider>
    );
  }
}

export default App;
