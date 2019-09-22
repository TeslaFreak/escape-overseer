import React, { Component } from 'react';
import Meter from 'grommet/components/Meter';
import TimeDisplay from '../components/TimeDisplay';
import ClueCountDisplay from '../components/ClueCountDisplay';
import ClueDisplay from '../components/ClueDisplay';
import classNames from 'classnames';
import { withStyles, withTheme } from '@material-ui/core/styles';
import Box from 'grommet/components/Box';
import PouchDB from 'pouchdb';
import { fabric } from 'fabric';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import { Grid } from '@material-ui/core';
const electron = window.require('electron')

const styles = theme => ({
  background: {
      height: '100vh',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover'
  },
  alwaysVisible: {
    paddingTop: '3%'
  },
  videoPlayer: {
    objectFit: 'contain',
    objectPosition: '50% 50%',
    height: '100vh',
    backgroundColor: 'black'
  }
});

class LiveScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { minutes: 60, seconds:0,
                    clue1Used: false, clue2Used: false, clue3Used: false,
                    clue: '',
                    playVideo: false,
                    selectedRoomId: null};

    document.documentElement.style.overflow = 'hidden';
    this.db = new PouchDB('kittens');
  }

  componentDidMount() {
    this.canvas = new fabric.Canvas("mainCanvas", {
      width: 1920, 
      height: 1080,
      selection: false,
      backgroundColor: '#fff',
      preserveObjectStacking: true,
      uniScaleTransform: true, });

      let editorContainer = document.getElementById('canvasInteractionLayer');
      let mainCanvas = document.getElementById('aspectPanel');
      this.canvas.setDimensions({
      width: '100%',
      height: '100%'
      },{
      cssOnly: true
      });
      editorContainer.tabIndex = 1000;
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.selectedRoomId != this.state.selectedRoomId) {
        this.loadJSON();
    }
  }

  loadJSON = async () => {
      this.db.get(this.props.selectedRoomId + '\\liveScreen').then(function(doc) {
          console.log(JSON.stringify(doc.canvasAspectRatio))
          this.updateAspectRatio(doc.canvasAspectRatio);
          setTimeout(function(){
              console.log('fired from loadJSON');
              window.dispatchEvent(new Event('resize'));
          }, 1);
          this.canvas.loadFromJSON(doc.canvasJSON,
          this.updateSelectedItem(null, CanvasItemTypes.SCREEN));
      }.bind(this)).catch(function (err) {
          console.log(err);
      }.bind(this))
  };

  playVideo = () => {
    this.setState({playVideo: true});
    return this.db.getAttachment(this.state.selectedRoomId + '\\breifVideo', 'breifVideoFile').then(function(blob) {
        var url = URL.createObjectURL(blob);
        var vidElement = document.getElementById('vid');
        vidElement.src = url;
    }).catch(function(err) {
        this.closeVideo();
    }.bind(this))
  }

  closeVideo = () => {
    this.setState({playVideo:false});
  }

  handleClose = () => {
    this.setState({ playVideo: false });
  };

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
    electron.ipcRenderer.on('updateSelectedRoomId', (event, selectedRoomId) => {
      this.setState({selectedRoomId: selectedRoomId});
      console.log(selectedRoomId);
    });

    return (
      <div id='backgroundDiv' className={classNames(classes.background)}>
            <canvas id= 'mainCanvas'>
            </canvas>
            <Dialog
                id='vidDialogue'
                fullScreen
                open={this.state.playVideo}
                onClose={this.handleClose}
            >
                <video className={classNames(classes.videoPlayer)} id='vid' controls={false} autoPlay={true} onEnded={this.closeVideo} style={this.state.playVideo ? {} : { display: 'none' }}/>
            </Dialog>
            </div>
    )
  }

  componentDidMount() {
    
  }

  componentWillUnmount() {
    
  }
}

export default withStyles(styles)(LiveScreen);
