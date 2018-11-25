import React, { Component } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import VolumeIcon from '@material-ui/icons/VolumeUp';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import AlertTone from '../../../assets/audio/alert1.wav';
const electron = window.require('electron');
const alertTone = new Audio(AlertTone);

class ClueSelectControl extends React.Component{
  constructor(props) {
    super(props);
    this.state = {anchorEl: null,
      clueOnScreen: '',
                    savedClues: ['hello how was your day and do you ever need me to eat a shoe',
                                  'farfignutten as;ldfja ;elaij f;laijewf ;alowiej ;aoleji',
                                  ';lasjk; olfaije;li a;lejk f;lajwief; lajwef ;lajwif;lajwief;lajwief;lawjef;lajewf;lawje;lwijefa']};
  
  }

  componentDidUpdate() {
    electron.ipcRenderer.send('updateLiveViewClueDisplay', this.state.clueOnScreen);
  }

  selectClue(inputtext) {
    document.getElementById("clueInput").value=inputtext;
    this.handleClose();
  }

  populateSavedClues() {
    return this.state.savedClues.map((clue) => <MenuItem onClick={() => this.selectClue(clue)} align='start' size='small' >{clue}</MenuItem>);
  }

  sendAlertTone() {
    var audioPromise = alertTone.play();
  }

  sendClue = () => {
    this.sendAlertTone();
    this.setState({clueOnScreen: document.getElementById("clueInput").value});
    document.getElementById("clueInput").value='';
  }

  clearLiveScreen = () => {
    this.setState({clueOnScreen: ''});
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;
    return (
      <Grid>
        <Grid container direction='row' justify='center' alignItems='center' style={{padding:30}}>
        <TextField
          id="clueInput"
          placeholder="Enter a Clue..."
          multiline
          rows='2'
          rowsMax="5"
          onChange={this.handleChange('multiline')}
          margin="normal"
          variant="outlined"
          style={{width:'40%', height:'auto'}}
        />
          <IconButton aria-owns={anchorEl ? 'simple-menu' : null}
          aria-haspopup="true"
          onClick={this.handleClick}><ExpandMoreIcon fontSize='large'/></IconButton>
          <Popover 
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)} anchorEl={anchorEl}
          >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <MenuList>
                      {this.populateSavedClues()}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
          </Popover>
        </Grid>
        <Grid container direction='row' justify='center' align='center'>
          <Button color='secondary'   variant='contained'onClick={this.sendAlertTone}><VolumeIcon /></Button>
          <Button color='primary' variant='contained' onClick={this.sendClue}>Send Clue</Button>
          <Button color='secondary'  variant='contained'onClick={this.clearLiveScreen}><ClearIcon /></Button>
        </Grid>
      </Grid>
    );
  }
}

export default ClueSelectControl;
