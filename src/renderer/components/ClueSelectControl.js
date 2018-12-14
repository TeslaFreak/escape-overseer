import React, { Component } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import VolumeIcon from '@material-ui/icons/VolumeUp';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import AlertTone from '../../../assets/audio/alert1.wav';
import PouchDB from 'pouchdb';
import { array } from 'prop-types';
const electron = window.require('electron');
const alertTone = new Audio(AlertTone);
const babyBlue_1HueDarker = '#0086c3';

const styles = theme => ({
cssLabel: {
  '&$cssFocused': {
    color: babyBlue_1HueDarker,
  },
},
cssFocused: {},
});

class ClueSelectControl extends React.Component{
  constructor(props) {
    super(props);
    this.db = new PouchDB('kittens');
    this.state = {anchorEl: null,
                    clueOnScreen: '',
                    savedClues: []};
  
  }

  componentDidMount() {
    this.getSavedClues();
  }
  componentDidUpdate() {
    electron.ipcRenderer.send('updateLiveViewClueDisplay', this.state.clueOnScreen);
  }

  selectClue(inputtext) {
    this.setState({multiline:inputtext});
    this.handleClose();
  }

  getSavedClues() {
    this.db.get('roomClues').then(function (doc) {
        doc.clues.map((clue) => {this.setState({ savedClues: [...this.state.savedClues, clue.text] })});
    }.bind(this)).catch(function (err) {
        console.log(err);
    });
  }

  populateCluesMenu() {
    if(this.state.savedClues.length==0){
      return <MenuItem onClick={() => this.handleClose()} align='start' size='small' >You have no saved clues for this room</MenuItem>
    }
    else {
      return this.state.savedClues.map((clue) => <MenuItem style={{width:'600px', height:'auto', whiteSpace: 'normal'}} divider onClick={() => this.selectClue(clue)} align='start' size='small' >{clue}</MenuItem>);
    }
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
    const { classes } = this.props;
    const ITEM_HEIGHT = 45;
    
    return (
      <Grid>
        <Grid container direction='row' justify='center' alignItems='center' style={{padding:30}}>
        <TextField
          id="clueInput"
          placeholder="Enter a Clue..."
          multiline
          rows='2'
          rowsMax="5"
          classes={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
          value={this.state.multiline}
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
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: 600,
              },
            }}
          >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <MenuList>
                      {this.populateCluesMenu()}
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

export default withStyles(styles)(ClueSelectControl);
