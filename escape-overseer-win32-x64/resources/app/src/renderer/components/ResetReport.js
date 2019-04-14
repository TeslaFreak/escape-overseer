import React, { Component } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PouchDB from 'pouchdb';
import Paper from '@material-ui/core/Paper';
import { Grid } from '@material-ui/core';
const electron = window.require('electron')

class DefaultReport extends React.Component{
  constructor(props) {
    super(props);
    this.state = {value:''};
  }

  render() {
    return (
        <Grid container direction='column'>
          <Grid item style={{padding:16}}>
            <Typography variant='h6'>Report Submitted!</Typography>
          </Grid>
          <Grid item style={{padding:16}}>
            <Button variant="contained" color="primary" onClick={this.props.startNewReport}>
              Start New Report
            </Button>
          </Grid>
        </Grid>
    );
  }
}

export default DefaultReport;
