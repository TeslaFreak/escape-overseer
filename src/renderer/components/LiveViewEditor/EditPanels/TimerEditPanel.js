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
    fontPicker: {
        width: '100%',
        padding: '12px 0px',
    },
    fontSlider: {
        paddingTop: '12px',
    },
    sliderContainer: {
        padding: '12px 0px',
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
        this.state={fontSize: this.props.selectedItem.fontSize, charSpacing: this.props.selectedItem.charSpacing/10, lineHeight: this.props.selectedItem.lineHeight**2};
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
            this.setState({fontSize: nextProps.selectedItem.fontSize, charSpacing: nextProps.selectedItem.charSpacing/10, lineHeight: nextProps.selectedItem.lineHeight**2})
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
                        activeFont={this.props.selectedItem.fontFamily}
                        options={{limit:100}}
                        onChange={nextFont => this.updateLiveViewTypeFace(nextFont)}
                        className={classes.fontPicker}
                    />
                </Grid>
                <Grid item container direction='row' id='FontAlignRow' className={classes.alignmentButtonRow}>
                    <Grid item>
                        <IconButton id='LeftAlignButton' disableRipple className={classes.alignLeftButton}>
                            <FormatAlignLeftIcon className={classes.alignIcon}/>
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton id='CenterAlignButton' disableRipple className={classes.alignCenterButton}>
                            <FormatAlignCenterIcon className={classes.alignIcon}/>
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton id='RightAlignButton'disableRipple className={classes.alignRightButton}>
                            <FormatAlignRightIcon className={classes.alignIcon}/>
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid item id='FontSizeSlider' className={classes.sliderContainer}>
                    <Typography className={classes.controlElementLabel}>Size</Typography>
                    <Tooltip title={this.state.fontSize} placement="top">
                    <Slider
                        classes={{
                            container: classes.sliderContainer,
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
                <Grid item id='LetterSpacingSlider' className={classes.fontSlider}>
                    <Typography className={classes.controlElementLabel}>Letter Spacing</Typography>
                    <Tooltip title={this.state.charSpacing} placement="top">
                    <Slider
                        classes={{
                            container: classes.sliderContainer,
                            thumb: classes.thumb,
                            thumbWrapper: classes.thumbWrapper,
                            track: classes.track,
                          }}
                        value={this.state.charSpacing}
                        min={0}
                        max={100}
                        onChange={(event, value) => this.handleChange(event, value, 'charSpacing')}
                    />
                    </Tooltip>
                </Grid>
                <Grid item id='LineSpacingSlider' className={classes.fontSlider}>
                    <Typography className={classes.controlElementLabel}>Line Spacing</Typography>
                    <Tooltip title={this.state.lineHeight} placement="top">
                    <Slider
                        classes={{
                            container: classes.sliderContainer,
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
                </Grid>
            </Grid>
        );
    }
}

export default  withStyles(styles)(TypeEditPanel)