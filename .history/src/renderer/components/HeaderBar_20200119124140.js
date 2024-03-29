import React, { Component } from 'react';
import PouchDataManager from '../PouchDataManager';
import classNames from 'classnames';
import RoomSelectDropDown from './RoomSelectDropDown';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { Switch, Route, Redirect } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SwitchInput from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
const electron = window.require('electron');
const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
  },
  chartContainer: {
    marginLeft: -22,
  },
  tableContainer: {
    height: 320,
  },
  h5: {
    marginBottom: theme.spacing.unit * 2,
  },
});

class HeaderBar extends React.Component{
  constructor(props) {
    super(props);
    this.db = PouchDataManager.localDB;
    this.companyEmail = electron.remote.getGlobal('companyEmail');
    this.state = {rooms:[]};
    this.refreshRoomList();
  }

  refreshRoomList = () => {
    this.db.get('rooms').then(function(doc) {
        if(doc.roomList) {
            this.setState({rooms:doc.roomList});
        }
    }.bind(this)).catch(function (err) {
        console.log(err);
    });
  }

  componentWillUpdate(nextProp){
      if(nextProp.selectedRoomId != null) {
          this.refreshRoomList();
      }
  }

  render() {
    const { classes } = this.props;
    return (
      <AppBar
        position="absolute"
        className={classNames(classes.appBar, this.props.open && classes.appBarShift)}
      >
        <Toolbar disableGutters={!this.props.open} className={classes.toolbar}>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={this.props.handleDrawerOpen}
            className={classNames(
              classes.menuButton,
              this.props.open && classes.menuButtonHidden,
            )}
          >
            <MenuIcon />
          </IconButton>
          <div className={classes.title}>
            {this.props.headerContent}
          </div>

          <div className={classes.title}>
            {this.companyEmail}
          </div>
          {this.props.selectedRoomId != null &&
          <Switch>
            <Route path='/control' render={(props) => <RoomSelectDropDown rooms={this.state.rooms} selectedRoomId={this.props.selectedRoomId} changeRoom={this.props.changeRoom}/>} />
            <Route path='/roomconfig' render={(props) => <RoomSelectDropDown rooms={this.state.rooms} selectedRoomId={this.props.selectedRoomId} changeRoom={this.props.changeRoom}/>} />
          </Switch>
          }
          <SwitchInput defaultChecked onChange={this.props.toggleTheme}/>
        </Toolbar>
      </AppBar>
    );
  }
}

HeaderBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HeaderBar);
