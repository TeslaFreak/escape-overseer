import React, { Component } from 'react';
import LockIcon from '@material-ui/icons/Lock';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
const electron = window.require('electron');


class VisualClueCountControl extends React.Component{
  constructor(props) {
    super(props);
    this.state = {clue1Used: false, clue2Used: false, clue3Used: false,};
    
  }

  getIconFromStatus = (isUsed) => {
    return isUsed? <ClearIcon style={{width:120, height:'100%'}}/> : <LockIcon style={{width:120, height:'100%'}}/>;
  }

  componentWillUpdate(nextProps){
    if(nextProps.numberOfClues !== this.props.numberOfClues){
        this.setState({usedStatus: new Array(nextProps.numberOfClues).fill(false)});
    }
  }

  componentDidUpdate() {
    electron.ipcRenderer.send('updateLiveViewClueCountDisplay', this.state.clue1Used, this.state.clue2Used, this.state.clue3Used);
  }

  toggleIcon(clueNumber) {
    let updatedArray = this.state.usedStatus;
    updatedArray[clueNumber] = !updatedArray[clueNumber];
    this.setState({usedStatus: updatedArray});
  }

  render() {
    return (
      <Grid container direction='row' justify='center'>
        {this.state.usedStatus.map((item, index) => (
            <IconButton  onClick={() => this.toggleIcon(index)}> {this.getIconFromStatus(item)} </IconButton>
        ))}
      </Grid>
    );
  }
}

export default VisualClueCountControl;
