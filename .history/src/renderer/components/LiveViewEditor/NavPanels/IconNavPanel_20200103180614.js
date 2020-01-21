import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PouchDataManager from '../../PouchDataManager';
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
    editorContainer: {
        width: '100%',
        height: `calc(100vh - ${appbarHeight}px)`
    },
    centeredAspectPanel: {
        width: `calc(${containerWidth} * ${aspectWidthRatio} )`,
        height: `calc(${containerWidth} * ${aspectHeightRatio} )`,
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
    sidePanel: {
        width: '280px',
        height: '100%',
        backgroundColor: '#35414c',
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
        top: 0,
        left: 0,
        transition: 'all .15s'
    },
    navPanelAddRegion: {
            transition: 'all .15s',
            width: '100%',
            margin: '20px 0 0',
            color: '#fff',
            opacity: '.8',
            fontSize: '11px',
            fontWeight: '400',
            textTransform: 'uppercase',
            backgroundSize: '22px 22px',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top',
            boxSizing: 'border-box',
            borderRadius: '0'
    },
    navPanelButton: {
        transition: 'all .15s',
        width: '100%',
        color: '#fff',
        opacity: '.5',
        fontSize: '11px',
        fontWeight: '400',
        textTransform: 'uppercase',
        backgroundSize: '22px 22px',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top',
        boxSizing: 'border-box',
        borderRadius: '0',
        hoverCursor: {
            opacity: 1,
        },
    },

});

class IconNavPanel extends Component {

    constructor(props) {
        super(props);
        this.state={};
        this.objects = [];
        this.db = PouchDataManager.localDB;
        
    }

    componentDidUpdate(prevProps, prevState) {
        
    }

    componentDidMount() {

    }

    render() {
        const { classes } = this.props;
        return(
            <React.Fragment>
                <IconButton id="EditTypeButton" disableRipple className={classes.navPanelButton}>
                    <Grid container direction='column'>
                        <Grid item>
                            <TextFieldIcon/>
                        </Grid>
                        <Grid item>
                            Type
                        </Grid>
                    </Grid>
                </IconButton>
                <IconButton id="EditColorButton" disableRipple className={classes.navPanelButton}>
                    <Grid container direction='column'>
                        <Grid item>
                            <ColorIcon/>
                        </Grid>
                        <Grid item>
                            Color
                        </Grid>
                    </Grid>
                </IconButton>
            </React.Fragment>
        );
    }
}

export default  withStyles(styles)(IconNavPanel)