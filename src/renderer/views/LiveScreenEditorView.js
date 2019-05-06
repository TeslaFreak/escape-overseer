import React, { Component } from 'react';
import TextNavPanel from '../components/LiveViewEditor/NavPanels/TextNavPanel.js';
import ImageNavPanel from '../components/LiveViewEditor/NavPanels/ImageNavPanel.js';
import IconNavPanel from '../components/LiveViewEditor/NavPanels/IconNavPanel.js';
import ScreenNavPanel from '../components/LiveViewEditor/NavPanels/ScreenNavPanel.js';
import TypeEditPanel from '../components/LiveViewEditor/EditPanels/TypeEditPanel.js';
import ColorEditPanel from '../components/LiveViewEditor/EditPanels/ColorEditPanel.js';
import ImageEditPanel from '../components/LiveViewEditor/EditPanels/ImageEditPanel.js';
import AspectRatioEditPanel from '../components/LiveViewEditor/EditPanels/AspectRatioEditPanel.js';
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

const EditPanelTypes = {
    TYPEFACE: 'typeface',
    COLOR: 'color',
    IMAGE: 'image',
    ASPECTRATIO: 'aspectratio',
}

const NavPanelTypes = {
    TEXT: 'text',
    IMAGE: 'image',
    SCREEN: 'screen',
    TIMER: 'timer',
    COUNTER: 'counter',
    CLUEDISPLAY: 'cluedisplay',
}

