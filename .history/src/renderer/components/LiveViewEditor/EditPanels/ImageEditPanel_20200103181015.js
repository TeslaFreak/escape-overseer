import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Slider from '@material-ui/core/Slider';
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
    alignmentButtonRow: {
        fontSize: '12px',
        width: '100%',
        padding: '12px 0px',
    },
    alignLeftButton: {
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
    alignCenterButton: {
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
    alignRightButton: {
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
        this.state={scale: parseInt(this.props.selectedItem.getScaledWidth()**(1/1.7), 10), opacity: this.props.selectedItem.opacity*100, fit: this.props.selectedItem.fit,
                    order: this.props.selectedItem.getZIndex()};
        this.objects = [];
        
    }

    componentDidUpdate(prevProps, prevState) {
        
    }

    componentDidMount() {

    }

    componentWillUpdate(nextProps) {
        if (this.state.scale !== parseInt(nextProps.selectedItem.getScaledWidth()**(1/1.7), 10) ) {
            this.setState({scale: parseInt(nextProps.selectedItem.getScaledWidth()**(1/1.7), 10), opacity: nextProps.selectedItem.opacity*100})
        }
        if (this.state.fit !== nextProps.selectedItem.fit) {
            
            console.log("new fit: " + nextProps.selectedItem.fit);
            this.setState({fit: nextProps.selectedItem.fit})
        }
        if (this.state.order !== nextProps.selectedItem.getZIndex()) {
            this.setState({order: nextProps.selectedItem.getZIndex()})
        }
    }

    handleChange = (event, value, propertyName) => {
        let trueValue = value;
        let displayValue = value;
        switch(propertyName) {
            case 'opacity':
                trueValue = parseInt(value, 10)/100;
                displayValue = parseInt(value, 10);
                break;
            case 'scale':
                trueValue = parseInt(value, 10)**1.7;
                displayValue = parseInt(value, 10);
                break;
            case 'fit':
                break;
            default:
                trueValue = parseInt(value, 10);
                displayValue = parseInt(value, 10);
        }
        this.setState({[propertyName]: displayValue});
        this.props.updateItemProperty(propertyName, trueValue);
    }

    render() {
        const { classes } = this.props;
        return(
            <Grid container direction='column' >
                <Typography className={classes.editPanelSubsectionHeader}>Image</Typography>
                <Grid item container direction='row' id='FontAlignRow' className={classes.alignmentButtonRow}>
                    <Grid item>
                        <IconButton id='FillWidthButton' disableRipple className={classNames(classes.alignLeftButton, this.state.fit == 'width' ? classes.alignButtonSelected : '')} 
                                    onClick={(event) => this.handleChange(event, 'width', 'fit')}> 
                            Fit To Width
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton id='FillHeightButton' disableRipple className={classNames(classes.alignCenterButton, this.state.fit == 'height' ? classes.alignButtonSelected : '')} 
                                    onClick={(event) => this.handleChange(event, 'height', 'fit')}>
                            Fit To Height
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <IconButton id='FreeStandingButton' disableRipple className={classNames(classes.alignRightButton, this.state.fit == 'none' ? classes.alignButtonSelected : '')} 
                                    onClick={(event) => this.handleChange(event, 'none', 'fit')}>
                            No Fit
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid item id='ImageSizeSlider'>
                    <Typography className={classes.controlElementLabel}>Size</Typography>
                    <Tooltip title={this.state.scale} placement="top">
                    <Slider
                        classes={{
                            thumb: classes.thumb,
                            thumbWrapper: classes.thumbWrapper,
                            track: classes.track,
                          }}
                        value={this.state.scale}
                        min={1}
                        max={100}
                        onChange={(event, value) => this.handleChange(event, value, 'scale')}
                        valueLabelDisplay="auto"
                        disabled={this.state.fit!=='none'}
                    />
                    </Tooltip>
                </Grid>
                <Grid item id='OpacitySlider'>
                    <Typography className={classes.controlElementLabel}>Opacity</Typography>
                    <Tooltip title={this.state.opacity} placement="top">
                    <Slider
                        classes={{
                            thumb: classes.thumb,
                            thumbWrapper: classes.thumbWrapper,
                            track: classes.track,
                          }}
                        value={this.state.opacity}
                        min={0}
                        max={100}
                        onChange={(event, value) => this.handleChange(event, value, 'opacity')}
                    />
                    </Tooltip>
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

export default  withStyles(styles)(TypeEditPanel)