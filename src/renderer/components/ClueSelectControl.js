import React, { Component } from 'react';
import TextInput from 'grommet/components/TextInput';
import Value from 'grommet/components/Value';
import Menu from 'grommet/components/Menu';
import Anchor from 'grommet/components/Anchor';
import Box from 'grommet/components/Box';
import CaretDownIcon from 'grommet/components/icons/base/CaretDown';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import VolumeIcon from '@material-ui/icons/VolumeUp';
import ClearIcon from '@material-ui/icons/Clear';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
const electron = window.require('electron');

class ClueSelectControl extends React.Component{
  constructor(props) {
    super(props);
    this.state = {clueOnScreen: '',
                    savedClues: ['hello how was your day and do you ever need me to eat a shoe',
                                  'farfignutten as;ldfja ;elaij f;laijewf ;alowiej ;aoleji',
                                  ';lasjk; olfaije;li a;lejk f;lajwief; lajwef ;lajwif;lajwief;lajwief;lawjef;lajewf;lawje;lwijefa']};
    
  }

  componentDidUpdate() {
    electron.ipcRenderer.send('updateLiveViewClueDisplay', this.state.clueOnScreen);
  }

  selectClue(inputtext) {
    document.getElementById("clueInput").value=inputtext;
  }

  populateSavedClues() {
    return this.state.savedClues.map((clue) => <Anchor onClick={() => this.selectClue(clue)} align='start' size='xsmall' label={clue}/>);
  }

  sendAlertTone() {
    //bloop
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

  render() {
    return (
      <Box>
        <Box direction='row' justify='center' align='center'
              pad='small'
              margin='small'>
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
          <Menu  inline={false} dropAlign={{right: 'right', top: 'bottom'}} icon={<ExpandMoreIcon fontSize='large'/>}>
            {this.populateSavedClues()}
          </Menu>
        </Box>
        <Box direction='row' justify='center'>
          <Button color='secondary'   variant='contained'onClick={this.sendAlertTone}><VolumeIcon /></Button>
          <Button color='primary' variant='contained' onClick={this.sendClue}>Send Clue</Button>
          <Button color='secondary'  variant='contained'onClick={this.clearLiveScreen}><ClearIcon /></Button>
        </Box>
      </Box>
    );
  }
}

export default ClueSelectControl;
