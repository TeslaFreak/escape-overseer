import React, { Component } from 'react';
import LockIcon from '@material-ui/icons/Lock';
import ClearIcon from '@material-ui/icons/Clear';
import Box from 'grommet/components/Box';
const electron = window.require('electron');

class ClueCountDisplay extends React.Component{
  constructor(props) {
    super(props);
  }

  getIconFromStatus = (isUsed) => {
    return isUsed? <ClearIcon style={{width:120, height:'100%'}}/> : <LockIcon style={{width:120, height:'100%'}}/>;
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
