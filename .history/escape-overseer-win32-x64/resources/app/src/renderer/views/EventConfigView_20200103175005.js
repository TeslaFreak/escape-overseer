import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PouchDataManager from '../PouchDataManager';
import { withStyles, withTheme } from '@material-ui/core/styles';
import classNames from 'classnames';
import Dialog from '@material-ui/core/Dialog';
import FontPicker from 'font-picker-react';
import ChromePicker from 'react-color';
import Grid from '@material-ui/core/Grid';
import LiveView from './LiveView';
const electron = window.require('electron')

//google fonts API Key: AIzaSyDipkbeiVIwQoDKHnvmFCFQ1EoFW1_jw9E

const styles = theme => ({
    videoPlayer: {
        objectFit: 'contain',
        objectPosition: '50% 50%',
        height: '100vh'
    }
});
class RoomConfigView extends Component {

    constructor(props) {
        super(props);
        this.state={showimage: false, playVideo:false, activeFont: 'Open Sans', activeColor: '#fff'};
        this.db = PouchDataManager.localDB;
        this.fileInput = React.createRef();
        
    }

    componentDidMount() {
        //document.getElementById('vid').addEventListener('ended',this.closeVideo,false);
        
      }

      closeVideo = () => {
        console.log("video Ended");
        this.setState({playVideo:false});
    }

    addDoc = () => {
        var doc = {
            "_id": "mittens",
            "name": "Mittens",
            "occupation": "kitten",
            "age": 3,
            "hobbies": [
              "playing with balls of yarn",
              "chasing laser pointers",
              "lookin' hell cute"
            ]
          };
          this.db.put(doc);
    }
  
    printDoc = () => {
        this.db.get('mittens').then(function (doc) {
            console.log(doc);
          });
    }

    saveImage = () => {
  
        var input = document.querySelector('input');
        var file = this.fileInput.current.files[0];
        var db = this.db;

        db.get('backgroundImg').then(function (doc) {
            db.remove(doc).then(function () {
                db.put({
                    _id: 'backgroundImg',
                    _attachments: {
                        'backgroundImgFile': {
                        type: file.type,
                        data: file
                      }
                    }
                  }).catch(function (err) {
                    console.log(err);
                  });
            });
        });
        
    }

    saveVideo = () => {
  
        var input = document.querySelector('input');
        var file = this.fileInput.current.files[0];
        var db = this.db;

        db.get('breifVideo').then(function (doc) {
            db.remove(doc).then(function () {
                db.put({
                    _id: 'breifVideo',
                    _attachments: {
                        'breifVideoFile': {
                        type: file.type,
                        data: file
                      }
                    }
                  }).catch(function (err) {
                    console.log(err);
                  });
            });
        });
    }

    displayImage = () => {
  
        return this.db.getAttachment('backgroundImg', 'backgroundImgFile').then(function(blob) {
            var url = URL.createObjectURL(blob);
            //var img = document.createElement('img');
            //img.src = url;
            
            document.getElementById('logo').src=url;
        })
    }
    
    playVideo = () => {
        this.setState({playVideo: true});
        return this.db.getAttachment('breifVideo', 'breifVideoFile').then(function(blob) {
            var url = URL.createObjectURL(blob);
            var vidElement = document.getElementById('vid');
            vidElement.src = url;
        })
    }

    handleClose = () => {
        this.setState({ playVideo: false });
      };
    
    startRoomSequence = () => {
        electron.ipcRenderer.send("playVideoFullscreen");
      }

    updateLiveViewTypeFace = (nextFont) => {
        this.setState({ activeFont: nextFont.family });
        var db = this.db;

        db.get('liveViewFont').then(function (doc) {
            doc.font=nextFont.family;
            db.put(doc).catch(function (err) {
                console.log(err);
            });
        }).catch(function (err) {
            if(err.name=="not_found") {
                db.put({
                    _id: 'liveViewFont',
                    font: nextFont.family
                  }).catch(function (err) {
                    console.log(err);
                  });
            }
        });
    }

    adjustColor = (color) => {
        this.setState({activeColor: color.hex});
    }

    render() {
        const { classes } = this.props;
        return(
            <Grid container direction='row' justify='center' alignItems='center' style={{padding:30}}>
            <Typography>Select Intro Video File</Typography>
            <input id='input' type="file" ref={this.fileInput} />
            <Button onClick={this.saveImage}>save image</Button>
            <Button onClick={this.saveVideo}>save video</Button>
            <Button onClick={this.addDoc}>addDoc</Button>
            <Button onClick={this.printDoc}>printDoc</Button>
            <Button onClick={this.displayImage}>display image</Button>
            <Button onClick={this.playVideo}>play video</Button>
            <FontPicker
                apiKey="AIzaSyDipkbeiVIwQoDKHnvmFCFQ1EoFW1_jw9E"
                activeFont={this.state.activeFont}
                options={{limit:100}}
                onChange={nextFont => this.updateLiveViewTypeFace(nextFont)}
            />
            <ChromePicker color={this.state.activeColor} disableAlpha={true} onChange={this.adjustColor}/>
            <p className="apply-font" style={{color:this.state.activeColor}}>
                The font will be applied to this text.
            </p>

            <img id='logo' width="100" height="50" />
            <Dialog
                id='vidDialogue'
                fullScreen
                open={this.state.playVideo}
                onClose={this.handleClose}
            >
                <video className={classNames(classes.videoPlayer)} id='vid' aspectRcontrols={false} autoPlay={true} onEnded={this.closeVideo} style={this.state.playVideo ? {} : { display: 'none' }}/>
            </Dialog>
            </Grid>
        );
    }
}

export default  withStyles(styles)(RoomConfigView)