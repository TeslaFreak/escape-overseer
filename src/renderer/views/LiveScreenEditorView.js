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
import { fabric } from 'fabric';
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
    sidePanel: {
        width: '280px',
        height: '100%',
        backgroundColor: '#35414c',
    },
    navigationPanel: {
        width: '80px',
        height: '100%',
        backgroundColor: '#242c33'
    }
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
        this.state={};
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

    render() {
        const { classes } = this.props;
        return(
            <Grid container direction='row' justify='flex-end' alignItems='stretch' spacing={0} className={classes.editorContainer}>
                <Grid item container direction='column' id='canvasInteractionLayer' justify='center' alignItems='flex-end' className={classes.editingBackground}>
                    <Grid item id='imageWrapper' className={classes.centeredAspectPanel}>
                        <canvas id= 'mainCanvas' className={classes.editingSurface}>
                        </canvas>
                    </Grid>
                </Grid>
                <Grid item direction='column'>
                    <div id='sidePanel' className={classes.sidePanel}>
                    </div>
                </Grid>
                <Grid item direction='column' id="navigationPanel" className={classes.navigationPanel}>
                    <div id="AddContentRegion" class=" post-component post-panel">
                        <div id="AddContentButton" class="post-component circle-button post-button post-icon-button">
                            <label data-i18n="components.buttons.kAdd">ADD</label>
                        </div>
                    </div>
                    <div id="NavPanelTabsWrapper" class=" post-component">
                        
                    </div>
                </Grid>
            </Grid>
        );
    }
}

export default  withStyles(styles)(LiveScreenEditorView)