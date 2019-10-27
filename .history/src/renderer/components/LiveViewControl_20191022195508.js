import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Prompt } from 'react-router-dom'
const electron = window.require('electron')

class LiveViewControl extends React.Component{
  constructor(props) {
    super(props);
    this.state={liveViewOpen:false}
  }

  componentDidUpdate = (prevProps) => {
      if(this.props.selectedRoomId != prevProps.selectedRoomId) {
        this.updateLiveScreenSelectedRoom();
      }
  }

  startRoomSequence = () => {
    electron.ipcRenderer.send("roomSequence", 1);
  }

  updateLiveScreenSelectedRoom = () => {
    electron.ipcRenderer.send("updateLiveViewSelectedRoomId", this.props.selectedRoomId);
  }

  toggleFullscreen = () => {
    electron.ipcRenderer.send("toggleLiveViewFullScreen");
  }

  createWindow = () => {
    electron.ipcRenderer.send("toggleLiveViewOpen", this.props.selectedRoomId);
    this.setState({liveViewOpen: !this.state.liveViewOpen});
  };

  //TODO:[V1 Mandatory] add warning on page exit when game is in progress. If just changing rooms, throw warning only. 
  //if completely leaving control view, close live view and have that in the warning to user
  render() {
    electron.ipcRenderer.on('liveViewClosedManually', (event) => {
        this.setState({liveViewOpen:false})
    });
    return (
        <React.Fragment>
            <Prompt
                when={this.state.liveViewOpen}
                message="There is an active live screen open. Are you sure you want to leave?"
            />
            <Grid container direction='row' justify='center' alignItems='center' style={{padding:20}}>
            <Button variant="contained" color='secondary' onClick={this.startRoomSequence} >Start Room Sequence</Button>
            <Button variant="contained" color='secondary' onClick={this.createWindow} >{this.state.liveViewOpen ? 'Close' : 'Open'} Live Screen</Button>
            <Button variant="contained" color='secondary' onClick={this.toggleFullscreen} >Make Full Screen</Button>
            </Grid>
        </React.Fragment>
    );
  }
}

export default LiveViewControl;
