import React, { Component } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
const electron = window.require('electron')
var WebFont = window.require('webfontloader');

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
        inputProps={{
          name: 'room',
          id: 'room-select',
        }}
      >
      <MenuItem value={null}><em>None</em></MenuItem>
      {this.props.rooms.map(room => (
        <MenuItem value={room._id}>{room.name}</MenuItem>
        ))}
      </Select>
    );
  }
}

export default RoomSelectDropDown;
