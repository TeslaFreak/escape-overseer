import React, { Component } from 'react';
import Meter from 'grommet/components/Meter';
import TimeDisplay from '../components/TimeDisplay';
import ClueCountDisplay from '../components/ClueCountDisplay';
import ClueDisplay from '../components/ClueDisplay';
import classNames from 'classnames';
import { withStyles, withTheme } from '@material-ui/core/styles';
import Box from 'grommet/components/Box';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import { Grid } from '@material-ui/core';
import PouchDB from 'pouchdb';
import { fabric } from 'fabric';
const electron = window.require('electron')
var WebFont = window.require('webfontloader');


const styles = theme => ({
  background: {
    height: '100vh',
    width: '100%',
    outlineColor: 'transparent'
  },
  alwaysVisible: {
    paddingTop: '3%'
  },
  videoPlayer: {
    objectFit: 'contain',
    objectPosition: '50% 50%',
    height: '100vh',
    backgroundColor: 'black'
  },
  editingBackground: {
    backgroundColor: '#ededed',
    height: '100%',
    width: '100%'
},
});

const appbarHeight = 64;

const aspectRatio = 0.5625;
const aspectWidthRatio = 1;
const aspectHeightRatio = aspectRatio;
const containerWidth = `calc(100vw)`;
const containerHeight = `calc(100vh)`;


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

