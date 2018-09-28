import React, { Component } from 'react';
import LockIcon from 'grommet/components/icons/base/Lock';
import ClearIcon from 'grommet/components/icons/base/Clear';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
const electron = window.require('electron');

class ClueCountDisplay extends React.Component{
  constructor(props) {
    super(props);
  }

  getIconFromStatus = (isUsed) => {
    return isUsed? <ClearIcon size='xlarge'/> : <LockIcon size='xlarge'/>;
  }

  render() {
    return (
      <Box margin = 'medium' direction='row' justify='center'>
        <Box margin = 'small'>{this.getIconFromStatus(this.props.clue1Used)}</Box>
        <Box margin = 'small'>{this.getIconFromStatus(this.props.clue2Used)}</Box>
        <Box margin = 'small'>{this.getIconFromStatus(this.props.clue3Used)}</Box>
      </Box>
    );
  }
}

export default ClueCountDisplay;
