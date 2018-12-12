import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import LiveView from './views/LiveView';
import ControlView from './views/ControlView';
import RoomConfigView from './views/RoomConfigView';
import MetricsView from './views/MetricsView';
import SettingsView from './views/SettingsView';
import MainOverlay from './MainOverlay';
import HeaderRouter from './HeaderRouter';
import FullscreenVideo from './views/FullscreenVideoView';
import { MuiThemeProvider } from '@material-ui/core/styles';
import {EOTheme, EODarkTheme} from './EscapeOverseerTheme';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {theme: 'dark', tabValue:0};
  }

  toggleTheme = () => {
    this.setState({theme: this.state.theme=='dark' ? 'light' : 'dark'});
  }

  changeTab = (event, value) => {
    this.setState({ tabValue:value });
  }

  render() {
    return (

      <MuiThemeProvider theme={this.state.theme=='light' ? EOTheme : EODarkTheme}>
        <Switch>
          <Route path='/live' component={() => <MuiThemeProvider theme={EOTheme}><LiveView/></MuiThemeProvider>}/>
          <Route path='/fullscreenvideo' component={FullscreenVideo}/>
          <MainOverlay toggleTheme={this.toggleTheme} headerContent={<HeaderRouter tabValue={this.state.tabValue} changeTab={this.changeTab} />} >
            <Switch>
              <Route exact path='/' render={(props) => <ControlView {...props} tabValue={this.state.tabValue} changeTab={this.changeTab}/>} />
              <Route path='/control' render={(props) => <ControlView {...props} tabValue={this.state.tabValue} changeTab={this.changeTab}/>} />
              <Route path='/roomconfig' render={(props) => <RoomConfigView {...props} tabValue={this.state.tabValue} changeTab={this.changeTab}/>} />
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
