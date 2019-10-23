import React, { Component } from 'react';
import TextNavPanel from '../components/LiveViewEditor/NavPanels/TextNavPanel.js';
import ImageNavPanel from '../components/LiveViewEditor/NavPanels/ImageNavPanel.js';
import TimerNavPanel from '../components/LiveViewEditor/NavPanels/TimerNavPanel.js';
import VisualCounterNavPanel from '../components/LiveViewEditor/NavPanels/VisualCounterNavPanel.js';
import NumericCounterNavPanel from '../components/LiveViewEditor/NavPanels/NumericCounterNavPanel.js';
import IconNavPanel from '../components/LiveViewEditor/NavPanels/IconNavPanel.js';
import ScreenNavPanel from '../components/LiveViewEditor/NavPanels/ScreenNavPanel.js';
import TypeEditPanel from '../components/LiveViewEditor/EditPanels/TypeEditPanel.js';
import ColorEditPanel from '../components/LiveViewEditor/EditPanels/ColorEditPanel.js';
import ImageEditPanel from '../components/LiveViewEditor/EditPanels/ImageEditPanel.js';
import VideoEditPanel from '../components/LiveViewEditor/EditPanels/VideoEditPanel.js';
import TimerEditPanel from '../components/LiveViewEditor/EditPanels/TimerEditPanel.js';
import VisualCounterEditPanel from '../components/LiveViewEditor/EditPanels/VisualCounterEditPanel.js';
import NumericCounterEditPanel from '../components/LiveViewEditor/EditPanels/NumericCounterEditPanel.js';
import AspectRatioEditPanel from '../components/LiveViewEditor/EditPanels/AspectRatioEditPanel.js';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import PouchDB from 'pouchdb';
import { withStyles, withTheme } from '@material-ui/core/styles';
import classNames from 'classnames';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';
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
const aspectRatio2 = 1;
const aspectWidthRatio = 1;
const aspectHeightRatio = aspectRatio;
const containerWidth = `calc(100vw - 280px - 80px - 140px - 100px)`;
const containerHeight = `calc(100vh - ${appbarHeight}px - 200px)`;
const aspectWidth = containerWidth * aspectWidthRatio;
const aspectHeight = containerWidth * aspectHeightRatio;

//google fonts API Key: AIzaSyDipkbeiVIwQoDKHnvmFCFQ1EoFW1_jw9E

const EditPanelTypes = {
    TYPEFACE: 'typeface',
    COLOR: 'color',
    IMAGE: 'image',
    ASPECTRATIO: 'aspectratio',
    VISUALCOUNTER: 'visualcounter',
    NUMERICCOUNTER: 'numericcounter',
    VIDEO: 'video',
}

const NavPanelTypes = {
    TEXT: 'text',
    IMAGE: 'image',
    SCREEN: 'screen',
    TIMER: 'timer',
    VISUALCOUNTER: 'visualcounter',
    NUMERICCOUNTER: 'numericcounter',
    CLUEDISPLAY: 'cluedisplay',
}

const CanvasItemTypes = {
    TEXT: 'text',
    IMAGE: 'image',
    SCREEN: 'screen',
    TIMER: 'timer',
    VISUALCOUNTER: 'visualcounter',
    NUMERICCOUNTER: 'numericcounter',
    CLUEDISPLAY: 'cluedisplay',
}

const AspectRatios = {
    ratio16_9: {width: 1920, height: 1080},
    ratio4_3: {width: 1024, height: 768},
    ratio1_1: {width: 1000, height: 1000}
}

