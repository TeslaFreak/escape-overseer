import React, { Component, Children } from 'react';
import LockIcon from '@material-ui/icons/Lock';
import ClearIcon from '@material-ui/icons/Clear';
import { Grid } from '@material-ui/core';
import PouchDB from 'pouchdb';
import { black } from 'material-ui/styles/colors';
const electron = window.require('electron');

class ClueCountDisplay extends React.Component{
  constructor(props) {
    super(props);
    this.state={activeColor:black};
    this.db = new PouchDB('kittens');
  }

  componentDidMount() {
    if(this.props.liveScreen || this.props.preview)
      this.setTextColor();
  }

  setTextColor() {
    this.db.get('liveViewTextColor').then(function(doc) {
      this.setState({activeColor: doc.color});
    }.bind(this)).catch(function (err) {
      console.log(err);
    })
  }

  getIconFromStatus = (isUsed) => {
    return isUsed ? <ClearIcon className='ClueIcon' style={{color:this.state.activeColor, width:this.props.liveScreen?180:120, height:'100%'}}/> 
                  : <LockIcon className='ClueIcon' style={{color:this.state.activeColor, width:this.props.liveScreen?180:120, height:'100%'}}/>;
  }

  render() {
    return (
      <Grid container direction='row' justify='center' alignItems='flex-start'>
        <Grid item >{this.getIconFromStatus(this.props.clue1Used)}</Grid>
        <Grid item >{this.getIconFromStatus(this.props.clue2Used)}</Grid>
        <Grid item >{this.getIconFromStatus(this.props.clue3Used)}</Grid>
      </Grid>
    );
  }
}

export default ClueCountDisplay;
