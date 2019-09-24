import React, { Component } from 'react';
import LockIcon from '@material-ui/icons/Lock';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
const electron = window.require('electron');


class ClueCountControl extends React.Component{
  constructor(props) {
    super(props);
    this.state = {clue1Used: false, clue2Used: false, clue3Used: false,};
    
  }

  getIconFromStatus = (isUsed) => {
    return isUsed? <ClearIcon style={{width:120, height:'100%'}}/> : <LockIcon style={{width:120, height:'100%'}}/>;
  }

  componentDidUpdate() {
    electron.ipcRenderer.send('updateLiveViewClueCountDisplay', this.state.clue1Used, this.state.clue2Used, this.state.clue3Used);
  }

  toggleIcon(clueNumber) {
    switch(clueNumber) {
      case 1:
        this.setState({clue1Used: !this.state.clue1Used});
        return;
      case 2:
        this.setState({clue2Used: !this.state.clue2Used});
        return;
      case 3:
        this.setState({clue3Used: !this.state.clue3Used});
        return;
    }
  }

  render() {
    return (
      <Grid container direction='row' justify='center'>
        <IconButton  onClick={() => this.toggleIcon(1)}> {this.getIconFromStatus(this.state.clue1Used)} </IconButton>
        <IconButton  onClick={() => this.toggleIcon(2)}> {this.getIconFromStatus(this.state.clue2Used)} </IconButton>
        <IconButton  onClick={() => this.toggleIcon(3)}> {this.getIconFromStatus(this.state.clue3Used)} </IconButton>
      </Grid>
    );
  }
}

export default ClueCountControl;
