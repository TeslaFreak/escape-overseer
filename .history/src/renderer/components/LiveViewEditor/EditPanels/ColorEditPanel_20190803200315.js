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
});

class TypeEditPanel extends Component {

    constructor(props) {
        super(props);
        this.state={fill: this.props.selectedItem.fill};
        this.objects = [];
        this.db = new PouchDB('kittens');
        
    }

    componentDidUpdate(prevProps, prevState) {
        
    }

    componentDidMount() {

    }

    componentWillUpdate(nextProps) {
        //TODO: separate out for each state variable. here and in each edit panel file.
        if (this.state.fill !== nextProps.selectedItem.fill ) {
            this.setState({fill: nextProps.selectedItem.fill})
        }
    }

    handleChange = (value) => {
        this.setState({fill: value});
        this.props.updateItemProperty('fill', value.hex);
    }

    render() {
        const { classes } = this.props;
        return(
            <Grid container direction='column' >
                <Tooltip title="Color may only be applied to text elements and SVG images" placement="right">
                    <Typography id="ColorHeader" className={classes.editPanelSubsectionHeader}>Color</Typography>
                </Tooltip>
                <Grid item id='ColorPicker' className={classes.colorPicker}>
                    <ChromePicker color={this.state.fill} disableAlpha={true} onChange={this.handleChange}/>
                </Grid>
            </Grid>
        );
    }
}

export default  withStyles(styles)(TypeEditPanel)