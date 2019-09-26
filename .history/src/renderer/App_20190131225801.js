import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
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
import RoomSelectionView from './views/RoomSelectionView';
const electron = window.require('electron');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {theme: 'dark', tabValue:0, selectedRoomId: null};
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

  render() {
    return (

      <MuiThemeProvider theme={this.state.theme=='light' ? EOTheme : EODarkTheme}>
        <Switch>
          <Route path='/live' component={() => <MuiThemeProvider theme={EOTheme}><LiveView/></MuiThemeProvider>}/>
          <Route path='/fullscreenvideo' component={FullscreenVideo}/>
          <MainOverlay toggleTheme={this.toggleTheme} selectedRoomId={this.state.selectedRoomId} changeRoom={this.changeRoom} headerContent={<HeaderRouter tabValue={this.state.tabValue} selectedRoomId={this.state.selectedRoomId} changeTab={this.changeTab}/>} >
            <Switch>
              <Route path='/control' render={(props) => <ControlView {...props} tabValue={this.state.tabValue} changeTab={this.changeTab} selectedRoomId={this.state.selectedRoomId} changeRoom={this.changeRoom}/>} />
              <Route path='/roomconfig' render={(props) => <RoomConfigView {...props} tabValue={this.state.tabValue} changeTab={this.changeTab} selectedRoomId={this.state.selectedRoomId} changeRoom={this.changeRoom} />} />
              <Route path='/metrics' component={MetricsView}/>
              <Route path='/settings' component={SettingsView}/>
              <Redirect from='/' to='/control'/>
            </Switch>
          </MainOverlay>
        </Switch>
      </MuiThemeProvider>
    );
  }
}

export default App;
