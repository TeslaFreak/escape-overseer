import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Slider from '@material-ui/lab/Slider';
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

class ClueCountEditPanel extends Component {

    constructor(props) {
        super(props);
        this.state={iconSize: (parseInt(this.props.selectedItem.getScaledWidth()**(1/1.7), 10)-(this.props.selectedItem.iconSpacing*this.props.selectedItem.numberOfClues-1))/this.props.selectedItem.numberOfClues,
                    iconSpacing: parseInt(this.props.selectedItem.iconSpacing**(1/2.2), 10)};
        this.objects = [];
        this.db = PouchDataManager.localDB;
        
    }

    componentDidUpdate(prevProps, prevState) {
        
    }

    componentDidMount() {

    }

    componentWillUpdate(nextProps) {
        //TODO: separate out for each state variable. here and in each edit panel file.
        if (this.state.iconSpacing !== parseInt(nextProps.selectedItem.iconSpacing**(1/2.2), 10) ) {
            this.setState({iconSpacing: parseInt(nextProps.selectedItem.iconSpacing**(1/2.2), 10)})
        }
        
        if (this.state.iconSize !== (parseInt(nextProps.selectedItem.getScaledWidth()**(1/1.7), 10)-(nextProps.selectedItem.iconSpacing*nextProps.selectedItem.numberOfClues-1))/nextProps.selectedItem.numberOfClues ) {
            this.setState({iconSize: (parseInt(nextProps.selectedItem.getScaledWidth()**(1/1.7), 10)-(nextProps.selectedItem.iconSpacing*nextProps.selectedItem.numberOfClues-1))/nextProps.selectedItem.numberOfClues})
        }
    }

    handleChange = (event, value, propertyName) => {
        let roundedValue = value;
        let displayValue = value;
        switch(propertyName) {
            case 'iconSize':
                roundedValue = parseInt(value, 10)**1.7;
                displayValue = parseInt(value, 10);
                break;
            case 'iconSpacing':
                roundedValue = parseInt(value, 10)**2.2;
                displayValue = parseInt(value, 10);
                break;
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
                <Typography id="TimerHeader" className={classes.editPanelSubsectionHeader}>Clue Counter</Typography>
                <Grid item >
                    <Typography className={classes.controlElementLabel}>Number of Clues</Typography>
                    <TextField type="number" defaultValue={3} onChange={(event) => this.handleChange(event, event.target.value, 'numberOfClues')}/>
                </Grid>
                <Typography className={classes.controlElementLabel}>Format</Typography>
                <Grid item container direction='row' id='ButtonRow' className={classes.alignmentButtonRow}>
                    <Grid item>
                        <IconButton disableRipple className={classNames(classes.LeftRowButton, this.state.showHours ? classes.rowButtonSelected : '')} 
                                    onClick={(event) => this.handleChange(event, !this.state.showHours, 'showHours')}> 
                            Visual
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton disableRipple className={classNames(classes.CenterRowButton, this.state.showMinutes ? classes.rowButtonSelected : '')} 
                                    onClick={(event) => this.handleChange(event, !this.state.showMinutes, 'showMinutes')}>
                            Numeric
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid item >
                    <Typography className={classes.controlElementLabel}>Set unused clue icon</Typography>
                    <IconButton disableRipple className={classNames(classes.CenterRowButton, this.state.showMinutes ? classes.rowButtonSelected : '')} 
                                    onClick={(event) => this.handleChange(event, !this.state.showMinutes, 'showMinutes')}>
                            Change
                    </IconButton>
                </Grid>
                <Grid item >
                    <Typography className={classes.controlElementLabel}>Set used clue icon</Typography>
                    <IconButton disableRipple className={classNames(classes.CenterRowButton, this.state.showMinutes ? classes.rowButtonSelected : '')} 
                                    onClick={(event) => this.handleChange(event, !this.state.showMinutes, 'showMinutes')}>
                            Change
                    </IconButton>
                </Grid>
                <Grid item id='SizeSlider' >
                    <Typography className={classes.controlElementLabel}>Icon Size</Typography>
                    <Tooltip title={this.state.iconSize} placement="top">
                    <Slider
                        classes={{
                            thumb: classes.thumb,
                            thumbWrapper: classes.thumbWrapper,
                            track: classes.track,
                          }}
                        value={this.state.iconSize}
                        min={1}
                        max={100}
                        onChange={(event, value) => this.handleChange(event, value, 'iconSize')}
                    />
                    </Tooltip>
                </Grid>
                <Grid item id='SpacingSlider' >
                    <Typography className={classes.controlElementLabel}>Icon Spacing</Typography>
                    <Tooltip title={this.state.iconSpacing} placement="top">
                    <Slider
                        classes={{
                            thumb: classes.thumb,
                            thumbWrapper: classes.thumbWrapper,
                            track: classes.track,
                          }}
                        value={this.state.iconSpacing}
                        min={0}
                        max={100}
                        onChange={(event, value) => this.handleChange(event, value, 'iconSpacing')}
                    />
                    </Tooltip>
                </Grid>
            </Grid>
        );
    }
}

export default  withStyles(styles)(ClueCountEditPanel)