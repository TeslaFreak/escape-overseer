import React, { Component } from 'react';
import TextNavPanel from '../components/LiveViewEditor/NavPanels/TextNavPanel.js';
import ImageNavPanel from '../components/LiveViewEditor/NavPanels/ImageNavPanel.js';
import TimerNavPanel from '../components/LiveViewEditor/NavPanels/TimerNavPanel.js';
import IconNavPanel from '../components/LiveViewEditor/NavPanels/IconNavPanel.js';
import ScreenNavPanel from '../components/LiveViewEditor/NavPanels/ScreenNavPanel.js';
import TypeEditPanel from '../components/LiveViewEditor/EditPanels/TypeEditPanel.js';
import ColorEditPanel from '../components/LiveViewEditor/EditPanels/ColorEditPanel.js';
import ImageEditPanel from '../components/LiveViewEditor/EditPanels/ImageEditPanel.js';
import TimerEditPanel from '../components/LiveViewEditor/EditPanels/TimerEditPanel.js';
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
        fabric.Object.prototype.getZIndex = function() {
            return this.canvas ? this.canvas.getObjects().indexOf(this) : 0;
        }

        fabric.ClueTextbox = fabric.util.createClass(fabric.Textbox, {
            type: 'cluetextbox',
             /**
             * Properties which when set cause object to change dimensions
             * @type Object
             * @private
             */
            _dimensionAffectingProps: fabric.Text.prototype._dimensionAffectingProps,
        });

        fabric.FittableImage = fabric.util.createClass(fabric.Image, {
            type: 'fittableimage',

            initialize: function(options) {
                options || (options = { });

                this.callSuper('initialize', options);
                this.set('fit', options.fit || 'none');
            },

            toObject: function() {
                return fabric.util.object.extend(this.callSuper('toObject'), {
                fit: this.get('fit')
                });
            },
        });

        fabric.Timer = fabric.util.createClass(fabric.IText, {
            type: 'timer',

            initialize: function(options) {
                options || (options = { });

                this.callSuper('initialize', options);
                this.set('totalTime', options.totalTime || 60);
                this.set('showHours', options.showHours || false);
                this.set('showMinutes', options.showMinutes || true);
                this.set('showSeconds', options.showSeconds || true);
                this.set('showMilliseconds', options.showMilliseconds || false);
            },

            toObject: function() {
                return fabric.util.object.extend(this.callSuper('toObject'), {
                totalTime: this.get('totalTime'),
                showHours: this.get('showHours'),
                showMinutes: this.get('showMinutes'),
                showSeconds: this.get('showSeconds'),
                showMilliseconds: this.get('showMilliseconds'),
                });
            },
        });

        this.canvas = new fabric.Canvas("mainCanvas", {
                                            width: oldCanvas.parentNode.clientWidth, 
                                            height: oldCanvas.parentNode.clientHeight,
                                            selection: false,
                                            backgroundColor: '#fff',
                                            preserveObjectStacking: true,
                                            uniScaleTransform: true, });
        
        let editorContainer = document.getElementById('editorContainer');
        editorContainer.tabIndex = 1000;
        editorContainer.addEventListener("keydown", this.handleKeyPress, false);
        editorContainer.addEventListener("click", this.handleGeneralClick, false);
    }

    handleKeyPress = (e) => {
        console.log(e.which);
        if([8, 46].includes(e.which)) {
            this.canvas.remove(this.canvas.getActiveObject());
            this.updateSelectedItem(null, CanvasItemTypes.SCREEN);
        }
    }

    handleGeneralClick = (e) => {
        if(this.canvas.getActiveObject() === null) {
            this.updateSelectedItem(null, CanvasItemTypes.SCREEN);
        }
    }

    handleOpenAddMenu = event => {
        if(Boolean(this.state.anchorEl)) {
            this.setState({ anchorEl: null});
        }
        else {
            this.setState({ anchorEl: event.currentTarget});
        }
    };

    renderEditPanels = (selectedPanel) => {
        switch(selectedPanel) {
            case EditPanelTypes.TYPEFACE:
                return <TypeEditPanel selectedItem={this.state.selectedItem} updateItemProperty={this.updateItemProperty} canvasObjectCount={this.canvas.size()}/>;
            case EditPanelTypes.COLOR:
                return <ColorEditPanel selectedItem={this.state.selectedItem} updateItemProperty={this.updateItemProperty}/>;
            case EditPanelTypes.IMAGE:
                return <ImageEditPanel selectedItem={this.state.selectedItem} updateItemProperty={this.updateItemProperty} canvasObjectCount={this.canvas.size()}/>;
            case EditPanelTypes.ASPECTRATIO:
                return <AspectRatioEditPanel selectedItem={this.state.selectedItem} updateItemProperty={this.updateItemProperty}/>;
            case EditPanelTypes.TIMER:
                return <TimerEditPanel selectedItem={this.state.selectedItem} updateItemProperty={this.updateItemProperty}/>;
            default:
                return <AspectRatioEditPanel selectedItem={this.state.selectedItem} updateItemProperty={this.updateItemProperty}/>;
            }
    }

    renderNavPanels = (selectedPanel) => {
        switch(selectedPanel) {
            case NavPanelTypes.SCREEN:
                return <ScreenNavPanel selectedEditPanelType={this.state.selectedEditPanelType} updateSelectedEditPanel={this.updateSelectedEditPanel} EditPanelTypes={EditPanelTypes}/>;
            case NavPanelTypes.TEXT:
                return <TextNavPanel selectedEditPanelType={this.state.selectedEditPanelType} updateSelectedEditPanel={this.updateSelectedEditPanel} EditPanelTypes={EditPanelTypes}/>;
            case NavPanelTypes.IMAGE:
                return <ImageNavPanel selectedEditPanelType={this.state.selectedEditPanelType} updateSelectedEditPanel={this.updateSelectedEditPanel} EditPanelTypes={EditPanelTypes}/>;
            case NavPanelTypes.TIMER:
                return <TimerNavPanel selectedEditPanelType={this.state.selectedEditPanelType} updateSelectedEditPanel={this.updateSelectedEditPanel} EditPanelTypes={EditPanelTypes}/>;
            case NavPanelTypes.COUNTER:
                //return <CounterNavPanel selectedEditPanelType={this.state.selectedEditPanelType} updateSelectedEditPanel={updateSelectedEditPanel} EditPanelTypes={EditPanelTypes}/>;
            case NavPanelTypes.CLUEDISPLAY:
                //return <ClueDisplayNavPanel selectedEditPanelType={this.state.selectedEditPanelType} updateSelectedEditPanel={updateSelectedEditPanel} EditPanelTypes={EditPanelTypes}/>;
            default:
                return <ScreenNavPanel selectedEditPanelType={this.state.selectedEditPanelType} updateSelectedEditPanel={this.updateSelectedEditPanel} EditPanelTypes={EditPanelTypes}/>;
            }
    }

    updateSelectedItem = (selectedItem, itemType) => {
        switch(itemType) {
            case CanvasItemTypes.TEXT:
                this.setState({selectedItem: selectedItem, selectedNavPanelType: NavPanelTypes.TEXT, selectedEditPanelType: EditPanelTypes.TYPEFACE});
                break;
            case CanvasItemTypes.IMAGE:
                this.setState({selectedItem: selectedItem, selectedNavPanelType: NavPanelTypes.IMAGE, selectedEditPanelType: EditPanelTypes.IMAGE});
                break;
            case CanvasItemTypes.TIMER:
                this.setState({selectedItem: selectedItem, selectedNavPanelType: NavPanelTypes.TIMER, selectedEditPanelType: EditPanelTypes.TYPEFACE});
                break;
            case CanvasItemTypes.COUNTER:
                this.setState({selectedItem: selectedItem, selectedNavPanelType: NavPanelTypes.TEXT, selectedEditPanelType: EditPanelTypes.TYPEFACE});
                break;
            case CanvasItemTypes.CLUEDISPLAY:
                this.setState({selectedItem: selectedItem, selectedNavPanelType: NavPanelTypes.TEXT, selectedEditPanelType: EditPanelTypes.TYPEFACE});
                break;
            case CanvasItemTypes.SCREEN:
            default:
                this.setState({selectedItem: selectedItem, selectedNavPanelType: NavPanelTypes.SCREEN, selectedEditPanelType: EditPanelTypes.ASPECTRATIO});
                break;
        }
    }

    updateSelectedEditPanel = (panelType) => {
        this.setState({selectedEditPanelType: panelType});
    }

    updateItemProperty = (propertyName, propertyValue) => {
        console.log(propertyValue);
        switch(propertyName) {
            case 'scale':
                this.state.selectedItem.scaleToWidth(propertyValue);
                break;
            case 'fit':
                switch(propertyValue) {
                    case 'width':
                        this.state.selectedItem.rotate(0);
                        this.state.selectedItem.setCoords();
                        this.state.selectedItem.scaleToWidth(this.canvas.getWidth());
                        this.state.selectedItem.center();
                        this.state.selectedItem.lockMovementX = true;
                        this.state.selectedItem.lockMovementY = true;
                        this.state.selectedItem.lockRotation = true;
                        this.state.selectedItem.setControlsVisibility({
                            bl: false, // bottom left disable
                            br: false, // bottom right
                            tl: false, // top left
                            tr: false, // top right
                            mtr: false, // rotation
                        });
                    break;
                    case 'height':
                        this.state.selectedItem.rotate(0);
                        this.state.selectedItem.setCoords();
                        this.state.selectedItem.scaleToHeight(this.canvas.getHeight());
                        this.state.selectedItem.center();
                        this.state.selectedItem.lockMovementX = true;
                        this.state.selectedItem.lockMovementY = true;
                        this.state.selectedItem.lockRotation = true;
                        this.state.selectedItem.setControlsVisibility({
                            bl: false, // bottom left disable
                            br: false, // bottom right
                            tl: false, // top left
                            tr: false, // top right
                            mtr: false, // rotation
                        });
                    break;
                    case 'none':
                        this.state.selectedItem.lockMovementX = false;
                        this.state.selectedItem.lockMovementY = false;
                        this.state.selectedItem.lockScalingX = false;
                        this.state.selectedItem.lockScalingY = false;
                        this.state.selectedItem.lockRotation = false;
                        this.state.selectedItem.setControlsVisibility({
                            bl: true, // bottom left disable
                            br: true, // bottom right
                            tl: true, // top left
                            tr: true, // top right
                            mtr: true, // rotation
                        });
                    break;
                }
                this.state.selectedItem.set(propertyName, propertyValue);
                break;
            case 'order':
                this.state.selectedItem.moveTo(propertyValue);
                break;
            case 'fontFamily':
                    WebFont.load({
                    google: { 
                            families: [propertyValue] 
                        } 
                    });
                    this.state.selectedItem.set(propertyName, propertyValue);
                break;
            default:
                this.state.selectedItem.set(propertyName, propertyValue);
                break;
        }
        this.state.selectedItem.setCoords();
        this.canvas.renderAll();
    }

    createNewCanvasItem = (itemType, event) => {
        switch(itemType) {
            case CanvasItemTypes.TEXT:
                var newItem = new fabric.IText("Background Text Example", {
                    fontSize: 40,
                    lineHeight: 1,
                    charSpacing: 10,
                    lockUniScaling: true,
                    lockScalingFlip: true,
                });
                newItem.on('modified', function() { 
                    var newfontsize = (newItem.fontSize * newItem.scaleX);
                    newItem.width = newItem.width * newItem.scaleX;
                    newItem.fontSize = (parseInt(newfontsize, 10));
                    newItem.height = newItem.height * newItem.scaleY;
                    newItem.scaleX = 1;
                    newItem.scaleY = 1;
                    this.updateSelectedItem(newItem, itemType);
                }.bind(this));
                break;
            case CanvasItemTypes.IMAGE:
                var reader = new FileReader();
                reader.onload = function (event) {
                    var imgObj = new Image();
                    imgObj.src = event.target.result;
                    imgObj.onload = function () {
                        var newItem = new fabric.FittableImage(imgObj, {
                            lockUniScaling: true,
                        });
                        newItem.on('modified',  () => { 
                            this.updateSelectedItem(newItem, itemType);
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
                var newItem = new fabric.IText("60:00", {
                    fontSize: 40,
                    charSpacing: 10,
                    lockUniScaling: true,
                    lockScalingFlip: true,
                });
                newItem.on('modified',  () => {
                    var newfontsize = (newItem.fontSize * newItem.scaleX);
                    newItem.width = newItem.width * newItem.scaleX;
                    newItem.fontSize = (parseInt(newfontsize, 10));
                    newItem.height = newItem.height * newItem.scaleY;
                    newItem.scaleX = 1;
                    newItem.scaleY = 1;
                });
                break;
            case CanvasItemTypes.COUNTER:
                break;
            case CanvasItemTypes.CLUEDISPLAY:
                var newItem = new fabric.ClueTextbox("Clue Text will appear here, with the same properties as this display text, bounded by this box... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget mauris in eros efficitur sodales vel eu lectus. Curabitur dui felis, posuere non urna at, rhoncus efficitur ipsum.")
                newItem.set({
                    fontSize: 40,
                    width: this.canvas.width - 40,
                    lineHeight: 1,
                    charSpacing: 10,
                    editable: false,
                    lockUniScaling: false,
                    lockScalingFlip: true,
                });
                newItem.setControlsVisibility({
                    mt: false, // middle top disable
                    mb: false, // midle bottom
                    ml: false, // middle left
                    mr: false, // middle right
                });
                newItem.on('scaling',  () => {
                    var newfontsize = (newItem.fontSize * newItem.scaleX);
                    newItem.set({
                        width: newItem.width * newItem.scaleX,
                        height: newItem.height * newItem.scaleY,
                        scaleX: 1,
                        scaleY: 1,
                    });
                    var newLinesObject = newItem._splitTextIntoLines(newItem.text);
                    newItem.textLines = newLinesObject.lines;
                    newItem._unwrappedTextLines = newLinesObject._unwrappedLines;
                    newItem._text = newLinesObject.graphemeText;
                    newItem._textLines = newLinesObject.graphemeLines;
                });
                newItem.on('modified',  () => { 
                    var newfontsize = (newItem.fontSize * newItem.scaleX);
                    newItem.set({
                        width: newItem.width * newItem.scaleX,
                        height: newItem.height * newItem.scaleY,
                        scaleX: 1,
                        scaleY: 1,
                    });
                    //console.log(newItem);
                    //console.log(newItem._splitTextIntoLines(newItem.text));
                    var newLinesObject = newItem._splitTextIntoLines(newItem.text);
                    newItem.set({
                        textLines: newLinesObject.lines
                    })
                    //newItem._unwrappedTextLines = newLinesObject._unwrappedLines;
                    //newItem._text = newLinesObject.graphemeText;
                    //newItem._textLines = newLinesObject.graphemeLines;
                    this.updateSelectedItem(newItem, itemType);

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
            newItem.center();
            console.log(newItem);
            this.canvas.setActiveObject(newItem);
        }
        this.handleOpenAddMenu();
    }

    render() {
        const { anchorEl } = this.state;
        const { classes } = this.props;

        return(
            <Grid id='editorContainer' container direction='row' justify='flex-end' alignItems='stretch' spacing={0} className={classes.editorContainer}>
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