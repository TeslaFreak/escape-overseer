import React, { Component } from 'react';
import LiveScreen from './LiveScreen';
import TextInput from 'grommet/components/TextInput';
import Value from 'grommet/components/Value';
import Menu from 'grommet/components/Menu';
import Anchor from 'grommet/components/Anchor';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';


class ButtonRow extends React.Component{
  constructor(props) {
    super(props);
    
    this.state = {isFull: false, showWindowPortal: false};
  }

  toggleWindowPortal = () => {
    this.setState({showWindowPortal: !this.state.showWindowPortal});
  }

  toggleFullscreen = () => {
    this.setState({isFull: !this.state.isFull});
  }

  requestFullScreen = (elem) => {
    var requestMethod= elem.requestFullscreen 
    || elem.msRequestFullscreen 
    || elem.mozRequestFullScreen 
    || elem.webkitRequestFullscreen;

    if (requestMethod) { // Native full screen.
      requestMethod.call(elem);
    }
  }

  render() {
    return (
      <Box direction='row' justify='center'>
        <Button  label='Start Room Sequence' onClick={this.toggleFullscreen} />
        <Button  label='Open Live Screen' onClick={this.toggleWindowPortal} />
        {this.state.showWindowPortal && (
          <LiveScreen isFull={this.state.isFull}>
            <Box label= 'dinkleburg'>
              hello world
            </Box>
          </LiveScreen>
        )}
      </Box>

    );
  }
}

export default ButtonRow;
