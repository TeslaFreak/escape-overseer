import React, { Component } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles, withTheme } from '@material-ui/core/styles';
const electron = window.require('electron')
var WebFont = window.require('webfontloader');


const styles = theme => ({
    closedMenu: {
        color: '#0086c3',
    },
})

class RoomSelectDropDown extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  handleRoomChange = (event) => {
    this.props.changeRoom(event.target.value);
  }

  render() {
    return (
        <Select
        value={this.props.selectedRoomId}
        onChange={this.handleRoomChange}
        color='secondary'
        inputProps={{
          name: 'room',
          id: 'room-select',
        }}
        className={classNames.}
      >
      <MenuItem value={null}><em>None</em></MenuItem>
      {this.props.rooms.map(room => (
        <MenuItem value={room._id}>{room.name}</MenuItem>
        ))}
      </Select>
    );
  }
}

export default withStyles(styles)(RoomSelectDropDown);
