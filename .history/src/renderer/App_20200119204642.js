import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import LoginView from './views/LoginView';
import SignUpView from './views/SignUpView';
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
const { remote } = window.require('electron');
const { Menu, MenuItem } = remote;
const customTitlebar = window.require('custom-electron-titlebar');
 

const electron = window.require('electron');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {theme: 'dark', tabValue:0, selectedRoomId: null};
    
  }

  componentDidMount = () => {
    if(location.pathname != '/live') {
        let customTaskbar = new customTitlebar.Titlebar({
            backgroundColor: customTitlebar.Color.fromHex('#171F23'),
            titleHorizontalAlignment:"left",
            icon:'/favicon.png',
            overflow: false,
        });
        if(location.pathname == '/login') {
            const menu = new Menu();
            customTaskbar.updateMenu(menu)
        }
    }
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
          <Route path='/live' component={() => <MuiThemeProvider theme={EOTheme}><LiveView/></MuiThemeProvider>}/>
          <Route path='/login' component={() => <MuiThemeProvider theme={EOTheme}><LoginView/></MuiThemeProvider>} />
          <Route path='/signup' component={() => <MuiThemeProvider theme={EOTheme}><SignUpView/></MuiThemeProvider>} />
          <Route path='/fullscreenvideo' component={FullscreenVideo}/>
          <MainOverlay toggleTheme={this.toggleTheme} selectedRoomId={this.state.selectedRoomId} changeRoom={this.changeRoom} headerContent={<HeaderRouter tabValue={this.state.tabValue} selectedRoomId={this.state.selectedRoomId} changeTab={this.changeTab}/>} >
            <Switch>
              <Route path='/control' render={(props) => <ControlView {...props} tabValue={this.state.tabValue} changeTab={this.changeTab} selectedRoomId={this.state.selectedRoomId} changeRoom={this.changeRoom} />} />
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
