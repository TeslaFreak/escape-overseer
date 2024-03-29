import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PouchDataManager from '../PouchDataManager';
import { withStyles, withTheme } from '@material-ui/core/styles';
import classNames from 'classnames';
import Dialog from '@material-ui/core/Dialog';
import FontPicker from 'font-picker-react';
import ChromePicker from 'react-color';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
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

class TimerEditPanel extends Component {

    constructor(props) {
        super(props);
        this.state={showHours: this.props.selectedItem.showHours, showMinutes: this.props.selectedItem.showMinutes, showSeconds: this.props.selectedItem.showSeconds,
                    showMilliseconds: this.props.selectedItem.showMilliseconds, totalTime: this.props.selectedItem.totalTime};
        this.objects = [];
        this.db = PouchDataManager.localDB;
        
    }

    componentDidUpdate(prevProps, prevState) {
        
    }

    componentDidMount() {

    }

    componentWillUpdate(nextProps) {
        if (this.state.fontSize !== nextProps.selectedItem.fontSize ) {
            this.setState({fontSize: nextProps.selectedItem.fontSize})
        }
        if (this.state.charSpacing !== nextProps.selectedItem.charSpacing/10) {
            this.setState({charSpacing: nextProps.selectedItem.charSpacing/10})
        }
        if (this.state.lineHeight !== nextProps.selectedItem.lineHeight**2) {
            this.setState({lineHeight: nextProps.selectedItem.lineHeight**2})
        }
        if (this.state.showMinutes !== nextProps.selectedItem.showMinutes) {
            this.setState({showMinutes: nextProps.selectedItem.showMinutes})
        }
        if (this.state.showSeconds !== nextProps.selectedItem.showSeconds) {
            this.setState({showSeconds: nextProps.selectedItem.showSeconds})
        }
    }

    handleChange = (event, value, propertyName) => {
        let roundedValue = value;
        let displayValue = value;
        switch(propertyName) {
            default:
                roundedValue = value;
                displayValue = value;
        }
        this.setState({[propertyName]: displayValue});
        this.props.updateItemProperty(propertyName, roundedValue);
    }

    render() {
        const { classes } = this.props;
        return(
            <Grid container direction='column' >
                <Typography id="TimerHeader" className={classes.editPanelSubsectionHeader}>Timer</Typography>
                <Grid item id='LetterSpacingSlider' >
                    <Typography className={classes.controlElementLabel}>Total Time (in minutes)</Typography>
                    <TextField type="number" defaultValue={this.state.totalTime} onChange={(event) => this.handleChange(event, event.target.value, 'totalTime')}/>
                </Grid>
                <Typography className={classes.controlElementLabel}>Format</Typography>
                <Grid item container direction='row' id='ButtonRow' className={classes.alignmentButtonRow}>
                    <Grid item>
                        <IconButton disableRipple className={classNames(classes.LeftRowButton, this.state.showHours ? classes.rowButtonSelected : '')} 
                                    onClick={(event) => this.handleChange(event, !this.state.showHours, 'showHours')}> 
                            H
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton disableRipple className={classNames(classes.CenterRowButton, this.state.showMinutes ? classes.rowButtonSelected : '')} 
                                    onClick={(event) => this.handleChange(event, !this.state.showMinutes, 'showMinutes')}>
                            M
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton disableRipple className={classNames(classes.CenterRowButton, this.state.showSeconds ? classes.rowButtonSelected : '')} 
                                    onClick={(event) => this.handleChange(event, !this.state.showSeconds, 'showSeconds')}>
                            S
                        </IconButton>
                    </Grid>
                    {/*TODO:[V1.1 Mandatory] fix milliseconds on live screen
                    <Grid item>
                        <IconButton disableRipple className={classNames(classes.RightRowButton, this.state.showMilliseconds ? classes.rowButtonSelected : '')} 
                                    onClick={(event) => this.handleChange(event, !this.state.showMilliseconds, 'showMilliseconds')}>
                            MS
                        </IconButton>
                    </Grid>
                    */}
                    {/*TODO:[V1.1 Mandatory] add checkbox and helper tooltip for what this does 
                    <Grid>
                        <Typography className={classes.controlElementLabel}>Include Leading Zero</Typography>
                    </Grid>
                    */}
                </Grid>
            </Grid>
        );
    }
}

export default  withStyles(styles)(TimerEditPanel)