import React, { Component } from 'react';
import './App.css';
import TimerControl from './TimerControl';
import ClueSelectControl from './ClueSelectControl';
import ClueCountControl from './ClueCountControl';
import LiveViewControl from './LiveViewControl';
import '../node_modules/grommet-css'
import App from 'grommet/components/App'


class ControlView extends Component {
  render() {
    return (
      <App className="ControlScreen">
        <LiveViewControl />
        <TimerControl />
        <ClueCountControl />
        <ClueSelectControl />
      </App>
    );
  }
}

export default ControlView;
