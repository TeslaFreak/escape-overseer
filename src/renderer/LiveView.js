import React, { Component } from 'react';
import './App.css';
import Meter from 'grommet/components/Meter';
import TimeDisplay from './TimeDisplay';
import ClueCountDisplay from './ClueCountDisplay';
import ClueDisplay from './ClueDisplay';
import App from 'grommet/components/App'
import Box from 'grommet/components/Box';
const electron = window.require('electron')


class LiveScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { minutes: 60, seconds:0,
                    clue1Used: false, clue2Used: false, clue3Used: false,
                    clue: ''};
  }

  render() {
    electron.ipcRenderer.on('updateLiveViewTimeDisplay', (event, min, sec) => {
      this.setState({minutes: min, seconds: sec});
    });
    electron.ipcRenderer.on('updateLiveViewClueDisplay', (event, clue) => {
      this.setState({clue: clue});
    });
    electron.ipcRenderer.on('updateLiveViewClueCountDisplay', (event, clue1Used, clue2Used, clue3Used) => {
      this.setState({clue1Used: clue1Used, clue2Used: clue2Used, clue3Used: clue3Used});
    });
    return (
      <App>
        <Box direction='column'
            justify='center'
            align='center'
            pad='small'
            margin='small'>
          <ClueCountDisplay clue1Used={this.state.clue1Used} clue2Used={this.state.clue2Used} clue3Used={this.state.clue3Used} />
          <Meter
            label = {<TimeDisplay minutes={this.state.minutes} seconds={this.state.seconds} />}
            value = {this.state.minutes*60+this.state.seconds}
            type='circle'
            max={3600}
            size='medium' />
          <ClueDisplay clue={this.state.clue} />
        </Box>
      </App>
    )
  }

  componentDidMount() {
    
  }

  componentWillUnmount() {
    
  }
}

export default LiveScreen;
