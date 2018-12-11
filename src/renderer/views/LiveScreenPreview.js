import React, { Component } from 'react';
import Meter from 'grommet/components/Meter';
import TimeDisplay from '../components/TimeDisplay';
import ClueCountDisplay from '../components/ClueCountDisplay';
import ClueDisplay from '../components/ClueDisplay';
import classNames from 'classnames';
import { withStyles, withTheme } from '@material-ui/core/styles';
import Box from 'grommet/components/Box';
import Image from '../../../assets/images/background.png';
import PouchDB from 'pouchdb';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import { Grid } from '@material-ui/core';
const electron = window.require('electron')

const styles = theme => ({
  background: {
      width: '100%',
      height: '56.25%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundColor: 'white'
  },
  alwaysVisible: {
    paddingTop: '3%'
  }
});

class LiveScreenPreview extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { minutes: 58, seconds:47,
                    clue: 'There seems to be something peculiar about that bench in the corner of the room'};

    this.db = new PouchDB('kittens');
    this.updateBackgroundImage();
  }

  componentDidUpdate() {
    if(this.props.updateBackground == true) {
      this.updateBackgroundImage();
      this.props.backgroundUpdated();
    }
  }

  updateBackgroundImage() {
    this.db.getAttachment('backgroundImg', 'backgroundImgFile').then(function(blob) {
      var url = URL.createObjectURL(blob);
      var backgroundDiv = document.getElementById('backgroundDiv');
      backgroundDiv.style.backgroundImage= 'url('+ url +') ';
    }).catch(function (err) {
      if(err.name == 'not_found') {
        var backgroundDiv = document.getElementById('backgroundDiv');
        backgroundDiv.style.backgroundImage= null;
      }
      else {
        console.log(err);
      }
    })
  }

  playVideo = () => {
    this.setState({playVideo: true});
    return this.db.getAttachment('breifVideo', 'breifVideoFile').then(function(blob) {
        var url = URL.createObjectURL(blob);
        var vidElement = document.getElementById('vid');
        vidElement.src = url;
    }).catch(function(err) {
        this.closeVideo();
    }.bind(this))
  }

  render() {
    const { classes } = this.props;
    electron.ipcRenderer.on('updateLiveViewTimeDisplay', (event, min, sec) => {
      this.setState({minutes: min, seconds: sec});
    });
    electron.ipcRenderer.on('updateLiveViewClueDisplay', (event, clue) => {
      this.setState({clue: clue});
    });
    electron.ipcRenderer.on('updateLiveViewClueCountDisplay', (event, clue1Used, clue2Used, clue3Used) => {
      this.setState({clue1Used: clue1Used, clue2Used: clue2Used, clue3Used: clue3Used});
    });
    electron.ipcRenderer.on('roomSequence', (event, sequenceNodeId) => {
      this.playVideo();
    });

    return (
      <div id='backgroundDiv' className={classNames(classes.background)}>
          <Grid  container  direction='column' 
              justify='flex-start'
              alignItems='center'>
              <Grid className={classNames(classes.alwaysVisible)}>
            <ClueCountDisplay preview activeColor={this.props.fontColor} clue1Used={true} clue2Used={false} clue3Used={false} />
            <Meter
              label = {<TimeDisplay fontColor={this.props.fontColor} font={this.props.font} minutes={this.state.minutes} seconds={this.state.seconds} />}
              value = {this.state.minutes*60+this.state.seconds}
              type='circle'
              max={3600}
              size='medium' />
            </Grid>
            <ClueDisplay preview fontColor={this.props.fontColor} font={this.props.font} clue={this.state.clue} />
            </Grid>
            </div>
    )
  }

  
}

export default withStyles(styles)(LiveScreenPreview);
