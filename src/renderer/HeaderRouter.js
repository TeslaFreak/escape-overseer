import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import LiveView from './views/LiveView';
import ControlView from './views/ControlView';
import EventConfigView from './views/EventConfigView';
import MetricsView from './views/MetricsView';
import SettingsView from './views/SettingsView';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MainOverlay from './MainOverlay';
import { MuiThemeProvider } from '@material-ui/core/styles';
import {EOTheme, EODarkTheme} from './EscapeOverseerTheme'



function ControlViewHeader(props) {
  return (
    <React.Fragment>
      <Tabs value={props.tabValue} onChange={props.changeTab}>
        <Tab label="Control Screen" />
        <Tab label="Report" />
      </Tabs>
    </React.Fragment>
  );
}

function RoomConfigViewHeader(props) {
  return (
    <React.Fragment>
      <Tabs value={props.tabValue} onChange={props.changeTab}>
        <Tab label="Event Config" />
        <Tab label="Live Screen Config" />
      </Tabs>
    </React.Fragment>
  );
}

function EventConfigViewHeader(props) {
  return (
    <React.Fragment>
      <Typography
        component="h1"
        variant="h6"
        color="inherit"
        noWrap
      >
        Configure Events
      </Typography>
    </React.Fragment>
  );
}

class HeaderRouter extends Component {
  constructor(props) {
    super(props);
    this.state = {theme: 'dark', tabValue:0};
  }

  render() {
    return (
        <Switch>
          <Route exact path='/' render={(props) => <ControlViewHeader {...props} tabValue={this.props.tabValue} changeTab={this.props.changeTab}/>} />
          <Route path='/control' render={(props) => <ControlViewHeader {...props} tabValue={this.props.tabValue} changeTab={this.props.changeTab}/>} />
          <Route path='/eventconfig' render={(props) => <RoomConfigViewHeader {...props} tabValue={this.props.tabValue} changeTab={this.props.changeTab}/>} />
          <Route path='/metrics' component={EventConfigViewHeader}/>
          <Route path='/settings' component={EventConfigViewHeader}/>
        </Switch>
    );
  }
}

export default HeaderRouter;
