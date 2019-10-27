import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PouchDB from 'pouchdb';
import { withStyles, withTheme } from '@material-ui/core/styles';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import TextFieldIcon from '@material-ui/icons/TextFields';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import AddPhotoIcon from '@material-ui/icons/AddPhotoAlternate';
import AddTimer from '@material-ui/icons/AddAlarm';
import StarIcon from '@material-ui/icons/Star';
import TimerIcon from '@material-ui/icons/Timer';
import TextIcon from '@material-ui/icons/Title';
import ColorIcon from '@material-ui/icons/ColorLens';
import ClueIcon from '@material-ui/icons/Lock';
import AddClueIcon from '@material-ui/icons/EnhancedEncryption';
import AddClueTextIcon from '@material-ui/icons/SmsFailed';
import Popover from '@material-ui/core/Popover';
import { MuiThemeProvider } from '@material-ui/core/styles';
import {EOTheme} from '../../EscapeOverseerTheme';
import { fabric } from 'fabric';
import AddNewCounterSubMenu from './AddNewCounterSubMenu';
var WebFont = window.require('webfontloader');
const electron = window.require('electron');
const uuidv4 = require('uuid/v4');

const appbarHeight = 64;

const aspectRatio = 0.5625;
const aspectWidthRatio = 1;
const aspectHeightRatio = aspectRatio;
const containerWidth = `calc(100vw - 280px - 80px - 140px - 70px)`;
const containerHeight = `calc(100vh - ${appbarHeight}px - 200px)`;
const aspectWidth = containerWidth * aspectWidthRatio;
const aspectHeight = containerWidth * aspectHeightRatio;

//google fonts API Key: AIzaSyDipkbeiVIwQoDKHnvmFCFQ1EoFW1_jw9E

const styles = theme => ({
    AddMenu: {
        width: 'auto',
        height: '82px',
        backgroundColor: 'white',
    
    },
    AddMenuInnerButton: {
        width: '60px',
        height: '60px',
        margin: '11px 11px 11px 0',
        outline: 'none',
        color: '#535f68',
        fontSize: '11px',
        fontWeight: '500',
        background: 'none',
        cursor: 'pointer',
        border: '1px solid #e8ebed',
        borderRadius: '4px',
        padding: '10px 0',
        textTransform: 'none',
        lineHeight: '1.5',
        textRendering: 'optimizeLegibility',
    },
    AddMenuInnerButtonLeftMost: {
        width: '60px',
        height: '60px',
        margin: '11px',
        position: 'relative',
        outline: 'none',
        color: '#535f68',
        fontSize: '11px',
        fontWeight: '500',
        background: 'none',
        cursor: 'pointer',
        border: '1px solid #e8ebed',
        borderRadius: '4px',
        padding: '10px 0',
        textTransform: 'none',
        lineHeight: '1.5',
        textRendering: 'optimizeLegibility',
    }

});

class AddNewItemMenu extends Component {

    constructor(props) {
        super(props);
        this.state={anchorEl: null};
        this.objects = [];
        this.db = new PouchDB('kittens');
        
    }

    componentDidUpdate(prevProps, prevState) {
        
    }

    componentDidMount() {
        
    }

    handleOpenAddMenu = event => {
        if(Boolean(this.state.anchorEl)) {
            this.setState({ anchorEl: null});
        }
        else {
            this.setState({ anchorEl: event.currentTarget});
        }
    };


    //because material popups are fucking stupid and will
    //fire a background click no matter where you click on screen.
    stopprop = event => {
        event.stopPropagation();
        console.log("props stopped");
    }

    render() {
        const { classes } = this.props;
        const { CanvasItemTypes } = this.props;
        const { anchorEl } = this.state;
        return(
            <Grid container className={classes.AddMenu} onClick={this.stopprop}>
                <Grid item >
                    <Button id='AddNewTextItemButton' variant="outlined" disableRipple className={classes.AddMenuInnerButtonLeftMost}>
                        <Grid container direction='column' onClick={() => this.props.createNewCanvasItem(CanvasItemTypes.TEXT)}>
                            <Grid item>
                                <TextFieldIcon/>
                            </Grid>
                            <Grid item>
                                Text
                            </Grid>
                        </Grid>
                    </Button>
                </Grid>
                <Grid item >
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="image-input"
                        multiple
                        type="file"
                        onChange={(e) => this.props.createNewCanvasItem(CanvasItemTypes.IMAGE, e)}
                        ref={(ref) => this.fileInputRef = ref}
                        />
                    <label htmlFor="image-input">
                        <Button id='AddNewImageItemButton' variant="outlined" disableRipple className={classes.AddMenuInnerButton}>
                            <Grid container direction='column'  onClick={(e) => this.fileInputRef.click()}>
                                <Grid item>
                                    <InsertPhotoIcon/>
                                </Grid>
                                <Grid item>
                                    Image
                                </Grid>
                            </Grid>
                        </Button>
                    </label>
                </Grid>
                <Grid item >
                    <Button id='AddNewTimerItemButton' variant="outlined" disableRipple className={classes.AddMenuInnerButton}>
                        <Grid container direction='column' onClick={() => this.props.createNewCanvasItem(CanvasItemTypes.TIMER)}>
                            <Grid item>
                                <TimerIcon/>
                            </Grid>
                            <Grid item>
                                Timer
                            </Grid>
                        </Grid>
                    </Button>
                </Grid>
                <Grid item >
                    <Button id='AddNewClueCounterItemButton' variant="outlined" disableRipple className={classes.AddMenuInnerButton}>
                        <Grid container direction='column' onClick={this.handleOpenAddMenu}>
                            <Grid item>
                                <AddClueIcon/>
                            </Grid>
                            <Grid item>
                                Clue Count
                            </Grid>
                            <Popover 
                                id='CounterOptionsPopover'
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                                anchorEl={anchorEl}
                                open={Boolean(this.state.anchorEl)}>
                                    <AddNewCounterSubMenu createNewCanvasItem={this.props.createNewCanvasItem} CanvasItemTypes={CanvasItemTypes}/>
                            </Popover>
                        </Grid>
                    </Button>
                </Grid>
                <Grid item >
                    <Button id='AddNewClueDisplayItemButton' variant="outlined" disableRipple className={classes.AddMenuInnerButton}>
                        <Grid container direction='column' onClick={() => this.props.createNewCanvasItem(CanvasItemTypes.CLUEDISPLAY)}>
                            <Grid item>
                                <AddClueTextIcon/>
                            </Grid>
                            <Grid item>
                                Clue Text
                            </Grid>
                        </Grid>
                    </Button>
                </Grid>
            </Grid>
        );
    }
}

export default  withStyles(styles)(AddNewItemMenu)