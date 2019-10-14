import React, { Component } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles, withTheme } from '@material-ui/core/styles';
const electron = window.require('electron')
var WebFont = window.require('webfontloader');


const styles = theme => ({
    closedMenu: {
        color: '#29b6f6',
        palette: {
            type: 'dark',
            primary: {
              main: darkBlue,
              contrastText: babyBlue,
            },
            secondary: {
              main: babyBlue_1HueDarker,
              contrastText: darkBlue,
            },
            text: {
              primary: babyBlue,
              secondary: babyBlue_1HueDarker,
            },
            action: {
              active: babyBlue_1HueDarker,
            },
          },
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
        <MuiThemeProvider theme={EODarkTheme}>
        <Select
        value={this.props.selectedRoomId}
        onChange={this.handleRoomChange}
        color='secondary'
        inputProps={{
          name: 'room',
          id: 'room-select',
        }}
        className={classes.closedMenu}
      >
      <MenuItem value={null}><em>None</em></MenuItem>
      {this.props.rooms.map(room => (
        <MenuItem value={room._id}>{room.name}</MenuItem>
        ))}
      </Select>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(RoomSelectDropDown);
