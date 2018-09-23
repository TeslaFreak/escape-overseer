import React, { Component } from 'react';
import './App.css';
import ReactDOM from 'react-dom';
import Timer from './Timer';
import ClueSelect from './ClueSelect';
import ClueCounter from './ClueCounter';
import ButtonRow from './ButtonRow';
import '../node_modules/grommet-css'
import App from 'grommet/components/App'


class LiveScreen extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Timer />
    )
  }

  componentDidMount() {
    
  }

  componentWillUnmount() {
    
  }
}

export default LiveScreen;
