import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PouchDB from 'pouchdb';
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
        this.state={showimage: false, anchorEl: null, activeFont: 'Open Sans', activeColor: '#fff', savedColor: '#fff'};
        this.db = new PouchDB('kittens');
        this.backgroundInput = React.createRef();
        
    }

    componentDidMount() {
        this.setFont();
        this.setTextColor();
    }

    setFont() {
        this.db.get('liveViewFont').then(function(doc) {
            WebFont.load({
            google: { 
                    families: [doc.font] 
                } 
            });
            this.setState({activeFont:doc.font});
        }.bind(this)).catch(function (err) {
            console.log(err);
        })
    }

    setTextColor() {
        this.db.get('liveViewTextColor').then(function(doc) {
            this.setState({activeColor:doc.color, savedColor:doc.color});
        }.bind(this)).catch(function (err) {
            console.log(err);
        })
    }

    saveImage = () => {
        var file = this.backgroundInput.current.files[0];
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
        }).catch(function(err) {
            if(err.name=="not_found") {
                db.put({
                    _id: 'backgroundImg',
                    _attachments: {
                        'backgroundImgFile': {
                        type: file.type,
                        data: file
                  }
                }
              })
            };
        });
        
    }

    saveVideo = () => {
  
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
        var db = this.db;
        var state = this.state;

        db.get('liveViewTextColor').then(function (doc) {
            doc.color=savedColor;
            db.put(doc).catch(function (err) {
                console.log(err);
            });
        }).catch(function (err) {
            if(err.name=="not_found") {
                db.put({
                    _id: 'liveViewTextColor',
                    color: savedColor,
                  }).catch(function (err) {
                    console.log(err);
                  });
            }
        });
        this.closeColorPicker();
    }

    revertColor = () => {
        this.setState({activeColor: this.state.savedColor});
        this.closeColorPicker();
    }

    render() {
        const { anchorEl } = this.state;
        return(
            <Grid container direction='column' justify='flex-start' alignItems='stretch' spacing={16} style={{padding:30}}>
                <Grid container direction='row' justify='center' alignItems='center' spacing={16} style={{padding:30}}>
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
                        <Button onClick={this.saveVideo} style={{margin:16}}>Clear Background Image</Button>
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
                    <LiveScreenPreview fontColor={this.state.activeColor} font={this.state.activeFont}/>
                </Grid>
            </Grid>
        );
    }
}

export default  withStyles(styles)(LiveScreenConfigView)