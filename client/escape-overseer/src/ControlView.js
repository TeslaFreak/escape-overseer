import React, { Component } from 'react';
import './App.css';
import Timer from './Timer';
import ClueSelect from './ClueSelect';
import ClueCounter from './ClueCounter';
import ButtonRow from './ButtonRow';
import '../node_modules/grommet-css'
import App from 'grommet/components/App'


class ControlView extends Component {
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

export default ControlView;
