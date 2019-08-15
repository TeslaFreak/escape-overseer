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
import Grid from '@material-ui/core/Grid';
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
    clickableArea: {
        left: '30px',
        width: '220px',
        height: '124px',
    },
    generalRatioStyles: {
        width: '100px',
        height: '100px',
        background: '#9aa6af'
    },
    aspectRatio16by9Button: {
        width: '133px',
        height: '75px',
        marginLeft: '43px',
        marginTop: '25px',
    },
    aspectRatio1by1Button: {
        width: '100px',
        height: '100px',
        marginLeft: '60px',
        marginTop: '12px',
    },
    aspectRatio4by3Button: {
        width: '115px',
        height: '87px',
        marginLeft: '52px',
        marginTop: '25px',
    },
});

class TypeEditPanel extends Component {

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

    render() {
        const { classes } = this.props;
        return(
            <Grid container direction='column' >
                {/*TODO: Add Custom size section */}
                {/*TODO: Make these actually work and set up onHover/onSelected styling */}
                <Typography id="StandardRatioHeader" className={classes.editPanelSubsectionHeader}>Standard</Typography>
                <Grid item container direction='column' justify='center' alignItems='stretch' id='StandardRatioSection'>
                    <Grid item container direction='column' justify='center' id='16:9Button' className={classes.clickableArea}>
                        <Grid className={classNames(classes.generalRatioStyles, classes.aspectRatio16by9Button)}>

                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography align='center' className={classes.controlElementLabel}>Widescreen</Typography>
                    </Grid>
                    <Grid item container direction='column' justify='center' id='1:1Button' className={classes.clickableArea}>
                        <Grid className={classNames(classes.generalRatioStyles, classes.aspectRatio1by1Button)}>

                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography align='center' className={classes.controlElementLabel}>Square</Typography>
                    </Grid>
                    <Grid item container direction='column' justify='center' id='4:3Button' className={classes.clickableArea}>
                        <Grid className={classNames(classes.generalRatioStyles, classes.aspectRatio4by3Button)}>

                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography align='center' className={classes.controlElementLabel}>Traditional</Typography>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default  withStyles(styles)(TypeEditPanel)