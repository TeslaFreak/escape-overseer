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
    tooltipWidth: {
        maxWidth: 200,
    }
});

class NumericCounterEditPanel extends Component {

    constructor(props) {
        super(props);
        this.state={
                    order: this.props.selectedItem.getZIndex(),
                    numberOfClues: this.props.selectedItem.numberOfClues,
                    countDirection: this.props.selectedItem.countDirection};
        this.objects = [];
        this.db = new PouchDB('kittens');
        
    }

    componentDidUpdate(prevProps, prevState) {
        
    }

    componentDidMount() {

    }

    componentWillUpdate(nextProps) {
        if (this.state.numberOfClues !== nextProps.selectedItem.numberOfClues) {
            this.setState({numberOfClues: nextProps.selectedItem.numberOfClues})
        }
        if (this.state.order !== nextProps.selectedItem.getZIndex()) {
            this.setState({order: nextProps.selectedItem.getZIndex()})
        }

        if (this.state.countDirection !== nextProps.selectedItem.countDirection) {
            this.setState({countDirection: nextProps.selectedItem.countDirection})
        }
    }

    handleChange = (event, value, propertyName) => {
        let roundedValue = value;
        let displayValue = value;
        switch(propertyName) {
            case 'numberOfClues':
                if(value<0) {
                    return;
                }
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
                    <Typography className={classes.controlElementLabel}>Starting Number</Typography>
                    <TextField type="number" value={this.state.numberOfClues} onChange={(event) => this.handleChange(event, event.target.value, 'numberOfClues')}/>
                </Grid>
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

export default  withStyles(styles)(NumericCounterEditPanel)