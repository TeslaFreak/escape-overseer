import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
const electron = window.require('electron');


class NumericClueCountControl extends React.Component{
  constructor(props) {
    super(props);
    this.state = {liveClueCount: this.props.numberOfClues};
    
  }

  componentWillUpdate(nextProps){
    if(nextProps.numberOfClues !== this.props.numberOfClues){
        console.log('update numeric counter')
        this.setState({liveClueCount: nextProps.numberOfClues});
    }
  }

  componentDidUpdate() {
    electron.ipcRenderer.send('updateLiveViewClueCountDisplay', this.state.liveClueCount);
  }

  handleChange = (event, value) => {
    this.setState({liveClueCount: value});
  }

  //TODO: style the number input to make it bigger and look more natural on the page
  render() {
    return (
      <Grid container direction='row' justify='center' alignItems='center'>
            <Typography>Number of Clues:</Typography>
            <TextField type="number" value={this.state.liveClueCount} onChange={(event) => this.handleChange(event, event.target.value)}/>
      </Grid>
    );
  }
}

export default NumericClueCountControl;