const CanvasItemTypes = {
    TEXT: 'text',
    IMAGE: 'image',
    SCREEN: 'screen',
    TIMER: 'timer',
    COUNTER: 'counter',
    CLUEDISPLAY: 'cluedisplay',
}

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
        this.state={fileInputRef: React.createRef(), anchorEl: null, selectedNavPanelType: NavPanelTypes.SCREEN, selectedEditPanelType: EditPanelTypes.ASPECTRATIO};
        this.objects = [];
        this.db = new PouchDB('kittens');
    }

    componentDidUpdate(prevProps, prevState) {
        
    }

    componentDidMount() {
        var oldCanvas = document.getElementById('mainCanvas');

        fabric.ClueTextbox = fabric.util.createClass(fabric.Textbox, {
            type: 'cluetextbox',
             /**
             * Properties which when set cause object to change dimensions
             * @type Object
             * @private
             */
            _dimensionAffectingProps: fabric.Text.prototype._dimensionAffectingProps,
        });

        this.canvas = new fabric.Canvas("mainCanvas", {
                                            width: oldCanvas.parentNode.clientWidth, 
                                            height: oldCanvas.parentNode.clientHeight,
                                            backgroundColor: '#fff',
                                            preserveObjectStacking: true,
                                            uniScaleTransform: true, });
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

    renderEditPanels = (selectedPanel) => {
        switch(selectedPanel) {
            case EditPanelTypes.TYPEFACE:
                return <TypeEditPanel />;
            case EditPanelTypes.COLOR:
                return <ColorEditPanel />;
            case EditPanelTypes.IMAGE:
                return <ImageEditPanel />;
            case EditPanelTypes.ASPECTRATIO:
                return <AspectRatioEditPanel />;
            default:
                return <AspectRatioEditPanel />;
            }
    }

    renderNavPanels = (selectedPanel) => {
        switch(selectedPanel) {
            case NavPanelTypes.SCREEN:
                return <ScreenNavPanel />;
            case NavPanelTypes.TEXT:
                return <TextNavPanel />;
            case NavPanelTypes.IMAGE:
                return <ImageNavPanel />;
            case NavPanelTypes.TIMER:
                //return <TimerNavPanel />;
            case NavPanelTypes.COUNTER:
                //return <CounterNavPanel />;
            case NavPanelTypes.CLUEDISPLAY:
                //return <ClueDisplayNavPanel />;
            default:
                return <ScreenNavPanel />;
            }
    }

    updateSelectedItem = (selectedItem, itemType) => {
        
        switch(itemType) {
            case CanvasItemTypes.TEXT:
                this.setState({selectedNavPanelType: NavPanelTypes.TEXT, selectedEditPanelType: EditPanelTypes.TYPEFACE});
                break;
            case CanvasItemTypes.IMAGE:
                this.setState({selectedNavPanelType: NavPanelTypes.IMAGE, selectedEditPanelType: EditPanelTypes.IMAGE});
                break;
            case CanvasItemTypes.TIMER:
                this.setState({selectedNavPanelType: NavPanelTypes.TEXT, selectedEditPanelType: EditPanelTypes.TYPEFACE});
                break;
            case CanvasItemTypes.COUNTER:
                this.setState({selectedNavPanelType: NavPanelTypes.TEXT, selectedEditPanelType: EditPanelTypes.TYPEFACE});
                break;
            case CanvasItemTypes.CLUEDISPLAY:
                this.setState({selectedNavPanelType: NavPanelTypes.TEXT, selectedEditPanelType: EditPanelTypes.TYPEFACE});
                break;
            case CanvasItemTypes.SCREEN:
            default:
                this.setState({selectedNavPanelType: NavPanelTypes.SCREEN, selectedEditPanelType: EditPanelTypes.ASPECTRATIO});
                break;
        }
    }

    createNewCanvasItem = (itemType, event) => {
        console.log("hit");
        console.log(itemType);
        switch(itemType) {
            case CanvasItemTypes.TEXT:
                var newItem = new fabric.IText("Background Text Example", {
                    fontSize: 40,
                    lockUniScaling: true,
                });
                break;
            case CanvasItemTypes.IMAGE:
                var reader = new FileReader();
                reader.onload = function (event) {
                    var imgObj = new Image();
                    imgObj.src = event.target.result;
                    imgObj.onload = function () {
                        var newItem = new fabric.Image(imgObj, {
                            lockUniScaling: true,
                        });
                        newItem.on('selected', () => { 
                            this.updateSelectedItem(newItem, itemType);
                        });
                        this.canvas.add(newItem);
                        this.canvas.setActiveObject(newItem);
                    }.bind(this);
                }.bind(this);
                reader.readAsDataURL(event.target.files[0]);
                break;
            case CanvasItemTypes.TIMER:
                var circle = new fabric.Circle({
                    radius: 200, fill: 'green', left: 50, top: 50
                });
                this.canvas.add(circle);
                var rect = new fabric.Rect({
                    left: 0,
                    top: 0,
                    fill: 'red',
                    width: 200,
                    height: 200
                });
                this.canvas.add(rect);
                break;
            case CanvasItemTypes.COUNTER:
                break;
            case CanvasItemTypes.CLUEDISPLAY:
                var newItem = new fabric.ClueTextbox("Lorim Ipsum", {
                    fontSize: 40,
                    editable: false,
                    lockUniScaling: false,
                });
                newItem.setControlsVisibility({
                    mt: false, // middle top disable
                    mb: false, // midle bottom
                    ml: false, // middle left
                    mr: false, // middle right
                });
                newItem.on('scaling', function() { 
                    var newfontsize = (newItem.fontSize * newItem.scaleX);
                    newItem.width = newItem.width * newItem.scaleX;
                    //newItem.fontSize = (parseInt(newfontsize, 10));
                    newItem.height = newItem.height * newItem.scaleY;
                    newItem.scaleX = 1;
                    newItem.scaleY = 1;
                    //console.log(newItem);
                    //console.log(newItem._splitTextIntoLines(newItem.text));
                    var newLinesObject = newItem._splitTextIntoLines(newItem.text);
                    newItem.textLines = newLinesObject.lines;
                    newItem._unwrappedTextLines = newLinesObject._unwrappedLines;
                    newItem._text = newLinesObject.graphemeText;
                    newItem._textLines = newLinesObject.graphemeLines;
                    
                });
                newItem.on('modified', function() { 
                    var newfontsize = (newItem.fontSize * newItem.scaleX);
                    newItem.width = newItem.width * newItem.scaleX;
                    //newItem.fontSize = (parseInt(newfontsize, 10));
                    newItem.height = newItem.height * newItem.scaleY;
                    newItem.scaleX = 1;
                    newItem.scaleY = 1;
                    //console.log(newItem);
                    //console.log(newItem._splitTextIntoLines(newItem.text));
                    var newLinesObject = newItem._splitTextIntoLines(newItem.text);
                    newItem.textLines = newLinesObject.lines;
                    newItem._unwrappedTextLines = newLinesObject._unwrappedLines;
                    newItem._text = newLinesObject.graphemeText;
                    newItem._textLines = newLinesObject.graphemeLines;
                });
                break;
            default:
                break;
        }

        if(newItem != null) {
            newItem.on('selected', () => { 
                this.updateSelectedItem(newItem, itemType);
            });
            this.canvas.add(newItem);
            this.canvas.setActiveObject(newItem);
        }
        this.handleOpenAddMenu();
    }

    render() {
        const { anchorEl } = this.state;
        const { classes } = this.props;

        return(
            <Grid container direction='row' justify='flex-end' alignItems='stretch' spacing={0} className={classes.editorContainer}>
                <Grid item container direction='column' id='canvasInteractionLayer' justify='center' alignItems='flex-end' className={classes.editingBackground}>
                    <Grid item id='aspectPanel' className={classes.centeredAspectPanel}>
                        <canvas id= 'mainCanvas'>
                        </canvas>
                    </Grid>
                </Grid>
                <Grid item direction='column' id='EditPanel' className={classes.editPanel}>
                    {this.renderEditPanels(this.state.selectedEditPanelType)}
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
                                                <AddNewItemMenu createNewCanvasItem={this.createNewCanvasItem} CanvasItemTypes={CanvasItemTypes} fileInputRef={this.state.fileInputRef}/>
                                        </Popover>
                                    </Grid>
                                    <Grid item>
                                        Add
                                    </Grid>
                                </Grid>
                            </IconButton>
                        </Grid>
                    <Grid id="NavPanelTabsWrapper">
                        {this.renderNavPanels(this.state.selectedNavPanelType)}
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default  withStyles(styles)(LiveScreenEditorView)