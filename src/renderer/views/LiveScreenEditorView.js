import React, { Component } from 'react';
import TextNavPanel from '../components/LiveViewEditor/NavPanels/TextNavPanel.js';
import ImageNavPanel from '../components/LiveViewEditor/NavPanels/TextNavPanel.js';
import IconNavPanel from '../components/LiveViewEditor/NavPanels/TextNavPanel.js';
import TypeEditPanel from '../components/LiveViewEditor/EditPanels/TypeEditPanel.js';
import ColorEditPanel from '../components/LiveViewEditor/EditPanels/TypeEditPanel.js';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PouchDB from 'pouchdb';
import { withStyles, withTheme } from '@material-ui/core/styles';
import classNames from 'classnames';
import Dialog from '@material-ui/core/Dialog';
import FontPicker from 'font-picker-react';
import ChromePicker from 'react-color';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import TextFieldIcon from '@material-ui/icons/TextFields';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import StarIcon from '@material-ui/icons/Star';
import TimerIcon from '@material-ui/icons/Timer';
import TextIcon from '@material-ui/icons/Title';
import ColorIcon from '@material-ui/icons/ColorLens';
import ClueIcon from '@material-ui/icons/Lock';
import AddClueIcon from '@material-ui/icons/EnhancedEncryption';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import LiveScreenPreview from './LiveScreenPreview';
import { MuiThemeProvider } from '@material-ui/core/styles';
import {EOTheme} from '../EscapeOverseerTheme';
import { fabric } from 'fabric';
import AddNewItemMenu from '../components/LiveViewEditor/AddNewItemMenu.js';
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
    editorContainer: {
        width: '100%',
        height: `calc(100vh - ${appbarHeight}px)`
    },
    centeredAspectPanel: {
        width: `calc(${containerWidth} * ${aspectWidthRatio} )`,
        height: `calc(${containerWidth} * ${aspectHeightRatio} )`,
        margin: '100px 70px',
    },
    editingSurface: {
        backgroundColor: '#fff',
        height: '100%',
        width: '100%',
        
    },
    editingBackground: {
        backgroundColor: '#ededed',
        height: '100%',
        width: `calc(100% - 280px - 80px)`
    },
    editPanel: {
        width: '280px',
        height: '100%',
        backgroundColor: '#35414c',
        padding: '28px 28px 0',
    },
    navigationPanel: {
        width: '80px',
        height: '100%',
        backgroundColor: '#242c33'
    },
    navPanelAddButton: {
        color: '#fff',
        backgroundColor: '#9aa6af',
        borderRadius: '50%',
        margin: '0',
        width: '40px',
        height: '40px',
        opacity: '.8',
        top: 0,
        left: 0,
        transition: 'all .15s',
        '&:hover': {
            opacity: '1',
        },
    },
    navPanelAddButtonActive: {
        color: '#fff',
        backgroundColor: '#9aa6af',
        borderRadius: '50%',
        margin: '0',
        width: '40px',
        height: '40px',
        top: 0,
        left: 0,
        transition: 'all .15s',
        transform: 'rotate(-45deg)',
        opacity: '1 !important',
    },
    navPanelAddRegion: {
        transition: 'all .15s',
        width: '80px',
        margin: '20px 0 0',
        color: '#fff',
        fontSize: '11px',
        fontWeight: '400',
        opacity: '.8',
        textTransform: 'uppercase',
        backgroundSize: '22px 22px',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top',
        boxSizing: 'border-box',
        borderRadius: '0',
        '&:hover': {
            opacity: 1,
            backgroundColor: 'transparent',
        },
        
    },
    navPanelAddRegionActive: {
        transition: 'all .15s',
        width: '80px',
        margin: '20px 0 0',
        color: '#fff',
        fontSize: '11px',
        fontWeight: '400',
        textTransform: 'uppercase',
        backgroundSize: '22px 22px',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top',
        boxSizing: 'border-box',
        borderRadius: '0',
        opacity: 1,
        backgroundColor: 'transparent',
    },

});

const defaultCanvasOption = {
    preserveObjectStacking: true,
    width: '100%',
    height: '100%',
    selection: true,
    defaultCursor: 'default',
    backgroundColor: '#fff',
};

const defaultWorkareaOption = {
    width: 600,
    height: 400,
    workareaWidth: 600,
    workareaHeight: 400,
    lockScalingX: true,
    lockScalingY: true,
    scaleX: 1,
    scaleY: 1,
    backgroundColor: '#fff',
    hasBorders: false,
    hasControls: false,
    selectable: false,
    lockMovementX: true,
    lockMovementY: true,
    hoverCursor: 'default',
    name: '',
    id: 'workarea',
    type: 'image',
    layout: 'fixed', // fixed, responsive, fullscreen
    link: {},
    tooltip: {
        enabled: false,
    },
};

class LiveScreenEditorView extends Component {

    constructor(props) {
        super(props);
        this.state={anchorEl: null, open: false};
        this.objects = [];
        this.db = new PouchDB('kittens');
        
    }

    componentDidUpdate(prevProps, prevState) {
        
    }

    componentDidMount() {
        this.canvas = new fabric.Canvas("main-canvas");
        this.canvas.setBackgroundColor(defaultCanvasOption.backgroundColor, this.canvas.renderAll.bind(this.canvas));
        this.canvas.renderAll();
    }

    handleOpenAddMenu = event => {
        if(Boolean(this.state.anchorEl)) {
            this.setState({ anchorEl: null});
        }
        else {
            this.setState({ anchorEl: event.currentTarget});
        }
        console.log("plz no");
      };
    
    handleCloseAddMenu = () => {
        this.setState({anchorEl: null });
        console.log("hit");
    };

    render() {
        const { anchorEl } = this.state;
        const { classes } = this.props;
        return(
            <Grid container direction='row' justify='flex-end' alignItems='stretch' spacing={0} className={classes.editorContainer}>
                <Grid item container direction='column' id='canvasInteractionLayer' justify='center' alignItems='flex-end' className={classes.editingBackground}>
                    <Grid item id='imageWrapper' className={classes.centeredAspectPanel}>
                        <canvas id= 'mainCanvas' className={classes.editingSurface}>
                        </canvas>
                    </Grid>
                </Grid>
                <Grid item direction='column' id='EditPanel' className={classes.editPanel}>
                    <TypeEditPanel />
                </Grid>
                <Grid item direction='column' id="NavPanel" className={classes.navigationPanel}>
                        <Grid id="AddContentRegion">
                            <IconButton id="AddContentButton" disableRipple className={Boolean(this.state.anchorEl) ? classes.navPanelAddRegionActive : classes.navPanelAddRegion} onClick={this.handleOpenAddMenu}>
                                <Grid container direction='column'>
                                    <Grid item>
                                        <AddIcon className={Boolean(this.state.anchorEl) ? classes.navPanelAddButtonActive : classes.navPanelAddButton}/>
                                        <Popover 
                                            id='AddMenuPopover'
                                            anchorOrigin={{
                                                vertical: 'center',
                                                horizontal: 'left',
                                            }}
                                            transformOrigin={{
                                                vertical: 'center',
                                                horizontal: 'right',
                                            }}
                                            anchorEl={anchorEl}
                                            open={Boolean(this.state.anchorEl)}>
                                                <AddNewItemMenu />
                                        </Popover>
                                    </Grid>
                                    <Grid item>
                                        Add
                                    </Grid>
                                </Grid>
                            </IconButton>
                        </Grid>
                    <Grid id="NavPanelTabsWrapper">
                        <TextNavPanel />
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default  withStyles(styles)(LiveScreenEditorView)