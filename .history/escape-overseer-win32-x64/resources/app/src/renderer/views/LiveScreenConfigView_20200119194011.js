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
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import LiveScreenPreview from './LiveScreenPreview';
import { MuiThemeProvider } from '@material-ui/core/styles';
import {EOTheme} from '../EscapeOverseerTheme';
var WebFont = window.require('webfontloader');
const electron = window.require('electron');
const uuidv4 = require('uuid/v4');

//google fonts API Key: AIzaSyDipkbeiVIwQoDKHnvmFCFQ1EoFW1_jw9E

const styles = theme => ({
    videoPlayer: {
        objectFit: 'contain',
        objectPosition: '50% 50%',
        height: '100vh'
    }
});
class LiveScreenConfigView extends Component {

    constructor(props) {
        super(props);
        this.state={showimage: false, anchorEl: null, updateBackground: false, activeFont: 'Roboto', activeColor: '#000', savedColor: '#000'};
        this.db = PouchDataManager.localDB;
        this.backgroundInput = React.createRef();
        this.videoInput = React.createRef();
        
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.selectedRoomId != this.props.selectedRoomId) {
            this.setFont();
            this.setTextColor();
            this.beginBackgroundUpdate();
        }
    }

    componentDidMount() {
        this.setFont();
        this.setTextColor();
    }

    setFont() {
        this.db.get(this.props.selectedRoomId + '\\liveViewFont').then(function(doc) {
            WebFont.load({
            google: { 
                    families: [doc.font] 
                } 
            });
            this.setState({activeFont:doc.font});
        }.bind(this)).catch(function (err) {
            this.setState({activeFont: 'Roboto'});
            console.log(err);
        }.bind(this))
    }

    setTextColor() {
        this.db.get(this.props.selectedRoomId + '\\liveViewTextColor').then(function(doc) {
            this.setState({activeColor:doc.color, savedColor:doc.color});
        }.bind(this)).catch(function (err) {
            this.setState({activeColor: '#000', savedColor: '#000'});
            console.log(err);
        }.bind(this))
    }

    saveImage = () => {
        var file = this.backgroundInput.current.files[0];
        
        this.db.get(this.props.selectedRoomId + '\\backgroundImg').then(function (doc) {
            this.db.remove(doc).then(function () {
                this.db.put({
                    _id: this.props.selectedRoomId + '\\backgroundImg',
                    _attachments: {
                        'backgroundImgFile': {
                        type: file.type,
                        data: file
                      }
                    }
                  }).then(function() {
                      this.beginBackgroundUpdate();
                  }.bind(this)).catch(function (err) {
                    console.log(err);
                  });
            }.bind(this));
        }.bind(this)).catch(function(err) {
            if(err.name=="not_found") {
                this.db.put({
                    _id: this.props.selectedRoomId + '\\backgroundImg',
                    _attachments: {
                        'backgroundImgFile': {
                        type: file.type,
                        data: file
                  }
                }
              }).then(function() {
                this.beginBackgroundUpdate();
            }.bind(this)).catch(function (err) {
              console.log(err);
            });
            };
        }.bind(this));
        
    }

    clearImage = () => {
        this.db.get(this.props.selectedRoomId + '\\backgroundImg').then(function (doc) {
            this.db.remove(doc).then(function() {
                this.beginBackgroundUpdate();
            }.bind(this)).catch(function (err) {
                    console.log(err);
                  });
        }.bind(this)).catch(function(err) {
            console.log(err)
        });
    }

    saveVideo = () => {
  
        var file = this.videoInput.current.files[0];

        this.db.get(this.props.selectedRoomId + '\\breifVideo').then(function (doc) {
            this.db.remove(doc).then(function () {
                this.db.put({
                    _id: this.props.selectedRoomId + '\\breifVideo',
                    _attachments: {
                        'breifVideoFile': {
                        type: file.type,
                        data: file
                      }
                    }
                  }).catch(function (err) {
                    console.log(err);
                  });
            }.bind(this));
        }.bind(this)).catch(function(err) {
            if(err.name == 'not_found') {
                this.db.put({
                    _id: this.props.selectedRoomId + '\\breifVideo',
                    _attachments: {
                        'breifVideoFile': {
                        type: file.type,
                        data: file
                      }
                    }
                  }).catch(function (err) {
                    console.log(err);
                  });
            }
        }.bind(this));
    }

    clearVideo = () => {
        this.db.get(this.props.selectedRoomId + '\\breifVideo').then(function (doc) {
            this.db.remove(doc).catch(function (err) {
                    console.log(err);
                  });
        }.bind(this)).catch(function(err) {
            console.log(err)
        });
    }
    
    playVideo = () => {
        this.setState({playVideo: true});
        return this.db.getAttachment(this.props.selectedRoomId + '\\breifVideo', 'breifVideoFile').then(function(blob) {
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

        this.db.get(electron.remote.getGlobal('customerEmail') + '\\' + this.props.selectedRoomId + '\\liveViewFont').then(function (doc) {
            doc.font=nextFont.family;
            this.db.put(doc).catch(function (err) {
                console.log(err);
            });
        }.bind(this)).catch(function (err) {
            if(err.name=="not_found") {
                this.db.put({
                    _id: this.props.selectedRoomId + '\\liveViewFont',
                    font: nextFont.family
                  }).catch(function (err) {
                    console.log(err);
                  });
            }
        }.bind(this));
    }

    openColorPicker = event => {
        if(this.state.anchorEl == null) {
            this.setState({ anchorEl: event.currentTarget});
        }
        else {
            this.setState({ anchorEl: null});
        }
            
    }

    closeColorPicker = () => {
        this.setState({ anchorEl: null });
    };

    adjustColor = (color) => {
        this.setState({activeColor: color.hex});
    }

    saveColor = () => {
        this.setState({savedColor: this.state.activeColor});
        var savedColor = this.state.activeColor;

        this.db.get(electron.remote.getGlobal('customerEmail') + '\\' + this.props.selectedRoomId + '\\liveViewTextColor').then(function (doc) {
            doc.color=savedColor;
            this.db.put(doc).catch(function (err) {
                console.log(err);
            });
        }.bind(this)).catch(function (err) {
            if(err.name=="not_found") {
                this.db.put({
                    _id: this.props.selectedRoomId + '\\liveViewTextColor',
                    color: savedColor,
                  }).catch(function (err) {
                    console.log(err);
                  });
            }
        }.bind(this));
        this.closeColorPicker();
    }

    revertColor = () => {
        this.setState({activeColor: this.state.savedColor});
        this.closeColorPicker();
    }

    beginBackgroundUpdate = () => {
        this.setState({updateBackground: true});
    }

    endBackgroundUpdate = () => {
        this.setState({updateBackground: false});
    }

    render() {
        const { anchorEl } = this.state;
        return(
            <Grid container direction='column' justify='flex-start' alignItems='stretch' spacing={16} style={{padding:30}}>
                <Grid container direction='row' justify='center' alignItems='center' spacing={16} style={{padding:30}}>
                        <input
                            accept="video/*"
                            style={{ display: 'none' }}
                            id="video-input"
                            multiple
                            type="file"
                            onChange={this.saveVideo}
                            ref={this.videoInput}
                        />
                        <label htmlFor="video-input">
                        <Button component="span" style={{margin:16}}>
                            Upload Intro Video
                        </Button>
                        </label>
                        <Button onClick={this.clearVideo} style={{margin:16}}>Clear Intro Video</Button>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="background-input"
                            multiple
                            type="file"
                            onChange={this.saveImage}
                            ref={this.backgroundInput}
                        />
                        <label htmlFor="background-input">
                        <Button component="span" style={{margin:16}}>
                            Set Background Image
                        </Button>
                        </label>
                        <Button onClick={this.clearImage} style={{margin:16}}>Clear Background Image</Button>
                        <Button onClick={this.openColorPicker} style={{margin:16}}>Set Font Color</Button>
                        <Popper
                            open={Boolean(anchorEl)} anchorEl={anchorEl}
                            placement="bottom"
                        >
                            <ClickAwayListener onClickAway={this.openColorPicker}>
                                <Paper color="primary">
                                    <ChromePicker color={this.state.activeColor} disableAlpha={true} onChange={this.adjustColor}/>
                                    <Grid container>
                                        <Grid item xs>
                                            <Button fullWidth variant="contained" color="primary" onClick={this.saveColor}>Save</Button>
                                        </Grid>
                                        <Grid item xs>
                                            <Button fullWidth variant="contained" color="primary" onClick={this.revertColor}>Cancel</Button>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </ClickAwayListener>
                        </Popper>
                        <div style={{margin:16}}>
                        <FontPicker
                            apiKey="AIzaSyDipkbeiVIwQoDKHnvmFCFQ1EoFW1_jw9E"
                            activeFont={this.state.activeFont}
                            options={{limit:100}}
                            onChange={nextFont => this.updateLiveViewTypeFace(nextFont)}
                        />
                        </div>
                </Grid>
                <Grid item>
                    <LiveScreenPreview updateBackground={this.state.updateBackground} endBackgroundUpdate={this.endBackgroundUpdate} fontColor={this.state.activeColor} font={this.state.activeFont} selectedRoomId={this.props.selectedRoomId}/>
                    <Typography style={{textAlign: 'flex-start', margin:12}}>*This preview may not match exactly to your actual live view depending on screen size.
                                                                                We recommend always running a final check from the control screen after editing</Typography>
                </Grid>
            </Grid>
        );
    }
}

export default  withStyles(styles)(LiveScreenConfigView)