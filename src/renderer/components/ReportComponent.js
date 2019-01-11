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
    this.state = {value: ''};
  }

  render() {
    return (
        <Grid container direction='column'>
        <Grid item style={{padding:16}}>
          <Typography variant='h6'>What room are they playing</Typography>
            <Select>
              <MenuItem value={'yes'}>Bastille</MenuItem>
              <MenuItem value={'no'}>Witching Hour</MenuItem>
              <MenuItem value={'no'}>The Lodge</MenuItem>
            </Select>
        </Grid>
        <Grid item style={{padding:16}}>
        <Typography variant='h6'>Who is the game guide</Typography>
        <Select>
            <MenuItem value={'yes'}>Jessie</MenuItem>
            <MenuItem value={'no'}>Steve</MenuItem>
            <MenuItem value={'no'}>Chris</MenuItem>
          </Select>
          </Grid>
          <Grid item style={{padding:16}}>
        <Typography variant='h6'>How many players</Typography>
        <Select>
            <MenuItem value={'yes'}>1</MenuItem>
            <MenuItem value={'no'}>2</MenuItem>
            <MenuItem value={'no'}>3</MenuItem>
            <MenuItem value={'no'}>4</MenuItem>
            <MenuItem value={'no'}>5</MenuItem>
            <MenuItem value={'no'}>6</MenuItem>
            <MenuItem value={'no'}>7</MenuItem>
            <MenuItem value={'no'}>8</MenuItem>
            <MenuItem value={'no'}>9</MenuItem>
            <MenuItem value={'no'}>10</MenuItem>
            <MenuItem value={'no'}>11</MenuItem>
            <MenuItem value={'no'}>12</MenuItem>
          </Select>
          </Grid>
          <Grid item style={{padding:16}}>
        <Typography variant='h6'>Did they win</Typography>
        <RadioGroup>
          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="No" control={<Radio />} label="No" />
        </RadioGroup>
        </Grid>
        <Grid item style={{padding:16}}>
        <Typography variant='h6'>How much time did they have left</Typography>
        <TextField id='time-remaining'/>
        </Grid>
        <Grid item style={{padding:16}}>
        <Typography variant='h6'>Did they enjoy their experience</Typography>
        <RadioGroup>
          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="No" control={<Radio />} label="No" />
        </RadioGroup>
        </Grid>
        <Grid item style={{padding:16}}>
        <Typography variant='h6'>Did everything work correctly during the course of the game</Typography>
        <RadioGroup>
          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="No" control={<Radio />} label="No" />
        </RadioGroup>
        </Grid>
        <Grid item style={{padding:16}}>
        <Typography variant='h6'>What went wrong</Typography>
        <TextField id='failure-summary'/>
        </Grid>
        <Grid item style={{padding:16}}>
        <Button variant="contained" color="primary">
        Submit
        </Button>
        </Grid>
        </Grid>
    );
  }
}

export default DefaultReport;
