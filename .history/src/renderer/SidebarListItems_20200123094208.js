import React from 'react';
import { Link } from 'react-router-dom'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ControlIcon from '@material-ui/icons/SettingsRemote';
import MapIcon from '@material-ui/icons/Map';
import TimelineIcon from '@material-ui/icons/Timeline';
import SettingsIcon from '@material-ui/icons/Settings';
import AssignmentIcon from '@material-ui/icons/Assignment';

export const mainListItems = (
  <div>
    <ListItem button component={Link} to='/control'>
      <ListItemIcon>
        <ControlIcon />
      </ListItemIcon>
      <ListItemText primary="Control Screen" />
    </ListItem>
    <ListItem button component={Link} to='/roomconfig'>
      <ListItemIcon>
        <MapIcon />
      </ListItemIcon>
      <ListItemText primary="Configure Rooms" />
    </ListItem>
    {/*<ListItem button component={Link} to='/metrics'>
      <ListItemIcon>
        <TimelineIcon />
      </ListItemIcon>
      <ListItemText primary="Report Metrics" />
    </ListItem>
    <ListItem button component={Link} to='/settings'>
      <ListItemIcon>
        <SettingsIcon />
      </ListItemIcon>
      <ListItemText primary="Settings" />
</ListItem>*/}
  </div>
);

export const secondaryListItems = (
  <div>

  </div>
);