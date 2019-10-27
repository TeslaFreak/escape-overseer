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
    ButtonRow: {
        fontSize: '12px',
        width: '100%',
        padding: '12px 0px',
    },
    LeftRowButton: {
        fontSize: '12px',
        fontWeight: '600',
        height: '40px',
        borderRadius: '3px 0 0 3px',
        backgroundColor: '#3e4c58',
        color: '#fff',
        opacity: '.5',
        padding: '0px 10px',
        '&:hover': {
            opacity: 1,
            backgroundColor: '#3e4c58',
        },
    },
    CenterRowButton: {
        fontSize: '12px',
        fontWeight: '600',
        height: '40px',
        borderRadius: '0',
        backgroundColor: '#3e4c58',
        color: '#fff',
        opacity: '.5',
        padding: '0px 10px',
        '&:hover': {
            opacity: 1,
            backgroundColor: '#3e4c58',
        },
        '&:active': {
            backgroundColor: '#242c33',
            opacity: 0.8,
        }
    },
    RightRowButton: {
        fontSize: '12px',
        fontWeight: '600',
        height: '40px',
        borderRadius: '0 3px 3px 0',
        backgroundColor: '#3e4c58',
        color: '#fff',
        opacity: '.5',
        padding: '0px 10px',
        '&:hover': {
            opacity: 1,
            backgroundColor: '#3e4c58',
        },
    },
    rowButtonSelected: {
        backgroundColor: '#242c33',
        opacity: 0.8,
        '&:hover': {
            backgroundColor: '#242c33',
        }
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

class VideoEditPanel extends Component {

    constructor(props) {
        super(props);
        this.state={};
        this.objects = [];
        this.db = new PouchDB('kittens');
        
    }

    componentDidUpdate(prevProps, prevState) {
        
    }

    componentDidMount() {

    }

    componentWillUpdate(nextProps) {
        
    }

    handleChange = (event, value, propertyName) => {
        let trueValue = value;
        let displayValue = value;
        switch(propertyName) {
            case 'changeVideoSrc':
                break;
            case 'removeSavedVideo':
                break;
            default:
                trueValue = parseInt(value, 10);
                displayValue = parseInt(value, 10);
        }
        this.setState({[propertyName]: displayValue});
        this.props.updateItemProperty(propertyName, value);
    }

    
    //TODO:[V1 Mandatory] have some confirmation that video is done loading, and show currently loaded file name when canvas loads
    render() {
        const { classes } = this.props;
        return(
            <Grid container direction='column' >
                <Typography className={classes.editPanelSubsectionHeader}>Video</Typography>
                <Grid item >
                    <Typography className={classes.controlElementLabel}>Upload intro video</Typography>
                    <input
                        accept="video/*"
                        style={{ display: 'none' }}
                        id="image-input"
                        multiple
                        type="file"
                        onChange={(event) => this.handleChange(event, event,'changeVideoSrc')}
                        ref={(ref) => this.videoInputRef = ref}
                        />
                    <label htmlFor="image-input">
                        <IconButton disableRipple className={classNames(classes.CenterRowButton)} 
                                        onClick={(event) => this.videoInputRef.click()}>
                                Upload
                        </IconButton>
                    </label>
                </Grid>
                <Grid item >
                    <Typography className={classes.controlElementLabel}>Clear saved video</Typography>
                        <IconButton disableRipple className={classNames(classes.CenterRowButton)} 
                                        onClick={(event) => this.handleChange(event, event, 'removeSavedVideo')}>
                                Clear
                        </IconButton>
                </Grid>
            
            </Grid>
        );
    }
}

export default  withStyles(styles)(VideoEditPanel)