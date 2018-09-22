import React, { Component } from 'react';
import './App.css';
import Timer from './Timer.js';
import ClueSelect from './ClueSelect.js';
import ClueCounter from './ClueCounter.js';
import ButtonRow from './ButtonRow';
import '../node_modules/grommet-css'
import App from 'grommet/components/App'


class ControlScreen extends Component {
  render() {
    return (
      <App className="ControlScreen">
        <ButtonRow />
        <Timer />
        <ClueCounter />
        <ClueSelect />
      </App>
    );
  }
}

export default ControlScreen;
