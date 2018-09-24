import React, { Component } from 'react';
import TextInput from 'grommet/components/TextInput';
import Value from 'grommet/components/Value';
import Menu from 'grommet/components/Menu';
import Anchor from 'grommet/components/Anchor';
import Box from 'grommet/components/Box';
import CaretDownIcon from 'grommet/components/icons/base/CaretDown';
import VolumeIcon from 'grommet/components/icons/base/Volume';
import ClearIcon from 'grommet/components/icons/base/Clear';
import Button from 'grommet/components/Button';
const electron = window.require('electron');

class ClueSelectControl extends React.Component{
  constructor(props) {
    super(props);
    this.state = {clueToSend: '',
                    clueOnScreen: '',
                    savedClues: ['hello how was your day and do you ever need me to eat a shoe',
                                  'farfignutten as;ldfja ;elaij f;laijewf ;alowiej ;aoleji',
                                  ';lasjk; olfaije;li a;lejk f;lajwief; lajwef ;lajwif;lajwief;lajwief;lawjef;lajewf;lawje;lwijefa']};
    
  }

  componentDidUpdate() {
    electron.ipcRenderer.send('updateLiveViewClueDisplay', this.state.clueOnScreen);
  }

  selectClue(inputtext) {
    this.setState({clueToSend: inputtext});
  }

  populateSavedClues() {
    return this.state.savedClues.map((clue) => <Anchor onClick={() => this.selectClue(clue)} align='start' size='xsmall' label={clue}/>);
  }

  sendAlertTone() {
    //bloop
  }

  sendClue = () => {
    let clue = this.state.clueToSend;
    this.sendAlertTone();
    this.setState({clueOnScreen: clue, clueToSend: ''});
  }

  clearLiveScreen = () => {
    this.setState({clueOnScreen: ''});
  }

  render() {
    return (
      <Box>
        <Box direction='row' justify='center' align='center'
              pad='small'
              margin='small'>
        <TextInput placeHolder='Enter a clue...' id='clueInput' value={this.state.clueToSend}/>
          <Menu  inline={false} dropAlign={{right: 'right', top: 'bottom'}} icon={<CaretDownIcon />}>
            {this.populateSavedClues()}
          </Menu>
        </Box>
        <Box direction='row' justify='center'>
          <Button colorindex='ok' icon={<VolumeIcon />} onClick={this.sendAlertTone} />
          <Button colorindex='neutral-1' primary={true} label='Send Clue' onClick={this.sendClue} />
          <Button colorindex='critical' icon={<ClearIcon />} onClick={this.clearLiveScreen} />
        </Box>
      </Box>
    );
  }
}

export default ClueSelectControl;
