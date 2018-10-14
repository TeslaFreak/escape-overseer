import React, { Component } from 'react';
import Box from 'grommet/components/Box';
import Button from '@material-ui/core/Button';
const electron = window.require('electron')

class LiveViewControl extends React.Component{
  constructor(props) {
    super(props);
    this.state={liveViewOpen:false}
  }

  toggleFullscreen = () => {
    electron.ipcRenderer.send("toggleLiveViewFullScreen");
  }

  createWindow = () => {
    electron.ipcRenderer.send("toggleLiveViewOpen");
    this.setState({liveViewOpen: !this.state.liveViewOpen});
  };

  render() {
    return (
      <Box direction='row' justify='center'>
        <Button variant="contained" color='secondary' onClick={this.toggleFullscreen} >Start Room Sequence</Button>
        <Button variant="contained" color='secondary' onClick={this.createWindow} >{this.state.liveViewOpen ? 'Close' : 'Open'} Live Screen</Button>
        <Button variant="contained" color='secondary' onClick={this.toggleFullscreen} >Make Full Screen</Button>
      </Box>
    );
  }
}

export default LiveViewControl;
