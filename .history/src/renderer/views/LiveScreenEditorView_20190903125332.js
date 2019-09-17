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
import TimerEditPanel from '../components/LiveViewEditor/EditPanels/TimerEditPanel.js';
import VisualCounterEditPanel from '../components/LiveViewEditor/EditPanels/VisualCounterEditPanel.js';
import NumericCounterEditPanel from '../components/LiveViewEditor/EditPanels/NumericCounterEditPanel.js';
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
const aspectRatio2 = 1;
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
    VISUALCOUNTER: 'visualcounter',
    NUMERICCOUNTER: 'numericcounter',
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
        outlineColor: 'transparent'
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



class LiveScreenEditorView extends Component {

    constructor(props) {
        super(props);
        this.state={fileInputRef: React.createRef(), anchorEl: null, selectedNavPanelType: NavPanelTypes.SCREEN, selectedEditPanelType: EditPanelTypes.ASPECTRATIO, 
            aspectRatio: "16:9", aspectWidth: `calc(${containerWidth} * ${aspectWidthRatio} )`, aspectHeight: `calc(${containerWidth} * ${aspectHeightRatio} )`,
            aspectDominantDimension: 'width'};
        this.objects = [];
        this.db = new PouchDB('kittens');
    }

    componentDidUpdate(prevProps, prevState) {
        
    }

