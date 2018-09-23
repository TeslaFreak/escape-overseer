import React, { Component } from 'react';
import TextInput from 'grommet/components/TextInput';
import Value from 'grommet/components/Value';
import Menu from 'grommet/components/Menu';
import Anchor from 'grommet/components/Anchor';
import Box from 'grommet/components/Box';
import CaretDownIcon from 'grommet/components/icons/base/CaretDown';
import PauseFillIcon from 'grommet/components/icons/base/PauseFill';
import LockIcon from 'grommet/components/icons/base/Lock';
import ClearIcon from 'grommet/components/icons/base/Clear';
import Button from 'grommet/components/Button';


class ClueCounter extends React.Component{
  constructor(props) {
    super(props);
    this.state = {icon1: <LockIcon size='xlarge'/>, icon2: <LockIcon size='xlarge'/>, icon3: <LockIcon size='xlarge'/>};
    
  }


  toggleIcon(iconToChange) {
    switch(iconToChange) {
      case 'icon1':
        if(this.state.icon1.type==LockIcon) {
          this.setState({icon1: <ClearIcon size='xlarge'/>});
        }
        else {
          this.setState({icon1: <LockIcon size='xlarge'/>});
        }
        return;
      case 'icon2':
        if(this.state.icon2.type==LockIcon) {
          this.setState({icon2: <ClearIcon size='xlarge'/>});
        }
        else {
          this.setState({icon2: <LockIcon size='xlarge'/>});
        }
        return;
      case 'icon3':
        if(this.state.icon3.type==LockIcon) {
          this.setState({icon3: <ClearIcon size='xlarge'/>});
        }
        else {
          this.setState({icon3: <LockIcon size='xlarge'/>});
        }
        return;
    }
  }

  render() {
    return (
      <Box direction='row' justify='center'>
        <Button  icon={this.state.icon1} onClick={() => this.toggleIcon('icon1')} />
        <Button  icon={this.state.icon2} onClick={() => this.toggleIcon('icon2')} />
        <Button  icon={this.state.icon3} onClick={() => this.toggleIcon('icon3')} />
      </Box>
    );
  }
}

export default ClueCounter;
