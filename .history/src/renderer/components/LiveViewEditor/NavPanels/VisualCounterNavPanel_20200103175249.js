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
import AddIcon from '@material-ui/icons/Add';
import TextFieldIcon from '@material-ui/icons/TextFields';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import StarIcon from '@material-ui/icons/Star';
import LockIcon from '@material-ui/icons/Lock';
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
        backgroundColor: 'transparent',
        '&:hover': {
            opacity: 0.7,
            backgroundColor: 'transparent',
        },
    },

    navPanelButtonSelected: {
        transition: 'all .15s',
        width: '100%',
        color: '#fff',
        fontSize: '11px',
        fontWeight: '400',
        textTransform: 'uppercase',
        backgroundSize: '22px 22px',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top',
        boxSizing: 'border-box',
        borderRadius: '0',
        opacity: 1,
        backgroundColor: 'transparent',
        '&:hover': {
            opacity: 1,
            backgroundColor: 'transparent',
        },
    },

});

class CounterNavPanel extends Component {

    constructor(props) {
        super(props);
        this.state={selectedEditPanelType: this.props.EditPanelTypes.COUNTER};
        this.objects = [];
        this.db = PouchDataManager.localDB;
        
    }

    componentDidUpdate(prevProps, prevState) {
        
    }

    componentDidMount() {

    }

    componentWillUpdate(nextProps) {
        if (this.state.selectedEditPanelType !== nextProps.selectedEditPanelType ) {
            this.setState({selectedEditPanelType: nextProps.selectedEditPanelType})
        }
    }

    updateSelectedEditPanel(newPanelType) {
        this.props.updateSelectedEditPanel(newPanelType);
    }

    render() {
        const { classes } = this.props;
        return(
            <React.Fragment>
                <IconButton id="EditCounterButton" disableRipple 
                            className={this.state.selectedEditPanelType == this.props.EditPanelTypes.VISUALCOUNTER ? classes.navPanelButtonSelected : classes.navPanelButton}
                            onClick={() => this.updateSelectedEditPanel(this.props.EditPanelTypes.VISUALCOUNTER)}>
                    <Grid container direction='column'>
                        <Grid item>
                            <LockIcon/>
                        </Grid>
                        <Grid item>
                            Counter
                        </Grid>
                    </Grid>
                </IconButton>
                {//TODO:[V1.1 Preferable] Allow Upload of SVGs and enable this color edit section
                /*
                <IconButton id="EditColorButton" disableRipple 
                            className={this.state.selectedEditPanelType == this.props.EditPanelTypes.COLOR ? classes.navPanelButtonSelected : classes.navPanelButton}
                            onClick={() => this.updateSelectedEditPanel(this.props.EditPanelTypes.COLOR)}>
                    <Grid container direction='column' >
                        <Grid item>
                            <ColorIcon/>
                        </Grid>
                        <Grid item>
                            Color
                        </Grid>
                    </Grid>
                </IconButton>*/}
            </React.Fragment>
        );
    }
}

export default  withStyles(styles)(CounterNavPanel)