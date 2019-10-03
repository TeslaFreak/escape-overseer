import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Slider from '@material-ui/lab/Slider';
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
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';
import TextIcon from '@material-ui/icons/Title';
import ColorIcon from '@material-ui/icons/ColorLens';
import ClueIcon from '@material-ui/icons/Lock';
import AddClueIcon from '@material-ui/icons/EnhancedEncryption';
import Tooltip from '@material-ui/core/Tooltip';
var WebFont = window.require('webfontloader');
const electron = window.require('electron');
const uuidv4 = require('uuid/v4');

//google fonts API Key: AIzaSyDipkbeiVIwQoDKHnvmFCFQ1EoFW1_jw9E

const styles = theme => ({
    editPanelSubsectionHeader: {
        color: '#dce0e3',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    controlElementLabel: {
        fontSize: '12px',
        fontWeight: '400',
        color: '#dce0e3',
        padding: '18px 0px 12px 0px',
    },
    alignmentButtonRow: {
        width: '100%',
        padding: '12px 0px',
    },
    alignLeftButton: {
        width: '55px',
        height: '40px',
        borderRadius: '3px 0 0 3px',
        backgroundColor: '#3e4c58',
        color: '#fff',
        opacity: '.5',
        padding: '0',
        '&:hover': {
            opacity: 1,
            backgroundColor: '#3e4c58',
        },
    },
    alignCenterButton: {
        width: '55px',
        height: '40px',
        borderRadius: '0',
        backgroundColor: '#3e4c58',
        color: '#fff',
        opacity: '.5',
        padding: '0',
        '&:hover': {
            opacity: 1,
            backgroundColor: '#3e4c58',
        },
    },
    alignRightButton: {
        width: '55px',
        height: '40px',
        borderRadius: '0 3px 3px 0',
        backgroundColor: '#3e4c58',
        color: '#fff',
        opacity: '.5',
        padding: '0',
        '&:hover': {
            opacity: 1,
            backgroundColor: '#3e4c58',
        },
    },
    alignButtonSelected: {
        backgroundColor: '#242c33',
        opacity: 0.8,
        '&:hover': {
            backgroundColor: '#242c33',
        }
    },
    fontPicker: {
        width: '100%',
        padding: '12px 0px',
        zIndex: 3,
    },
    fontSlider: {
        paddingTop: '12px',
    },
    sliderContainer: {
        paddingLeft: '30px',
        paddingRight: '30px'
    },
    thumb: {
        cursor: 'pointer',
        background: '#35414c',
        borderRadius: '100px',
        boxShadow: '0 0 0 2px #f2f4f5  !important',
    },
    thumbWrapper: {
        backgroundColor: '#fff',
    },
    track: {
        background: '#6f7d86',
        opacity: 1,
    },
});

class TypeEditPanel extends Component {

    constructor(props) {
        super(props);
        this.state={fontSize: this.props.selectedItem.fontSize, charSpacing: this.props.selectedItem.charSpacing/10, lineHeight: this.props.selectedItem.lineHeight**2,
                    textLineLength: this.props.selectedItem.textLines.length, textAlign: this.props.selectedItem.textAlign, order: this.props.selectedItem.getZIndex(),
                    fontFamily: this.props.selectedItem.fontFamily};
        this.objects = [];
        this.db = new PouchDB('kittens');
        
    }

    componentDidUpdate(prevProps, prevState) {
        
    }

    componentDidMount() {

    }

    componentWillUpdate(nextProps) {
        //TODO: separate out for each state variable. here and in each edit panel file.
        if (this.state.fontSize !== nextProps.selectedItem.fontSize ) {
            this.setState({fontSize: nextProps.selectedItem.fontSize})
        }
        if (nextProps && nextProps.selectedItem.textLines && this.state.textLineLength !== nextProps.selectedItem.textLines.length) {
            this.setState({textLineLength: nextProps.selectedItem.textLines.length})
        }
        if (this.state.order !== nextProps.selectedItem.getZIndex()) {
            this.setState({order: nextProps.selectedItem.getZIndex()})
        }
        if (this.state.textAlign !== nextProps.selectedItem.textAlign) {
            this.setState({textAlign: nextProps.selectedItem.textAlign})
        }
        if (this.state.fontFamily !== nextProps.selectedItem.fontFamily) {
            this.setState({fontFamily: nextProps.selectedItem.fontFamily})
        }
        if (this.state.charSpacing !== nextProps.selectedItem.charSpacing) {
            this.setState({charSpacing: nextProps.selectedItem.charSpacing/10})
        }
        if (this.state.lineHeight !== nextProps.selectedItem.lineHeight) {
            this.setState({lineHeight: nextProps.selectedItem.lineHeight**2})
        }
    }

    handleChange = (event, value, propertyName) => {
        let roundedValue = value;
        let displayValue = value;
        switch(propertyName) {
            case 'charSpacing':
                roundedValue = parseInt(value, 10) * 10;
                displayValue = parseInt(value, 10);
                break;
            case 'lineHeight':
                roundedValue = parseInt(value,10)**0.5;
                displayValue = parseInt(value, 10);
                break;
            case 'fontFamily':
            case 'textAlign':
                roundedValue = value;
                displayValue = value;
                break;
            default:
                roundedValue = parseInt(value, 10);
                displayValue = parseInt(value, 10);
        }
        this.setState({[propertyName]: displayValue});
        this.props.updateItemProperty(propertyName, roundedValue);
    }

    render() {
        const { classes } = this.props;
        return(
            <Grid container direction='column' >
                <Typography id="FontFaceHeader" className={classes.editPanelSubsectionHeader}>Font Family</Typography>
                <Grid item id='FontFacePicker' className={classes.fontPicker}>
                    <FontPicker
                        apiKey="AIzaSyDipkbeiVIwQoDKHnvmFCFQ1EoFW1_jw9E"
                        activeFont={this.state.fontFamily}
                        options={{limit:100}}
                        onChange={(nextFont) => this.handleChange(null, nextFont.family, 'fontFamily')}
                        className={classes.fontPicker}
                    />
                </Grid>
                <Grid item container direction='row' id='FontAlignRow' className={classes.alignmentButtonRow}>
                    <Grid item>
                        <IconButton id='LeftAlignButton' disableRipple className={classNames(classes.alignLeftButton, this.state.textAlign == 'left' ? classes.alignButtonSelected : '')}
                                    onClick={(event) => this.handleChange(event, 'left', 'textAlign')}>
                            <FormatAlignLeftIcon className={classes.alignIcon}/>
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton id='CenterAlignButton' disableRipple className={classNames(classes.alignCenterButton, this.state.textAlign == 'center' ? classes.alignButtonSelected : '')}
                                    onClick={(event) => this.handleChange(event, 'center', 'textAlign')}>
                            <FormatAlignCenterIcon className={classes.alignIcon}/>
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton id='RightAlignButton'disableRipple className={classNames(classes.alignRightButton, this.state.textAlign == 'right' ? classes.alignButtonSelected : '')}
                                    onClick={(event) => this.handleChange(event, 'right', 'textAlign')}>
                            <FormatAlignRightIcon className={classes.alignIcon}/>
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid item id='FontSizeSlider' >
                    <Typography className={classes.controlElementLabel}>Size</Typography>
                    <Tooltip title={this.state.fontSize} placement="top">
                    <Slider
                        classes={{
                            thumb: classes.thumb,
                            thumbWrapper: classes.thumbWrapper,
                            track: classes.track,
                          }}
                        value={this.state.fontSize}
                        min={20}
                        max={500}
                        onChange={(event, value) => this.handleChange(event, value, 'fontSize')}
                    />
                    </Tooltip>
                </Grid>
                <Grid item id='LetterSpacingSlider' >
                    <Typography className={classes.controlElementLabel}>Letter Spacing</Typography>
                    <Tooltip title={this.state.charSpacing} placement="top">
                    <Slider
                        classes={{
                            thumb: classes.thumb,
                            thumbWrapper: classes.thumbWrapper,
                            track: classes.track,
                          }}
                        value={this.state.charSpacing}
                        min={1}
                        max={100}
                        onChange={(event, value) => this.handleChange(event, value, 'charSpacing')}
                    />
                    </Tooltip>
                </Grid>
                {this.state.textLineLength > 1 &&
                <Grid item id='LineSpacingSlider'>
                    <Typography className={classes.controlElementLabel}>Line Spacing</Typography>
                    <Tooltip title={this.state.lineHeight} placement="top">
                    <Slider
                        classes={{
                            thumb: classes.thumb,
                            thumbWrapper: classes.thumbWrapper,
                            track: classes.track,
                          }}
                        value={this.state.lineHeight}
                        min={1}
                        max={100}
                        onChange={(event, value) => this.handleChange(event, value, 'lineHeight')}
                    />
                    </Tooltip>
                </Grid>}
                <Grid item id='OrderSlider' >
                    <Typography className={classes.controlElementLabel}>Order</Typography>
                    <Tooltip title={this.state.order} placement="top">
                    <Slider
                        classes={{
                            thumb: classes.thumb,
                            thumbWrapper: classes.thumbWrapper,
                            track: classes.track,
                          }}
                        value={this.state.order}
                        min={0}
                        max={this.props.canvasObjectCount-1}
                        step={1}
                        onChange={(event, value) => this.handleChange(event, value, 'order')}
                    />
                    </Tooltip>
                </Grid>
            </Grid>
        );
    }
}

export default  withStyles(styles)(TypeEditPanel)