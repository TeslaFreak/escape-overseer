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

class ButtonRow extends React.Component{
  constructor(props) {
    super(props);
    
    this.state = {isFull: false, showWindowPortal: false};
    this.liveScreenWindow = null;
  }

  toggleWindowPortal = () => {
    this.setState({showWindowPortal: !this.state.showWindowPortal});
  }

  toggleFullscreen = () => {
    this.setState({isFull: !this.state.isFull});
  }

  createWindow = () => {
    let win = new BrowserWindow({width: 800, height: 600});
    const startUrl = process.env.ELECTRON_START_URL || url.format({
      pathname: path.join(__dirname, '/../build/liveScreenIndex.html'),
      protocol: 'file:',
      slashes: true
    });
    win.loadURL(startUrl);
    win.webContents.openDevTools();
  }

  render() {
    return (
      <Box direction='row' justify='center'>
        <Button  label='Start Room Sequence' onClick={this.toggleFullscreen} />
        <Button  label='Open Live Screen' onClick={this.createWindow} />
  
      </Box>

    );
  }
}

export default ButtonRow;
