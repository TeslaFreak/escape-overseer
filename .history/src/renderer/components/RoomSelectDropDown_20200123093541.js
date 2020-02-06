import React, { Component } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles, withTheme } from '@material-ui/core/styles';
const electron = window.require('electron')
var WebFont = window.require('webfontloader');

const darkBlue = '#263238';
const babyBlue = '#29b6f6';
const babyBlue_1HueDarker = '#0086c3';
const blueGrey = '#546e7a';

const styles = theme => ({
    select: {
        color: babyBlue,
        '&:before': {
            borderColor: '#c2c2c2',
        },
        '&:after': {
            borderColor: '#c2c2c2',
        }
    },
    icon: {
        fill: babyBlue_1HueDarker,
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
    const { classes } = this.props;
    return (
        <Select
        value={this.props.selectedRoomId}
        onChange={this.handleRoomChange}
        color='secondary'
        MenuProps= {{
            anchorOrigin:{
                vertical: 'bottom',
                horizontal: 'right',
            },
            transformOrigin:{
                vertical: 'top',
                horizontal: 'right',
            }
        }}
        inputProps={{
            name: 'room',
            id: 'room-select',
            classes: {
                icon: classes.icon,
            }
            }}
        className={classes.select}
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