    componentDidMount() {
        var oldCanvas = document.getElementById('mainCanvas');
        window.addEventListener("resize", this.updateDimensions());
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

        fabric.ClueTextbox = fabric.util.createClass(fabric.Textbox, {
            type: 'cluetextbox',
             /**
             * Properties which when set cause object to change dimensions
             * @type Object
             * @private
             */
            _dimensionAffectingProps: fabric.IText.prototype._dimensionAffectingProps.slice(0),

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

        fabric.FittableImage = fabric.util.createClass(fabric.Image, {
            type: 'fittableimage',

            initialize: function(element, options) {
                options || (options = { });

                this.callSuper('initialize', element, options);
                this.set('fit', options.fit || 'none');
            },

            toObject: function() {
                return fabric.util.object.extend(this.callSuper('toObject'), {
                fit: this.get('fit')
                });
            },
        });

        fabric.VisualCounter = fabric.util.createClass(fabric.Object, {
            type: 'visualcounter',

            //get width of each icon, have property for space between them, set default spacing to width of icon
            initialize: function(element, options) {
                options || (options = { });
                this.callSuper('initialize', element, options);
                this.set('numberOfClues', options.numberOfClues || 3);
                this.set('imageSpacing', options.imageSpacing || 12);
                this.set('imageSize', options.imageSize || 12);
                this.set('unusedSource', options.usedStatus || 'unused');
            },

            toObject: function() {
                return fabric.util.object.extend(this.callSuper('toObject'), {
                    numberOfClues: this.get('numberOfClues'),
                    imageSpacing: this.get('imageSpacing'),
                    imageSize: this.get('imageSize'),
                    usedSource: this.get('usedStatus'),
                });
            },
        });

        fabric.CounterImage = fabric.util.createClass(fabric.Image, {
            type: 'counterimage',

            initialize: function(element, options) {
                options || (options = { });

                this.callSuper('initialize', element, options);
            },

            /**
             * Creates an instance of fabric.Image from an URL string
             * @static
             * @param {String} url URL to create an image from
             * @param {Function} [callback] Callback to invoke when image is created (newly created image is passed as a first argument)
             * @param {Object} [imgOptions] Options object
             */
            fromURL: function(url, callback) {
                let filetype = url.slice((url.lastIndexOf(".") - 1 >>> 0) + 2);
                if (filetype === 'svg') {
                    return fabric.loadSVGFromURL(url,callback);
                }
                else {
                    return this.callSuper('fromURL', url, callback)
                }
            },

            toObject: function() {
                return fabric.util.object.extend(this.callSuper('toObject'), {
                });
            },
        });

        fabric.Timer = fabric.util.createClass(fabric.IText, {
            type: 'timer',

            initialize: function(element, options) {
                options || (options = { });

                this.callSuper('initialize', element, options);
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
    }

    updateDimensions = (ratio) => {
        console.log('updating dimensions ' + ratio);
        let editorContainer = document.getElementById('canvasInteractionLayer');
        let canvasContainer = document.getElementById('aspectPanel');
        console.log('width:' + ((canvasContainer.clientWidth+140)/editorContainer.clientWidth) + 'height:' + (canvasContainer.clientHeight+200)/editorContainer.clientHeight);
        if(this.state.aspectDominantDimension=='width' && (canvasContainer.clientWidth+140)/editorContainer.clientWidth < (canvasContainer.clientHeight+200)/editorContainer.clientHeight) {
            console.log('flipped');
            this.setState({aspectDominantDimension:'height'}, this.updateAspectRatio(ratio || this.state.aspectRatio))
        }
        else if(this.state.aspectDominantDimension=='height' && (canvasContainer.clientWidth+140)/editorContainer.clientWidth > (canvasContainer.clientHeight+200)/editorContainer.clientHeight) {
            console.log('flipped');
            this.setState({aspectDominantDimension:'width'}, this.updateAspectRatio(ratio || this.state.aspectRatio))
        }
        
        console.log('updating dimensions finished');
    }

    handleKeyPress = (e) => {
        console.log(e.which);
        if([8, 46].includes(e.which)) {
            this.canvas.remove(this.canvas.getActiveObject());
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
                console.log('original:' + oldClueCount + ' new:' + propertyValue);
                this.state.selectedItem.set(propertyName, propertyValue);
                if (this.state.selectedItem.get('type') !== 'group') {
                    this.state.selectedItem.set("text", propertyValue);
                    break;
                }
                var groupWidth = (this.state.selectedItem.iconSpacing*(propertyValue))+(iconSize*propertyValue);
                var groupHeight = (this.state.selectedItem.get('height'));
                this.state.selectedItem.set({
                    width: groupWidth,
                });
                if (oldClueCount < propertyValue) {
                    for (let i = Number(oldClueCount)+1; i <= propertyValue; i++) { 
                        fabric.Image.fromURL(this.state.selectedItem.unusedSource, function(object) {
                            let tmpObj = object.set({ left: (this.state.selectedItem.iconSpacing+this.state.selectedItem.iconSize)*i,
                                                        top: -(groupHeight/2),
                                                        usedType: 'unused',
                                                        visible: this.state.selectedItem.usedStatus == 'unused'});
                            tmpObj.scaleToWidth(12);
                            tmpObj.setCoords();
                            this.state.selectedItem.insertAt(tmpObj,(i*2)-1);
                            this.canvas.requestRenderAll();
                            //dumb fix for group not rendering after updating clue count
                            this.updateItemProperty('iconSpacing', this.state.selectedItem.iconSpacing);
                        }.bind(this));
                        fabric.Image.fromURL(this.state.selectedItem.usedSource, function(object) {
                            let tmpObj = object.set({ left: (this.state.selectedItem.iconSpacing+this.state.selectedItem.iconSize)*i,
                                                        top: -(groupHeight/2),
                                                        usedType: 'used',
                                                        visible: this.state.selectedItem.usedStatus == 'used'});
                            tmpObj.scaleToWidth(12);
                            tmpObj.setCoords();
                            this.state.selectedItem.insertAt(tmpObj, i*2);
                            this.canvas.requestRenderAll();
                            //dumb fix for group not rendering after updating clue count
                            this.updateItemProperty('iconSpacing', this.state.selectedItem.iconSpacing);
                        }.bind(this));
                    }
                }
                else {
                    //note: items is zero indexed
                    var items = this.state.selectedItem.getObjects();
                    for (let i = oldClueCount; i >= propertyValue; i--) {
                        this.state.selectedItem.remove(items[(i*2)]);
                        this.state.selectedItem.remove(items[(i*2)+1]);
                    }
                    this.canvas.requestRenderAll();
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
                    active: function () {
                        this.state.selectedItem.set(propertyName, propertyValue);
                        this.canvas.requestRenderAll();
                    }.bind(this), 
                });
                break;
            case 'aspectRatio':
                this.updateAspectRatio(propertyValue);
                this.updateDimensions(propertyValue);
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
                    }.bind(this);
                }.bind(this);
                reader.readAsDataURL(event.target.files[0]);
                break;
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
                var newItem = new fabric.IText("Enter Text Here", {
                    fontSize: 40,
                    fontFamily: 'Roboto',
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
                var newItem = new fabric.Timer("60:00", {
                    fontSize: 40,
                    fontFamily: 'Roboto',
                    charSpacing: 10,
                    editable: false,
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
                    this.updateSelectedItem(newItem, itemType);
                });
                break;
            case CanvasItemTypes.VISUALCOUNTER:
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
                        var newItem = new fabric.Group(group, {
                            lockUniScaling: true,
                            numberOfClues: 1,
                            iconSpacing: 12,
                            iconSize: 12,
                            usedStatus: 'unused',
                            unusedSource: 'assets/images/lock-solid.png',
                            usedSource: 'assets/images/ex-solid.png'
                        });
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
                    var newItem = new fabric.IText("3", {
                        fontSize: 40,
                        fontFamily: 'Roboto',
                        numberOfClues: 3,
                        countDirection: 'down',
                        lineHeight: 1,
                        charSpacing: 10,
                        editable: false,
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
            case CanvasItemTypes.CLUEDISPLAY:
                var newItem = new fabric.ClueTextbox("Clue Text will appear here, with the same properties as this display text, bounded by this box... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget mauris in eros efficitur sodales vel eu lectus. Curabitur dui felis, posuere non urna at, rhoncus efficitur ipsum.")
                newItem.set({
                    fontSize: 40,
                    fontFamily: 'Roboto',
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

    updateAspectRatio = (ratio) => {
        console.log('updating ratio' + ratio);
        this.setState({aspectRatio: ratio});
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
        }
        this.canvas.setDimensions({
            width: '100%',
            height: '100%'
            },{
            cssOnly: true
            });
        console.log('updating ratio finished');
    }

    render() {
        const { anchorEl } = this.state;
        const { classes } = this.props;

        return(
            <Grid id='editorContainer' container direction='row' justify='flex-end' alignItems='stretch' spacing={0} className={classes.editorContainer}>
                <Grid item container direction='column' id='canvasInteractionLayer' justify='center' alignItems='center' className={classes.editingBackground}>
                    <Grid item id='aspectPanel' style={{
                                                            width: this.state.aspectWidth,
                                                            height: this.state.aspectHeight,
                                                            margin: '100px 70px',
                                                        }}>
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