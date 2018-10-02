import React, { Component } from 'react';
import Box from 'grommet/components/Box';
import LockIcon from 'grommet/components/icons/base/Lock';
import ClearIcon from 'grommet/components/icons/base/Clear';
import Button from 'grommet/components/Button';
const electron = window.require('electron');


class ClueCountControl extends React.Component{
  constructor(props) {
    super(props);
    this.state = {clue1Used: false, clue2Used: false, clue3Used: false,};
    
  }

  getIconFromStatus = (isUsed) => {
    return isUsed? <ClearIcon size='xlarge'/> : <LockIcon size='xlarge'/>;
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
      <Box direction='row' justify='center'>
        <Button  icon={this.getIconFromStatus(this.state.clue1Used)} onClick={() => this.toggleIcon(1)} />
        <Button  icon={this.getIconFromStatus(this.state.clue2Used)} onClick={() => this.toggleIcon(2)} />
        <Button  icon={this.getIconFromStatus(this.state.clue3Used)} onClick={() => this.toggleIcon(3)} />
      </Box>
    );
  }
}

export default ClueCountControl;