//TODO: get fonts to load in properly
//TODO: hook up timer control to live screen
//TODO: hook up clue text
//TODO: hook up clue counters (visual and numeric, make new controller for numeric counter)
class LiveScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { minutes: 60, seconds:0,
                    clue1Used: false, clue2Used: false, clue3Used: false,
                    clue: '',
                    playVideo: false,
                    selectedRoomId: null,
                    aspectWidth: `calc(${containerWidth} * ${aspectWidthRatio} )`, aspectHeight: `calc(${containerWidth} * ${aspectHeightRatio} )`,
                    aspectDominantDimension: 'width'};

    document.documentElement.style.overflow = 'hidden';
    this.db = new PouchDB('kittens');
  }

  componentDidMount() {
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
                    families: [object.fontFamily || 'Roboto'] 
                },
                active: function () {
                    this.canvas.requestRenderAll();
                }.bind(this), 
        });
        let newItem = new fabric.RawText(object.text, object);
        newItem.set('selectable', false);
        callback && callback(newItem);
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
                    families: [object.fontFamily || 'Roboto'] 
                },
                active: function () {
                    this.canvas.requestRenderAll();
                }.bind(this), 
        });
        let newItem = new fabric.ClueTextbox(object.text, object);
        newItem.set('selectable', false);
        callback && callback(newItem);
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
        var imgObj = new Image();
        imgObj.src = object.src;
        imgObj.onload = function () {
            var newItem = new fabric.FittableImage(imgObj, object);
            newItem.set('selectable', false);
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

        updateNumerOfClues: function(newValue, _this) {
            var oldClueCount = this.numberOfClues;
            console.log('original:' + oldClueCount + ' new:' + newValue);
            this.set('numberOfClues', newValue);
            var groupWidth = (this.iconSpacing*(newValue))+(this.iconSize*newValue);
            var groupHeight = (this.get('height'));
            this.set({width: groupWidth});
            if (oldClueCount < newValue) {
                for (let i = Number(oldClueCount)+1; i <= newValue; i++) { 
                    fabric.Image.fromURL(this.unusedSource, function(object) {
                        let tmpObj = object.set({ left: (this.iconSpacing+this.iconSize)*i,
                                                    top: -(groupHeight/2),
                                                    usedType: 'unused',
                                                    visible: true});
                        tmpObj.scaleToWidth(12);
                        this.insertAt(tmpObj,(i*2)-1);
                        this.updateIconSpacing(this.iconSpacing, _this);
                    }.bind(this));
                    fabric.Image.fromURL(this.usedSource, function(object) {
                        let tmpObj = object.set({ left: (this.iconSpacing+this.iconSize)*i,
                                                    top: -(groupHeight/2),
                                                    usedType: 'used',
                                                    visible: this.usedStatus == 'used'});
                        tmpObj.scaleToWidth(12);
                        this.insertAt(tmpObj, i*2);
                        this.updateIconSpacing(this.iconSpacing, _this);
                    }.bind(this));
                }
                this.updateIconSpacing(this.iconSpacing, _this);
            }
            else {
                //note: items is zero indexed
                var items = this.getObjects();
                for (let i = oldClueCount; i >= newValue; i--) {
                    this.remove(items[(i*2)]);
                    this.remove(items[(i*2)+1]);
                }
                this.updateIconSpacing(this.iconSpacing, _this);
            }
        },

        updateIconSpacing: function(newValue, _this) {
            var groupWidth = (newValue*(this.numberOfClues-1))+(this.iconSize*this.numberOfClues);
            this.set('iconSpacing', newValue);
            this.forEachObject(function(obj, i) {
                if(i == 0 || i == 1) {
                    obj.set({left: -(groupWidth / 2)})
                }
                else{
                    if(i%2 == 0) {
                        obj.set({ left: -(groupWidth / 2) + (newValue+this.iconSize)*(i/2)})
                    }
                    else{
                        obj.set({ left: -(groupWidth / 2) + (newValue+this.iconSize)*((i/2)-0.5)})
                    }
                    
                }
            }.bind(this));
            
            this.set({
                width: groupWidth
            });
            this.setCoords();
            _this.canvas.requestRenderAll();
        }
    });

    fabric.VisualCounter.fromObject = function(object, callback, forceAsync) {
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
            newItem.updateNumerOfClues(object.numberOfClues, this);
            newItem.set('selectable', false);
            
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

        updateNumerOfClues: function(newValue) {
            var oldClueCount = this.numberOfClues;
                console.log('original:' + oldClueCount + ' new:' + newValue);
                this.set('numberOfClues', newValue);
                if (this.get('type') !== 'visualCounter') {
                    this.set("text", newValue);
                    return;
                }
        }
    });

    fabric.NumericCounter.fromObject = function(object, callback, forceAsync) {
        WebFont.load({
            google: { 
                    families: [object.fontFamily || 'Roboto'] 
                },
                active: function () {
                    this.canvas.requestRenderAll();
                }.bind(this), 
        });
        let newItem = new fabric.NumericCounter(object.text, object);
        newItem.set('selectable', false);
        callback && callback(newItem);
    }.bind(this);

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
                    families: [object.fontFamily] 
                },
                active: function () {
                    console.log('font loaded')
                    this.canvas.requestRenderAll();
                }.bind(this), 
                inactive: function() {
                    console.log('inactive');
                }.bind(this),
        });
        let newItem = new fabric.Timer(object.text, object);
        newItem.set('selectable', false);
        callback && callback(newItem);
    }.bind(this);

    this.canvas = new fabric.Canvas("mainCanvas", {
        width: 1920, 
        height: 1080,
        selection: false,
        backgroundColor: '#fff',
        preserveObjectStacking: true,
        uniScaleTransform: true,
        hoverCursor: 'auto'});

        let editorContainer = document.getElementById('canvasInteractionLayer');
        let mainCanvas = document.getElementById('aspectPanel');
        this.canvas.setDimensions({
        width: '100%',
        height: '100%'
        },{
        cssOnly: true
        });
        editorContainer.tabIndex = 1000;
  }

  componentDidUpdate(prevProps, prevState) {
      if(prevState.selectedRoomId != this.state.selectedRoomId) {
        console.log('state updated')
          this.loadJSON();
      }
  }

  loadJSON = async () => {
      this.db.get(this.state.selectedRoomId + '\\liveScreen').then(function(doc) {
          console.log(JSON.stringify(doc.canvasAspectRatio))
          this.updateAspectRatio(doc.canvasAspectRatio);
          setTimeout(function(){
              console.log('fired from loadJSON');
              window.dispatchEvent(new Event('resize'));
          }, 1);
          this.canvas.loadFromJSON(doc.canvasJSON)
      }.bind(this)).catch(function (err) {
          console.log(err);
      }.bind(this))
  };

  playVideo = () => {
    this.setState({playVideo: true});
    return this.db.getAttachment(this.state.selectedRoomId + '\\breifVideo', 'breifVideoFile').then(function(blob) {
        var url = URL.createObjectURL(blob);
        var vidElement = document.getElementById('vid');
        vidElement.src = url;
    }).catch(function(err) {
        this.closeVideo();
    }.bind(this))
  }

  closeVideo = () => {
    this.setState({playVideo:false});
  }

  handleClose = () => {
    this.setState({ playVideo: false });
  };

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
    if(!editorContainer || !canvasContainer) {
        console.log('containers dont exist');
        return
    }
    console.log('width:' + ((canvasContainer.clientWidth+140)/editorContainer.clientWidth) + 'height:' + (canvasContainer.clientHeight+200)/editorContainer.clientHeight);
    if(this.state.aspectDominantDimension=='width' && (canvasContainer.clientWidth+140)/editorContainer.clientWidth < (canvasContainer.clientHeight+200)/editorContainer.clientHeight) {
        console.log('flipped to height');
        this.setState({aspectDominantDimension:'height'})
        this.updateAspectRatio(this.state.aspectRatio);
    }
    else if(this.state.aspectDominantDimension=='height' && (canvasContainer.clientWidth+140)/editorContainer.clientWidth > (canvasContainer.clientHeight+200)/editorContainer.clientHeight) {
        console.log('flipped to width');
        this.setState({aspectDominantDimension:'width'})
        this.updateAspectRatio(this.state.aspectRatio);
    }
    
  }

  render() {
    const { classes } = this.props;
    electron.ipcRenderer.on('updateLiveViewTimeDisplay', (event, min, sec) => {
      this.setState({minutes: min, seconds: sec});
    });
    electron.ipcRenderer.on('updateLiveViewClueDisplay', (event, clue) => {
      this.setState({clue: clue});
    });
    electron.ipcRenderer.on('updateLiveViewClueCountDisplay', (event, clue1Used, clue2Used, clue3Used) => {
      this.setState({clue1Used: clue1Used, clue2Used: clue2Used, clue3Used: clue3Used});
    });
    electron.ipcRenderer.on('roomSequence', (event, sequenceNodeId) => {
      this.playVideo();
    });
    electron.ipcRenderer.on('updateSelectedRoomId', (event, selectedRoomId) => {
      this.setState({selectedRoomId: selectedRoomId});
      console.log(selectedRoomId);
    });

    return (
      <div id='backgroundDiv' className={classNames(classes.background)}>
            <Grid item container direction='column' id='canvasInteractionLayer' justify='center' alignItems='center' className={classes.editingBackground}>
                    <Grid item id='aspectPanel' style={{width: this.state.aspectWidth,
                                                        height: this.state.aspectHeight}}>
                        <canvas id= 'mainCanvas'>
                        </canvas>
                    </Grid>
                </Grid>
            <Dialog
                id='vidDialogue'
                fullScreen
                open={this.state.playVideo}
                onClose={this.handleClose}
            >
                <video className={classNames(classes.videoPlayer)} id='vid' controls={false} autoPlay={true} onEnded={this.closeVideo} style={this.state.playVideo ? {} : { display: 'none' }}/>
            </Dialog>
            </div>
    )
  }

  componentWillUnmount() {
    
  }
}

export default withStyles(styles)(LiveScreen);
