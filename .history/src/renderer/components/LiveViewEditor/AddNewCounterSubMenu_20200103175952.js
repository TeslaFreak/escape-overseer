import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PouchDataManager from '../PouchDataManager';
import { withStyles, withTheme } from '@material-ui/core/styles';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import TextFieldIcon from '@material-ui/icons/TextFields';
import TimerIcon from '@material-ui/icons/Timer';
import VisualCounterIcon from '@material-ui/icons/Lock';
import NumericCounterIcon from '@material-ui/icons/Looks3';
import ClueIcon from '@material-ui/icons/Lock';
import AddClueIcon from '@material-ui/icons/EnhancedEncryption';
import AddClueTextIcon from '@material-ui/icons/SmsFailed';
import Popover from '@material-ui/core/Popover';
import { MuiThemeProvider } from '@material-ui/core/styles';
import {EOTheme} from '../../EscapeOverseerTheme';
import { fabric } from 'fabric';
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
    AddMenu: {
        width: 'auto',
        height: '82px',
        backgroundColor: 'white',
    
    },
    AddMenuInnerButton: {
        width: '60px',
        height: '60px',
        margin: '11px 11px 11px 0',
        outline: 'none',
        color: '#535f68',
        fontSize: '11px',
        fontWeight: '500',
        background: 'none',
        cursor: 'pointer',
        border: '1px solid #e8ebed',
        borderRadius: '4px',
        padding: '10px 0',
        textTransform: 'none',
        lineHeight: '1.5',
        textRendering: 'optimizeLegibility',
    },
    AddMenuInnerButtonLeftMost: {
        width: '60px',
        height: '60px',
        margin: '11px',
        position: 'relative',
        outline: 'none',
        color: '#535f68',
        fontSize: '11px',
        fontWeight: '500',
        background: 'none',
        cursor: 'pointer',
        border: '1px solid #e8ebed',
        borderRadius: '4px',
        padding: '10px 0',
        textTransform: 'none',
        lineHeight: '1.5',
        textRendering: 'optimizeLegibility',
    }

});

class AddNewCounterSubMenu extends Component {

    constructor(props) {
        super(props);
        this.state={anchorEl: null};
        this.objects = [];
        this.db = PouchDataManager.localDB;
        
    }

    componentDidUpdate(prevProps, prevState) {
        
    }

    componentDidMount() {
        
    }

    //because material popups are fucking stupid and will
    //fire a background click no matter where you click on screen.
    stopprop = event => {
        event.stopPropagation();
        console.log("props stopped");
    }

    render() {
        const { classes } = this.props;
        const { CanvasItemTypes } = this.props;
        return(
            <Grid container className={classes.AddMenu} onClick={this.stopprop}>
                <Grid item >
                    <Button id='AddNewVisualCounterButton' variant="outlined" disableRipple className={classes.AddMenuInnerButtonLeftMost}>
                        <Grid container direction='column' onClick={() => this.props.createNewCanvasItem(CanvasItemTypes.VISUALCOUNTER)}>
                            <Grid item>
                                <VisualCounterIcon/>
                            </Grid>
                            <Grid item>
                                Visual
                            </Grid>
                        </Grid>
                    </Button>
                </Grid>
                <Grid item >
                    <Button id='AddNewNumericCounterButton' variant="outlined" disableRipple className={classes.AddMenuInnerButton}>
                        <Grid container direction='column' onClick={() => this.props.createNewCanvasItem(CanvasItemTypes.NUMERICCOUNTER)}>
                            <Grid item>
                                <NumericCounterIcon/>
                            </Grid>
                            <Grid item>
                                Numeric
                            </Grid>
                        </Grid>
                    </Button>
                </Grid>
            </Grid>
        );
    }
}

export default  withStyles(styles)(AddNewCounterSubMenu)