const styles = theme => ({
    editorContainer: {
        width: '100%',
        height: `calc(100vh - ${appbarHeight}px)`,
        outlineColor: 'transparent',
    },
    centeredAspectPanel: {
        width: `calc(${containerWidth} * ${aspectWidthRatio} )`,
        height: `calc(${containerWidth} * ${aspectHeightRatio} )`,
        margin: '100px 70px',
    },
    centeredAspectPanel2: {
        width: `calc(${containerHeight} * ${aspectWidthRatio} )`,
        height: `calc(${containerHeight} * ${aspectRatio2} )`,
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
        width: `calc(100% - 280px - 80px)`,
    },
    loadingMask: {
        backgroundColor: '#ededed',
        height: '100%',
        width: '100%',
        position: 'absolute',
        zIndex: 2
    },
    saveButton: {
        margin: '30px',
        position: 'relative',
        border: 'none',
        color: 'black',
    },
    saveProgress: {
        color: 'green',
        position: 'absolute',
        left: '50%',
    },
    saveSuccess: {
        color: 'white',
        backgroundColor: 'green',
        '&:hover': {
          backgroundColor: 'green',
        },
      },
    editPanel: {
        width: '280px',
        height: '100%',
        backgroundColor: '#35414c',
        padding: '28px 28px 0',
        zIndex: 2
    },
    navigationPanel: {
        width: '80px',
        height: '100%',
        backgroundColor: '#242c33',
        zIndex: 2
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



class LiveScreenEditorView extends Component {

    constructor(props) {
        super(props);
        this.state={fileInputRef: React.createRef(), anchorEl: null, selectedNavPanelType: NavPanelTypes.SCREEN, selectedEditPanelType: EditPanelTypes.ASPECTRATIO, 
            aspectRatio: "16:9", aspectWidth: `calc(${containerWidth} * ${aspectWidthRatio} )`, aspectHeight: `calc(${containerWidth} * ${aspectHeightRatio} )`,
            aspectDominantDimension: 'width',
            loading:true, saving:false, saveCompleted:false,
            savedVideoName: 'N/A'};
        this.objects = [];
        this.db = new PouchDB('kittens');
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.selectedRoomId != this.props.selectedRoomId) {
            this.setState({loading:true}, () => {
            this.loadJSON()})
        }
    }

    componentDidMount() {
        document.body.style.overflow = "hidden";
        var oldCanvas = document.getElementById('mainCanvas');
        
        fabric.Object.prototype.getZIndex = function() {
            return this.canvas ? this.canvas.getObjects().indexOf(this) : 0;
        }

        fabric.loadAmbiguousFromURL = function(url, callback) {
                let filetype = url.slice((url.lastIndexOf(".") - 1 >>> 0) + 2);
                if (filetype === 'svg') {
                    fabric.loadSVGFromURL(url, function(img) {
                        callback && callback(new fabric.Image(img));
                    })
                }
                else {
                    fabric.Image.fromURL(url, function(img) {
                        callback && callback(new fabric.Image(img));
                    })
                }
        }

        fabric.RawText = fabric.util.createClass(fabric.IText, {
            type: 'rawText',
             /**
             * Properties which when set cause object to change dimensions
             * @type Object
             * @private
             */
            
            initialize: function(element, options) {
                options || (options = { });

                this.callSuper('initialize', element, options);
                this.set('fontSize', options.fontSize || 40);
                this.set('fontFamily', options.fontFamily || 'Roboto');
                this.set('lineHeight', options.lineHeight || 1);
                this.set('charSpacing', options.charSpacing || 10);
                this.set('lockUniScaling', options.lockUniScaling || true);
                this.set('lockScalingFlip', options.lockScalingFlip || true);
            },

            toObject: function() {
                return fabric.util.object.extend(this.callSuper('toObject'), {
                    fontSize: this.get('fontSize'),
                    fontFamily: this.get('fontFamily'),
                    lineHeight: this.get('lineHeight'),
                    charSpacing: this.get('charSpacing'),
                    lockUniScaling: this.get('lockUniScaling'),
                    lockScalingFlip: this.get('lockScalingFlip'),
                });
            },
        });

        fabric.RawText.fromObject = function(object, callback, forceAsync) {
            WebFont.load({
                google: { 
                        families: [object.fontFamily  || 'Roboto'] 
                    },
                    fontactive: function(familyName, fontDescription) {
                        let newItem = new fabric.RawText(object.text, object);
                        newItem.on('modified', () => { 
                            var newfontsize = (newItem.fontSize * newItem.scaleX);
                            newItem.width = newItem.width * newItem.scaleX;
                            newItem.fontSize = (parseInt(newfontsize, 10));
                            newItem.height = newItem.height * newItem.scaleY;
                            newItem.scaleX = 1;
                            newItem.scaleY = 1;
                            this.updateSelectedItem(newItem, CanvasItemTypes.TEXT);
                        });
                        newItem.on('selected', () => { 
                            this.updateSelectedItem(newItem, CanvasItemTypes.TEXT);
                        });
                        callback && callback(newItem);
                    }.bind(this), 
            });
        }.bind(this);

        fabric.ClueTextbox = fabric.util.createClass(fabric.Textbox, {
            type: 'clueTextbox',
             /**
             * Properties which when set cause object to change dimensions
             * @type Object
             * @private
             */
            _dimensionAffectingProps: fabric.IText.prototype._dimensionAffectingProps.slice(0),
            
            initialize: function(element, options) {
                options || (options = { });

                this.callSuper('initialize', element, options);
                this.set('fontSize', options.fontSize || 40);
                this.set('fontFamily', options.fontFamily || 'Roboto');
                this.set('lineHeight', options.lineHeight || 1);
                this.set('charSpacing', options.charSpacing || 10);
                this.set('editable', false);
                this.set('lockUniScaling', false);
                this.set('lockScalingFlip', true);
            },

            toObject: function() {
                return fabric.util.object.extend(this.callSuper('toObject'), {
                    fontSize: this.get('fontSize'),
                    fontFamily: this.get('fontFamily'),
                    lineHeight: this.get('lineHeight'),
                    charSpacing: this.get('charSpacing'),
                });
            },
            
            _renderTextCommon: function(ctx, method) {
                ctx.save();
                var lineHeights = 0, left = this._getLeftOffset(), top = this._getTopOffset(),
                    offsets = this._applyPatternGradientTransform(ctx, method === 'fillText' ? this.fill : this.stroke);
                for (var i = 0, len = this._textLines.length; i < len; i++) {
                  var heightOfLine = this.getHeightOfLine(i),
                      maxHeight = heightOfLine / this.lineHeight,
                      leftOffset = this._getLineLeftOffset(i);
                  if(lineHeights+heightOfLine < this.getScaledHeight()){
                  this._renderTextLine(
                    method,
                    ctx,
                    this._textLines[i],
                    left + leftOffset - offsets.offsetX,
                    top + lineHeights + maxHeight - offsets.offsetY,
                    i
                  );
                  }
                  lineHeights += heightOfLine;
                }
                ctx.restore();
              }
        });

        fabric.ClueTextbox.fromObject = function(object, callback, forceAsync) {
            WebFont.load({
                google: { 
                        families: [object.fontFamily  || 'Roboto'] 
                    },
                    fontactive: function(familyName, fontDescription) {
                        let newItem = new fabric.ClueTextbox(object.text, object);
                        newItem.on('scaling',  () => {
                            var newHeight = newItem.height * newItem.scaleY;
                            newItem.set({
                                width: newItem.width * newItem.scaleX,
                                scaleX: 1,
                            });
                            newItem.initDimensions();
                            newItem.set({ height: newHeight, scaleY: 1 })
                            console.log(newItem);
                        });
                        newItem.on('modified',  () => { 
                            var newfontsize = (newItem.fontSize * newItem.scaleX);
                            newItem.set({
                                width: newItem.width * newItem.scaleX,
                                height: newItem.height * newItem.scaleY,
                                scaleX: 1,
                                scaleY: 1,
                            });
                        });
                        newItem.on('selected', () => { 
                            this.updateSelectedItem(newItem, CanvasItemTypes.CLUEDISPLAY);
                        });
                        callback && callback(newItem);
                    }.bind(this), 
            });
        }.bind(this);

        fabric.FittableImage = fabric.util.createClass(fabric.Image, {
            type: 'fittableImage',

            initialize: function(element, options) {
                options || (options = { });

                this.callSuper('initialize', element, options);
                this.set('fit', options.fit || 'none');
                this.set('lockUniScaling', true);
                this.set('lockMovementX', options.lockMovementX || false);
                this.set('lockMovementY', options.lockMovementY || false);
                this.set('lockScalingX', options.lockScalingX || false);
                this.set('lockScalingY', options.lockScalingY || false);
                this.set('lockRotation', options.lockRotation || false);
                if(options.sWidth) {
                    this.scaleToWidth(options.sWidth);
                }
            },

            toObject: function() {
                return fabric.util.object.extend(this.callSuper('toObject'), {
                fit: this.get('fit'),
                lockMovementX: this.get('lockMovementX'),
                lockMovementY: this.get('lockMovementY'),
                lockScalingX: this.get('lockScalingX'),
                lockScalingY: this.get('lockScalingY'),
                lockRotation: this.get('lockRotation'),
                sWidth: this.getScaledWidth(),
                });
            },
        });

        fabric.FittableImage.fromObject = function(object, callback, forceAsync) {
        
            console.log(object);
            var imgObj = new Image();
            imgObj.src = object.src;
            imgObj.onload = function () {
                var newItem = new fabric.FittableImage(imgObj, object);
                newItem.on('modified', () => {
                    this.updateSelectedItem(newItem, CanvasItemTypes.IMAGE);
                });
                newItem.on('selected', () => {
                    this.updateSelectedItem(newItem, CanvasItemTypes.IMAGE);
                });
                callback && callback(newItem);
            }.bind(this);
        }.bind(this);

        fabric.VisualCounter = fabric.util.createClass(fabric.Group, {
            type: 'visualCounter',

            //get width of each icon, have property for space between them, set default spacing to width of icon
            initialize: function(group, options, isAlreadyGrouped) {
                options || (options = { });
                this.callSuper('initialize', group, options, isAlreadyGrouped);
                this.set('numberOfClues', 1);
                this.set('iconSpacing', options.iconSpacing || 12);
                this.set('iconSize', options.iconSize || 12);
                this.set('usedStatus', 'unused');
                this.set('unusedSource', options.unusedSource || 'assets/images/lock-solid.png');
                this.set('usedSource', options.usedSource || 'assets/images/ex-solid.png');
                this.set('lockUniScaling', options.lockUniScaling || true);
            },

            toObject: function() {
                return fabric.util.object.extend(this.callSuper('toObject'), {
                    numberOfClues: this.get('numberOfClues'),
                    iconSpacing: this.get('iconSpacing'),
                    iconSize: this.get('iconSize'),
                    unusedSource: this.get('unusedSource'),
                    usedSource: this.get('usedSource'),
                    lockUniScaling: this.get('lockUniScaling'),
                });
            },
        });

        fabric.VisualCounter.fromObject = function(object, callback, forceAsync) {
            console.log("comoooon")
            console.log(object);
            fabric.util.enlivenObjects(object.objects, function (enlivenedObjects) {
                var group = [], tmpObj = null;
                tmpObj = enlivenedObjects[0].set({
                    usedType: 'unused',
                    visible: true
                });
                tmpObj.scaleToWidth(12);
                group.push(tmpObj);
                tmpObj = enlivenedObjects[1].set({
                    usedType: 'used',
                    visible: false
                });
                tmpObj.scaleToWidth(12);
                group.push(tmpObj);
                var newItem = new fabric.VisualCounter(group, object, true);
                newItem.on('modified', () => {
                    this.updateSelectedItem(newItem, CanvasItemTypes.VISUALCOUNTER);
                });
                newItem.on('selected', () => {
                    this.updateSelectedItem(newItem, CanvasItemTypes.VISUALCOUNTER);
                });
                this.setState({selectedItem: newItem})
                this.updateItemProperty('numberOfClues', object.numberOfClues);
                
                callback && callback(newItem);
            }.bind(this));
        }.bind(this);

        fabric.NumericCounter = fabric.util.createClass(fabric.IText, {
            type: 'numericCounter',
             /**
             * Properties which when set cause object to change dimensions
             * @type Object
             * @private
             */
            
            initialize: function(element, options) {
                options || (options = { });

                this.callSuper('initialize', element, options);
                this.set('fontSize', options.fontSize || 40);
                this.set('fontFamily', options.fontFamily || 'Roboto');
                this.set('lineHeight', options.lineHeight || 1);
                this.set('charSpacing', options.charSpacing || 10);
                this.set('lockUniScaling', true);
                this.set('lockScalingFlip', true);
                this.set('editable', false);
                this.set('numberOfClues', options.numberOfClues || 3);
            },

            toObject: function() {
                return fabric.util.object.extend(this.callSuper('toObject'), {
                    fontSize: this.get('fontSize'),
                    fontFamily: this.get('fontFamily'),
                    lineHeight: this.get('lineHeight'),
                    charSpacing: this.get('charSpacing'),
                    numberOfClues: this.get('numberOfClues'),
                });
            },
        });

        fabric.NumericCounter.fromObject = function(object, callback, forceAsync) {
            WebFont.load({
                google: { 
                        families: [object.fontFamily  || 'Roboto'] 
                    },
                    fontactive: function(familyName, fontDescription) {
                        let newItem = new fabric.NumericCounter(object.text, object);
                        newItem.on('modified', () => { 
                            var newfontsize = (newItem.fontSize * newItem.scaleX);
                            newItem.width = newItem.width * newItem.scaleX;
                            newItem.fontSize = (parseInt(newfontsize, 10));
                            newItem.height = newItem.height * newItem.scaleY;
                            newItem.scaleX = 1;
                            newItem.scaleY = 1;
                            this.updateSelectedItem(newItem, CanvasItemTypes.NUMERICCOUNTER);
                        });
                        newItem.on('selected', () => { 
                            this.updateSelectedItem(newItem, CanvasItemTypes.NUMERICCOUNTER);
                        });
                        callback && callback(newItem);
                    }.bind(this), 
            });
        }.bind(this);

        fabric.Timer = fabric.util.createClass(fabric.IText, {
            type: 'timer',

            initialize: function(element, options) {
                options || (options = { });

                this.callSuper('initialize', element, options);
                this.set('originX', 'center');
                this.set('originY', 'center');
                this.set('align', 'mid');
                this.set('totalTime', options.totalTime || 60);
                this.set('showHours', options.showHours || false);
                this.set('showMinutes', options.showMinutes != null ? options.showMinutes : true);
                this.set('showSeconds', options.showSeconds != null ? options.showSeconds : true);
                this.set('showMilliseconds', options.showMilliseconds || false);
                this.set('editable', options.editable || false);
                this.set('fontSize', options.fontSize || 40);
                this.set('fontFamily', options.fontFamily || 'Roboto');
                this.set('charSpacing', options.charSpacing || 10);
                this.set('lockUniScaling', options.lockUniScaling || true);
                this.set('lockScalingFlip', options.lockScalingFlip || true);
            },

            toObject: function() {
                return fabric.util.object.extend(this.callSuper('toObject'), {
                totalTime: this.get('totalTime'),
                showHours: this.get('showHours'),
                showMinutes: this.get('showMinutes'),
                showSeconds: this.get('showSeconds'),
                showMilliseconds: this.get('showMilliseconds'),
                editable: this.get('editable'),
                fontSize: this.get('fontSize'),
                fontFamily: this.get('fontFamily'),
                charSpacing: this.get('charSpacing'),
                lockUniScaling: this.get('lockUniScaling'),
                lockScalingFlip: this.get('lockScalingFlip'),
                });
            },

            updateTimeDisplay: function() {
                let remainingMinutes = this.totalTime;
                let displayString = '';
                if(this.showHours) {
                    let totalHours = Math.floor(remainingMinutes/60);
                    let substring = totalHours.toString().padStart(2, '0');
                    displayString += (this.showMinutes || this.showSeconds || this.showMilliseconds) ? `${substring}:` : `${substring}`;
                    remainingMinutes -= totalHours*60;
                }
                if(this.showMinutes) {
                    let totalMinutes = remainingMinutes;
                    let substring = totalMinutes.toString().padStart(2, '0');
                    displayString += (this.showSeconds || this.showMilliseconds) ? `${substring}:` : `${substring}`;
                    remainingMinutes -= totalMinutes;
                }
                if(this.showSeconds) {
                    let totalSeconds = remainingMinutes*60;
                    let substring = totalSeconds.toString().padStart(2, '0');
                    displayString += this.showMilliseconds ? `${substring}.` : `${substring}`;
                    remainingMinutes -= totalSeconds/60;
                }
                if(this.showMilliseconds) {
                    let totalMilliseconds = remainingMinutes*60*1000;
                    let substring = totalMilliseconds.toString().padStart(3, '0');
                    displayString += `${substring}`;
                }
                this.set("text", displayString);
            }
        });

        fabric.Timer.fromObject = function(object, callback, forceAsync) {
            WebFont.load({
                google: { 
                        families: [object.fontFamily  || 'Roboto'] 
                    },
                    fontactive: function(familyName, fontDescription) {
                        console.log("timer object: ", object);
                        let newItem = new fabric.Timer(object.text, object);
                        newItem.on('modified', () => { 
                            var newfontsize = (newItem.fontSize * newItem.scaleX);
                            newItem.width = newItem.width * newItem.scaleX;
                            newItem.fontSize = (parseInt(newfontsize, 10));
                            newItem.height = newItem.height * newItem.scaleY;
                            newItem.scaleX = 1;
                            newItem.scaleY = 1;
                            this.updateSelectedItem(newItem, CanvasItemTypes.TIMER);
                        });
                        newItem.on('selected', () => { 
                            this.updateSelectedItem(newItem, CanvasItemTypes.TIMER);
                        });
                        callback && callback(newItem);
                    }.bind(this), 
            });
        }.bind(this);

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
        editorContainer.addEventListener("keydown", this.handleKeyPress, false);
        editorContainer.addEventListener("click", this.handleOutsideCanvasClick, false);
        mainCanvas.addEventListener("click", this.handleNullCanvasClick, false);
        this.loadJSON();
        window.addEventListener("resize", this.updateDimensions);
    }

    handleKeyPress = (e) => {
        console.log(e.which);
        if([8, 46].includes(e.which)) {
            this.canvas.remove(this.canvas.getActiveObject());
            this.updateSelectedItem(null, CanvasItemTypes.SCREEN);
        }
        if([83].includes(e.which)) {
            console.log("saved");
            this.saveJSON();
            this.updateSelectedItem(null, CanvasItemTypes.SCREEN);
        }
    }

    handleOutsideCanvasClick = (e) => {
        console.log('click');
        this.canvas.discardActiveObject();
        this.canvas.requestRenderAll();
        this.updateSelectedItem(null, CanvasItemTypes.SCREEN);
        
    }
    handleNullCanvasClick = (e) => {
        console.log('click2');
        if(this.canvas.getActiveObject() === null) {
            this.updateSelectedItem(null, CanvasItemTypes.SCREEN);
        }
        e.stopPropagation();
        console.log("props stopped");
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
            case EditPanelTypes.VIDEO:
                return <VideoEditPanel selectedItem={this.state.selectedItem} updateItemProperty={this.updateItemProperty} savedVideoName={this.state.savedVideoName}/>;
            case EditPanelTypes.ASPECTRATIO:
                return <AspectRatioEditPanel selectedItem={this.state.selectedItem} updateItemProperty={this.updateItemProperty} aspectRatio={this.state.aspectRatio}/>;
            case EditPanelTypes.TIMER:
                return <TimerEditPanel selectedItem={this.state.selectedItem} updateItemProperty={this.updateItemProperty}/>;
            case EditPanelTypes.VISUALCOUNTER:
                return <VisualCounterEditPanel selectedItem={this.state.selectedItem} updateItemProperty={this.updateItemProperty} canvasObjectCount={this.canvas.size()}/>;
            case EditPanelTypes.NUMERICCOUNTER:
                return <NumericCounterEditPanel selectedItem={this.state.selectedItem} updateItemProperty={this.updateItemProperty} canvasObjectCount={this.canvas.size()}/>;
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
            case NavPanelTypes.VISUALCOUNTER:
                return <VisualCounterNavPanel selectedEditPanelType={this.state.selectedEditPanelType} updateSelectedEditPanel={this.updateSelectedEditPanel} EditPanelTypes={EditPanelTypes}/>;
            case NavPanelTypes.NUMERICCOUNTER:
                return <NumericCounterNavPanel selectedEditPanelType={this.state.selectedEditPanelType} updateSelectedEditPanel={this.updateSelectedEditPanel} EditPanelTypes={EditPanelTypes}/>;
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
            case CanvasItemTypes.VISUALCOUNTER:
                this.setState({selectedItem: selectedItem, selectedNavPanelType: NavPanelTypes.VISUALCOUNTER, selectedEditPanelType: EditPanelTypes.VISUALCOUNTER});
                break;
            case CanvasItemTypes.NUMERICCOUNTER:
                this.setState({selectedItem: selectedItem, selectedNavPanelType: NavPanelTypes.NUMERICCOUNTER, selectedEditPanelType: EditPanelTypes.NUMERICCOUNTER});
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
            case 'fill':
                if(this.state.selectedItem.get('type') === 'group') {
                    this.state.selectedItem.forEachObject(function(obj, i) {
                        obj.set('fill', propertyValue);
                    })
                }
                this.state.selectedItem.set(propertyName, propertyValue);
                
                break;
            case 'order':
                this.state.selectedItem.moveTo(propertyValue);
                break;
            case 'showHours':
            case 'showMinutes':
            case 'showSeconds':
            case 'showMilliseconds':
            case 'totalTime':
                this.state.selectedItem.set(propertyName, propertyValue);
                this.state.selectedItem.updateTimeDisplay();
                break;
            case 'iconSize':
                this.state.selectedItem.scaleToWidth((propertyValue*this.state.selectedItem.numberOfClues)+(this.state.selectedItem.iconSpacing*(this.state.selectedItem.numberOfClues-1)));
                this.state.selectedItem.set(propertyName, propertyValue);
                break;
            case 'iconSpacing':
                var iconSize = this.state.selectedItem.iconSize;
                var groupWidth = (propertyValue*(this.state.selectedItem.numberOfClues-1))+(iconSize*this.state.selectedItem.numberOfClues);
                this.state.selectedItem.set(propertyName, propertyValue);
                this.state.selectedItem.forEachObject(function(obj, i) {
                    if(i == 0 || i == 1) {
                        obj.set({left: -(groupWidth / 2)})
                    }
                    else{
                        if(i%2 == 0) {
                            obj.set({ left: -(groupWidth / 2) + (propertyValue+iconSize)*(i/2)})
                        }
                        else{
                            obj.set({ left: -(groupWidth / 2) + (propertyValue+iconSize)*((i/2)-0.5)})
                        }
                        
                    }
                });
                
                this.state.selectedItem.set({
                    width: groupWidth
                });
                break;
            case 'numberOfClues':
                var oldClueCount = this.state.selectedItem.numberOfClues;
                let iconSize = this.state.selectedItem.iconSize;
                let iconSpacing = this.state.selectedItem.iconSpacing;
                console.log('original:' + oldClueCount + ' new:' + propertyValue);
                this.state.selectedItem.set(propertyName, propertyValue);
                if (this.state.selectedItem.get('type') !== 'visualCounter') {
                    this.state.selectedItem.set("text", propertyValue);
                    break;
                }
                var groupWidth = (iconSpacing*(propertyValue))+(iconSize*propertyValue);
                var groupHeight = (this.state.selectedItem.get('height'));
                this.state.selectedItem.set({
                    width: groupWidth,
                });
                if (oldClueCount < propertyValue) {
                    for (let i = Number(oldClueCount)+1; i <= propertyValue; i++) { 
                        fabric.Image.fromURL(this.state.selectedItem.unusedSource, function(object) {
                            let tmpObj = object.set({ left: (iconSpacing+iconSize)*i,
                                                        top: -(groupHeight/2),
                                                        usedType: 'unused',
                                                        visible: this.state.selectedItem.usedStatus == 'unused'});
                            tmpObj.scaleToWidth(12);
                            
                            this.state.selectedItem.insertAt(tmpObj,(i*2)-1);
                            //dumb fix for group not rendering after updating clue count
                            this.updateItemProperty('iconSpacing', this.state.selectedItem.iconSpacing);
                        }.bind(this));
                        fabric.Image.fromURL(this.state.selectedItem.usedSource, function(object) {
                            let tmpObj = object.set({ left: (iconSpacing+iconSize)*i,
                                                        top: -(groupHeight/2),
                                                        usedType: 'used',
                                                        visible: this.state.selectedItem.usedStatus == 'used'});
                            tmpObj.scaleToWidth(12);
                            
                            this.state.selectedItem.insertAt(tmpObj, i*2);
                            //dumb fix for group not rendering after updating clue count
                            this.updateItemProperty('iconSpacing', this.state.selectedItem.iconSpacing);
                        }.bind(this));
                    }
                    //dumb fix for group not rendering after updating clue count
                    this.updateItemProperty('iconSpacing', this.state.selectedItem.iconSpacing);
                }
                else {
                    //note: items is zero indexed
                    var items = this.state.selectedItem.getObjects();
                    for (let i = oldClueCount; i >= propertyValue; i--) {
                        this.state.selectedItem.remove(items[(i*2)]);
                        this.state.selectedItem.remove(items[(i*2)+1]);
                    }
                    //dumb fix for group not rendering after updating clue count
                    this.updateItemProperty('iconSpacing', this.state.selectedItem.iconSpacing);
                }
                break;	
            case 'usedStatus':
                this.state.selectedItem.set(propertyName, propertyValue);
                this.state.selectedItem.forEachObject(function(obj, i) {
                    obj.set({visible: propertyValue == obj.usedType})
                }.bind(this));
                break;
            case 'fontFamily':
                WebFont.load({
                google: { 
                        families: [propertyValue] 
                    },
                    fontactive: function(familyName, fontDescription) {
                        console.log('font loaded')
                        this.state.selectedItem.set(propertyName, propertyValue);
                        this.canvas.requestRenderAll();
                    }.bind(this), 
                });
                break;
            case 'aspectRatio':
                this.setState({loading:true}, () => {
                this.updateAspectRatio(propertyValue);
                setTimeout(function(){
                    console.log('fired from aspect ratio change');
                    window.dispatchEvent(new Event('resize'));
                }, 1);
                setTimeout(function(){
                    console.log('loading done');
                    this.setState({loading:false});
                }.bind(this), 500);
            });
                break;
            case 'changeUnusedSrc':
                //let filetype = propertyValue.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
                var reader = new FileReader();
                reader.onload = function (propertyValue) {
                    var imgObj = new Image();
                    imgObj.src = propertyValue.target.result;
                    imgObj.onload = function () {
                        this.state.selectedItem.set('unusedSource', propertyValue.target.result);
                        this.state.selectedItem.forEachObject(function(obj, i) {
                            if(obj.usedType === 'unused') {
                                var newItem = new fabric.Image(imgObj, {
                                    lockUniScaling: true,
                                });
                                this.state.selectedItem.remove(obj);
                                newItem.scaleToWidth(12);
                                newItem.set({ left: obj.left,
                                    top: obj.top,
                                    usedType: obj.usedType,
                                    visible:  obj.visible});
                                newItem.setCoords();
                                this.state.selectedItem.insertAt(newItem,i);
                            }
                        }.bind(this));
                        this.updateItemProperty('iconSpacing', this.state.selectedItem.iconSpacing);
                    }.bind(this);
                }.bind(this);
                reader.readAsDataURL(event.target.files[0]);
                break;
            case 'changeUsedSrc':
                //let filetype = propertyValue.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
                var reader = new FileReader();
                reader.onload = function (propertyValue) {
                    var imgObj = new Image();
                    imgObj.src = propertyValue.target.result;
                    imgObj.onload = function () {
                        this.state.selectedItem.set('usedSource', propertyValue.target.result);
                        this.state.selectedItem.forEachObject(function(obj, i) {
                            if(obj.usedType === 'used') {
                                var newItem = new fabric.Image(imgObj, {
                                    lockUniScaling: true,
                                });
                                this.state.selectedItem.remove(obj);
                                newItem.scaleToWidth(12);
                                newItem.set({ left: obj.left,
                                    top: obj.top,
                                    usedType: obj.usedType,
                                    visible:  obj.visible});
                                newItem.setCoords();
                                this.state.selectedItem.insertAt(newItem,i);
                            }
                        }.bind(this));
                        this.updateItemProperty('iconSpacing', this.state.selectedItem.iconSpacing);
                    }.bind(this);
                }.bind(this);
                reader.readAsDataURL(event.target.files[0]);
                break;
            case 'changeVideoSrc':
                this.saveVideo(propertyValue.target.files[0]);
                return;
            case 'removeSavedVideo':
                this.clearVideo();
                return;
            default:
                this.state.selectedItem.set(propertyName, propertyValue);
                break;
        }
        this.state.selectedItem.setCoords();
        this.canvas.requestRenderAll();
    }

    createNewCanvasItem = (itemType, event) => {
        switch(itemType) {
            case CanvasItemTypes.TEXT:
                var newItem = new fabric.RawText("Enter Text Here");
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
                    if(this.canvas.getObjects('timer').length != 0) {
                        alert('Only one timer allowed at a time. Remove the existing timer and try again');
                        return
                    }
                var newItem = new fabric.Timer("60:00");
                newItem.on('modified',  () => {
                    var newfontsize = (newItem.fontSize * newItem.scaleX);
                    newItem.width = newItem.width * newItem.scaleX;
                    newItem.fontSize = (parseInt(newfontsize, 10));
                    newItem.height = newItem.height * newItem.scaleY;
                    newItem.scaleX = 1;
                    newItem.scaleY = 1;
                    this.updateSelectedItem(newItem, itemType);
                });
                break;
            case CanvasItemTypes.VISUALCOUNTER:
                if(this.canvas.getObjects('numericCounter').length != 0 || this.canvas.getObjects('visualCounter').length != 0) {
                    alert('Only one counter allowed at a time. Remove the existing counter and try again');
                    return
                }
                var group = [], tmpObj = null, objWidth = 0, iconSpacing = 12;

                fabric.Image.fromURL("assets/images/lock-solid.png", function(object) {
                    tmpObj = object.set({
                        left: 0,
                        usedType: 'unused',
                        visible: true
                    });
                    tmpObj.scaleToWidth(12);
                    group.push(tmpObj);
                    fabric.Image.fromURL("assets/images/ex-solid.png", function(object) {
                        tmpObj = object.set({
                            left: 0,
                            usedType: 'used',
                            visible: false
                        });
                        tmpObj.scaleToWidth(12);
                        group.push(tmpObj);
                        var newItem = new fabric.VisualCounter(group);
                        newItem.on('modified', () => {
                            this.updateSelectedItem(newItem, itemType);
                        });
                        newItem.on('selected', () => {
                            this.updateSelectedItem(newItem, itemType);
                        });
                        this.canvas.add(newItem);
                        newItem.center();
                        this.canvas.setActiveObject(newItem);
                        this.updateItemProperty('numberOfClues', 3);
                        this.updateSelectedItem(newItem, itemType);
                    }.bind(this));
                }.bind(this));
                break;
            case CanvasItemTypes.NUMERICCOUNTER:
                    if(this.canvas.getObjects('numericCounter').length != 0 || this.canvas.getObjects('visualCounter').length != 0) {
                        alert('Only one counter allowed at a time. Remove the existing counter and try again');
                        return
                    }
                    var newItem = new fabric.NumericCounter("3");
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
            case CanvasItemTypes.CLUEDISPLAY:
                if(this.canvas.getObjects('clueTextbox').length != 0) {
                    alert('Only one clue display allowed at a time. Remove the existing clue display and try again');
                    return
                }
                var newItem = new fabric.ClueTextbox("Clue Text will appear here, with the same properties as this display text, bounded by this box... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget mauris in eros efficitur sodales vel eu lectus. Curabitur dui felis, posuere non urna at, rhoncus efficitur ipsum.",
                {
                    width: this.canvas.width - 40,
                })
                newItem.on('scaling',  () => {
                    var newHeight = newItem.height * newItem.scaleY;
                    newItem.set({
                        width: newItem.width * newItem.scaleX,
                        scaleX: 1,
                    });
                    newItem.initDimensions();
                    newItem.set({ height: newHeight, scaleY: 1 })
                    console.log(newItem);
                });
                newItem.on('modified',  () => { 
                    var newfontsize = (newItem.fontSize * newItem.scaleX);
                    newItem.set({
                        width: newItem.width * newItem.scaleX,
                        height: newItem.height * newItem.scaleY,
                        scaleX: 1,
                        scaleY: 1,
                    });
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

    saveVideo = (videoFile) => {

        this.db.get(this.props.selectedRoomId + '\\breifVideo').then(function (doc) {
            this.db.remove(doc).then(function () {
                this.db.put({
                    _id: this.props.selectedRoomId + '\\breifVideo',
                    _attachments: {
                        'breifVideoFile': {
                        type: videoFile.type,
                        data: videoFile
                      }
                    }
                  }).then(this.setState({savedVideoName: videoFile.name})).catch(function (err) {
                    console.log(err);
                  });
            }.bind(this));
        }.bind(this)).catch(function(err) {
            if(err.name == 'not_found') {
                this.db.put({
                    _id: this.props.selectedRoomId + '\\breifVideo',
                    _attachments: {
                        'breifVideoFile': {
                        type: videoFile.type,
                        data: videoFile
                      }
                    }
                  }).then(this.setState({savedVideoName: videoFile.name})).catch(function (err) {
                    console.log(err);
                  });
            }
        }.bind(this));
    }

    clearVideo = () => {
        this.db.get(this.props.selectedRoomId + '\\breifVideo').then(function (doc) {
            this.db.remove(doc).catch(function (err) {
                    console.log(err);
                  }).then(this.setState({savedVideoName: 'N/A'}));
        }.bind(this)).catch(function(err) {
            console.log(err)
        });
    }

    dataURItoBlob = (dataURI) => {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);
    
        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    
        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
    
        return new Blob([ia], {type:mimeString});
    }

    saveImage = () => {
        var file = this.canvas.getObjects('fittableImage').length > 0 ? this.canvas.getObjects('fittableImage')[0] : null;
        var dataURL = file.toDataURL();
        var blob = this.dataURItoBlob(dataURL);
        this.db.get(this.props.selectedRoomId + '\\backgroundImg').then(function (doc) {
            this.db.remove(doc).then(function () {
                this.db.put({
                    _id: this.props.selectedRoomId + '\\backgroundImg',
                    _attachments: {
                        'backgroundImgFile': {
                        type: blob.type,
                        data: blob
                      }
                    }
                  }).then(function() {
                      console.log('image saved')
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
                        type: blob.type,
                        data: blob
                  }
                }
              }).then(function() {
                console.log('new image saved');
            }.bind(this)).catch(function (err) {
              console.log(err);
            });
            };
        }.bind(this));
        
    }

    updateAspectRatio = (ratio) => {
        
        if(ratio && ratio!='') {
            this.setState({aspectRatio: ratio});
        }
        switch(ratio) {
            case '16:9':
                this.setState({ aspectWidth:`calc(${this.state.aspectDominantDimension=='width' ? containerWidth : containerHeight} * ${this.state.aspectDominantDimension=='width' ? 1 : AspectRatios.ratio16_9.width/AspectRatios.ratio16_9.height} )`,
                    aspectHeight: `calc(${this.state.aspectDominantDimension=='width' ? containerWidth : containerHeight} * ${this.state.aspectDominantDimension=='width' ? AspectRatios.ratio16_9.height/AspectRatios.ratio16_9.width : 1} )`
                });
                this.canvas.setWidth(AspectRatios.ratio16_9.width) ;  
                this.canvas.setHeight(AspectRatios.ratio16_9.height);
                break;
            case '4:3':
                this.setState({ aspectWidth:`calc(${this.state.aspectDominantDimension=='width' ? containerWidth : containerHeight} * ${this.state.aspectDominantDimension=='width' ? 1 : AspectRatios.ratio4_3.width/AspectRatios.ratio4_3.height} )`,
                    aspectHeight: `calc(${this.state.aspectDominantDimension=='width' ? containerWidth : containerHeight} * ${this.state.aspectDominantDimension=='width' ? AspectRatios.ratio4_3.height/AspectRatios.ratio4_3.width : 1} )`
                });
                this.canvas.setWidth(AspectRatios.ratio4_3.width) ;  
                this.canvas.setHeight(AspectRatios.ratio4_3.height);
                break;
            case '1:1':
                this.setState({ aspectWidth:`calc(${this.state.aspectDominantDimension=='width' ? containerWidth : containerHeight} * ${this.state.aspectDominantDimension=='width' ? 1 : AspectRatios.ratio1_1.width/AspectRatios.ratio1_1.height} )`,
                    aspectHeight: `calc(${this.state.aspectDominantDimension=='width' ? containerWidth : containerHeight} * ${this.state.aspectDominantDimension=='width' ? AspectRatios.ratio1_1.height/AspectRatios.ratio1_1.width : 1} )`
                });
                this.canvas.setWidth(AspectRatios.ratio1_1.width) ;  
                this.canvas.setHeight(AspectRatios.ratio1_1.height);
                break;
            default:
                return;
            
        }
        this.canvas.setDimensions({
            width: '100%',
            height: '100%'
            },{
            cssOnly: true
            });
    }

    updateDimensions = () => {
        let editorContainer = document.getElementById('canvasInteractionLayer');
        let canvasContainer = document.getElementById('aspectPanel');
        let appNavDrawer = document.getElementById('appNavigationDrawer');
        if(!editorContainer || !canvasContainer) {
            console.log('containers dont exist');
            return
        }
        console.log('width:' + ((canvasContainer.clientWidth+140)/(editorContainer.clientWidth)) + 'height:' + (canvasContainer.clientHeight+200)/editorContainer.clientHeight);
        if(this.state.aspectDominantDimension=='width' && (canvasContainer.clientWidth+140)/(editorContainer.clientWidth) < ((canvasContainer.clientHeight+200)/editorContainer.clientHeight)-0.01) {
            console.log('flipped to height');
            this.setState({aspectDominantDimension:'height'})
            this.updateAspectRatio(this.state.aspectRatio);
        }
        else if(this.state.aspectDominantDimension=='height' && (canvasContainer.clientWidth+140)/(editorContainer.clientWidth) > (canvasContainer.clientHeight+200)/editorContainer.clientHeight) {
            console.log('flipped to width');
            this.setState({aspectDominantDimension:'width'})
            this.updateAspectRatio(this.state.aspectRatio);
        }
        
    }

    loadJSON = async () => {
        this.db.get(this.props.selectedRoomId + '\\liveScreen').then(function(doc) {
            this.updateAspectRatio(doc.canvasAspectRatio);
            setTimeout(function(){
                console.log('fired from loadJSON');
                window.dispatchEvent(new Event('resize'));
            }, 1);
            this.canvas.loadFromJSON(doc.canvasJSON,
            this.updateSelectedItem(null, CanvasItemTypes.SCREEN));
            this.setState({savedVideoName: doc.videoName || 'N/A'});
            setTimeout(function(){
                console.log('loading done');
                this.setState({loading:false});
            }.bind(this), 400);
        }.bind(this)).catch(function (err) {
            //TODO:[V1 Mandatory] create fresh canvas if one does not exist
            console.log(err);
        }.bind(this))
    };

    //TODO:[V1.1 Preferable] add center snap lines to canvas
    //TODO:[V1.1 Mandatory] make save button prettier. Add top bar and put it there. Bar will allow for undo and redo buttons down the road.
    saveJSON = async () => {
        this.setState({saving: true}, ()=>{
            this.saveImage();
        let canvasJSON = this.canvas.toJSON();
        console.log(canvasJSON);
        this.db.get(this.props.selectedRoomId + '\\liveScreen').then(function (doc) {
            doc.canvasJSON=canvasJSON;
            doc.canvasAspectRatio=this.state.aspectRatio;
            doc.totalTime = this.canvas.getObjects('timer').length > 0 ? this.canvas.getObjects('timer')[0].totalTime : 60;
            doc.numberOfClues = this.canvas.getObjects('visualCounter').length > 0 ? this.canvas.getObjects('visualCounter')[0].numberOfClues : 
                                this.canvas.getObjects('numericCounter').length > 0 ? this.canvas.getObjects('numericCounter')[0].numberOfClues : 3;
            doc.counterType = this.canvas.getObjects('visualCounter').length > 0 ? 'visualCounter' : 
                            this.canvas.getObjects('numericCounter').length > 0 ? 'numericCounter' : null;
            doc.videoName = this.state.savedVideoName;
            this.db.put(doc).catch(function (err) {
                console.log(err);
            });
            setTimeout(() => {
                console.log('save complete')
                this.setState({saving:false,saveCompleted:true});
                setTimeout(() => {
                    console.log('reset button state')
                    this.setState({saving:false,saveCompleted:false});
                  }, 1500); 
              }, 500);    
        
        }.bind(this)).catch(function (err) {
                if(err.name=="not_found") {
                    this.db.put({
                        _id: this.props.selectedRoomId + '\\liveScreen',
                        canvasJSON: canvasJSON,
                        canvasAspectRatio: this.state.aspectRatio,
                        totalTime: this.canvas.getObjects('timer').length > 0 ? this.canvas.getObjects('timer')[0].totalTime : 60,
                        numberOfClues: (this.canvas.getObjects('visualCounter').length > 0 ? this.canvas.getObjects('visualCounter')[0].numberOfClues : 
                                        this.canvas.getObjects('numericCounter').length > 0 ? this.canvas.getObjects('numericCounter')[0].numberOfClues : 3),
                        counterType: (this.canvas.getObjects('visualCounter').length > 0 ? 'visualCounter' : 
                                        this.canvas.getObjects('numericCounter').length > 0 ? 'numericCounter' : null)
                    }).catch(function (err) {
                        console.log(err);
                    });
                }
            }.bind(this));
        });
    };

    render() {
        const { anchorEl } = this.state;
        const { classes } = this.props;
        //TODO:[V1.1 Preferable] Fix canvas slide on open side menu. Its ugly now but better than it was. Need to be able to get sidebar size and set this dynamically
        return(
            <Grid id='editorContainer' container direction='row' justify='flex-end' alignItems='stretch' spacing={0} className={classes.editorContainer}>
                <Grid item container direction='column' id='canvasInteractionLayer' justify='center' alignItems='center' className={classes.editingBackground}>
                    <Grid item xs id='saveButton' className={classes.saveButton}>
                        <Button
                            variant="contained"
                            disabled={this.state.saving}
                            onClick={this.saveJSON}
                            className={this.state.saveCompleted ? classes.saveSuccess : ''}
                            >
                            {this.state.saveCompleted ? <CheckIcon style={{marginRight: 8}}/> : <SaveIcon style={{marginRight: 8}}/>}
                            Save Changes
                        </Button>
                        {this.state.saving && <CircularProgress size={24} className={classes.saveProgress}/>}
                    </Grid>
                    <Grid item id='aspectPanel' style={{
                                                            width: this.state.aspectWidth,
                                                            height: this.state.aspectHeight,
                                                            position: 'absolute',
                                                        }}>
                        <canvas id= 'mainCanvas'>
                        </canvas>
                    </Grid>
                    <Grid item justify='center' alignItems='center' id='loadingMask' className={classes.loadingMask} style={{display: this.state.loading ? 'flex' : 'none'}}>
                        <CircularProgress />
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