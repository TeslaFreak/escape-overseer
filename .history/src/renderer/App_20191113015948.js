import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import LoginView from './views/LoginView';
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
import { Security, SecureRoute, ImplicitCallback } from '@okta/okta-react';
import RoomSelectionView from './views/RoomSelectionView';
const electron = window.require('electron');
import config from '../config';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {theme: 'dark', tabValue:0, selectedRoomId: null};
  }

  componentDidMount = () => {
      
  }

  toggleTheme = () => {
    this.setState({theme: this.state.theme=='dark' ? 'light' : 'dark'});
  }

  changeTab = (event, value) => {
    this.setState({ tabValue:value });
  }

  changeRoom = (roomId) => {
    this.setState({ selectedRoomId:roomId });
  }

  //TODO:[V1 Mandatory] remove access to all V1 nonessential features, such as reports, metrics, and old editor screen.
  // Disable or delete where applicable and continue work on new branch for future releases

  //TODO:[V1 Mandatory] move light theme switch somewhere else and make sure everything works in both themes
  //Look into some sort of environment variables so I dont have to pass this stuff around
  render() {
    return (

      <MuiThemeProvider theme={this.state.theme=='light' ? EOTheme : EODarkTheme}>
        <Switch>
            <Security issuer='https://${yourOktaDomain}/oauth2/default'
                  clientId='{clientId}'
                  redirectUri={window.location.origin + '/implicit/callback'}
                  onAuthRequired={onAuthRequired}
                  pkce={true}>
          <Route path='/live' component={() => <MuiThemeProvider theme={EOTheme}><LiveView/></MuiThemeProvider>}/>
          <Route path='/login' component={() => <MuiThemeProvider theme={EODarkTheme}><LoginView/></MuiThemeProvider>} />
          <Route path='/fullscreenvideo' component={FullscreenVideo}/>
          <Route path='/implicit/callback' component={ImplicitCallback}/>
          <MainOverlay toggleTheme={this.toggleTheme} selectedRoomId={this.state.selectedRoomId} changeRoom={this.changeRoom} headerContent={<HeaderRouter tabValue={this.state.tabValue} selectedRoomId={this.state.selectedRoomId} changeTab={this.changeTab}/>} >
            <Switch>
              <SecureRoute path='/control' render={(props) => <ControlView {...props} tabValue={this.state.tabValue} changeTab={this.changeTab} selectedRoomId={this.state.selectedRoomId} changeRoom={this.changeRoom}/>} />
              <SecureRoute path='/roomconfig' render={(props) => <RoomConfigView {...props} tabValue={this.state.tabValue} changeTab={this.changeTab} selectedRoomId={this.state.selectedRoomId} changeRoom={this.changeRoom} />} />
              <SecureRoute path='/metrics' component={MetricsView}/>
              <SecureRoute path='/settings' component={SettingsView}/>
              <Redirect from='/' to='/control'/>
            </Switch>
          </MainOverlay>
          </Security>
        </Switch>
      </MuiThemeProvider>
    );
  }
}

export default App;
