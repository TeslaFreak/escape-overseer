import React, { Component } from 'react';
import TextInput from 'grommet/components/TextInput';
import Value from 'grommet/components/Value';
import Menu from 'grommet/components/Menu';
import Anchor from 'grommet/components/Anchor';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
const path = require('path');
const url = require('url');
const electron = window.require('electron')
const {BrowserWindow} = electron.remote.require('electron');

class LiveViewControl extends React.Component{
  constructor(props) {
    super(props);
  }

  toggleFullscreen = () => {
    electron.ipcRenderer.send("toggleLiveViewFullScreen");
  }

  createWindow = () => {
    electron.ipcRenderer.send("toggleLiveViewOpen");
  };

  render() {
    return (
      <Box direction='row' justify='center'>
        <Button  label='Start Room Sequence' onClick={this.toggleFullscreen} />
        <Button  label='Open Live Screen' onClick={this.createWindow} />
        <Button  label='Make Full Screen' onClick={this.toggleFullscreen} />
      </Box>
    );
  }
}

export default LiveViewControl;
