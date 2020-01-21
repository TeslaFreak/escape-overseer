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
import PouchDataManager from '../PouchDataManager';
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
          <Typography variant='h6'>What room are they playing</Typography>
            <Select value={this.props.answers[1]} onChange={this.props.updateAnswer(1)}>
              <MenuItem value={'Bastille'}>Bastille</MenuItem>
              <MenuItem value={'Witching Hour'}>Witching Hour</MenuItem>
              <MenuItem value={'The Lodge'}>The Lodge</MenuItem>
            </Select>
        </Grid>
        <Grid item style={{padding:16}}>
        <Typography variant='h6'>Who is the game guide</Typography>
        <Select value={this.props.answers[2]} onChange={this.props.updateAnswer(2)}>
            <MenuItem value={'Jessie'}>Jessie</MenuItem>
            <MenuItem value={'Steve'}>Steve</MenuItem>
            <MenuItem value={'Chris'}>Chris</MenuItem>
          </Select>
          </Grid>
          <Grid item style={{padding:16}}>
            <Typography variant='h6'>How many players</Typography>
            <RadioGroup row value={this.props.answers[3]} onChange={this.props.updateAnswer(3)}>
            <FormControlLabel value="1" control={<Radio />} label="1" />
            <FormControlLabel value="2" control={<Radio />} label="2" />
            <FormControlLabel value="3" control={<Radio />} label="3" />
            <FormControlLabel value="4" control={<Radio />} label="4" />
            <FormControlLabel value="5" control={<Radio />} label="5" />
            <FormControlLabel value="6" control={<Radio />} label="6" />
            <FormControlLabel value="7" control={<Radio />} label="7" />
            <FormControlLabel value="8" control={<Radio />} label="8" />
            <FormControlLabel value="9" control={<Radio />} label="9" />
            <FormControlLabel value="10" control={<Radio />} label="10" />
            <FormControlLabel value="11" control={<Radio />} label="11" />
            <FormControlLabel value="12" control={<Radio />} label="12" />
            </RadioGroup>
          </Grid>
          <Grid item style={{padding:16}}>
        <Typography variant='h6'>Did they win</Typography>
        <RadioGroup value={this.props.answers[4]} onChange={this.props.updateAnswer(4)}>
          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="No" control={<Radio />} label="No" />
        </RadioGroup>
        </Grid>
        <Grid item style={{padding:16}}>
        <Typography variant='h6'>How much time did they have left</Typography>
        <TextField value={this.props.answers[5]} onChange={this.props.updateAnswer(5)} id='time-remaining'/>
        </Grid>
        <Grid item style={{padding:16}}>
        <Typography variant='h6'>Did they enjoy their experience</Typography>
        <RadioGroup value={this.props.answers[6]} onChange={this.props.updateAnswer(6)}>
          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="No" control={<Radio />} label="No" />
        </RadioGroup>
        </Grid>
        <Grid item style={{padding:16}}>
        <Typography variant='h6'>Did everything work correctly during the course of the game</Typography>
        <RadioGroup value={this.props.answers[7]} onChange={this.props.updateAnswer(7)}>
          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="No" control={<Radio />} label="No" />
        </RadioGroup>
        </Grid>
        <Grid item style={{padding:16}}>
        <Typography variant='h6'>What went wrong</Typography>
        <TextField value={this.props.answers[8]} onChange={this.props.updateAnswer(8)}id='failure-summary'/>
        </Grid>
        <Grid item style={{padding:16}}>
        <Button variant="contained" color="primary" onClick={this.props.onSubmit}>
        Submit
        </Button>
        </Grid>
        </Grid>
    );
  }
}

export default DefaultReport;
