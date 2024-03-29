import React, { Component } from 'react';
import Value from 'grommet/components/Value';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import PouchDataManager from '../PouchDataManager';
const electron = window.require('electron')
var WebFont = window.require('webfontloader');
class Timer extends React.Component{
  constructor(props) {
    super(props);
    this.db = PouchDataManager.localDB;
  }

  componentDidMount() {
    if(this.props.liveScreen) {
      this.setFont();
      this.setTextColor();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.selectedRoomId != this.props.selectedRoomId) {
        this.setFont();
        this.setTextColor();
    }
  }

  setFont() {
    this.db.get(electron.remote.getGlobal('customerEmail') + '\\' + this.props.selectedRoomId + '\\liveViewFont').then(function(doc) {
      WebFont.load({
        google: { 
               families: [doc.font] 
         } 
      });
      document.getElementById('ClueDisplay').style.fontFamily = doc.font;
    }).catch(function (err) {
      console.log(err);
    })
  }

  setTextColor() {
    this.db.get(electron.remote.getGlobal('customerEmail') + '\\' + this.props.selectedRoomId + '\\liveViewTextColor').then(function(doc) {
      document.getElementById('ClueDisplay').style.color = doc.color;
    }).catch(function (err) {
      console.log(err);
    })
  }

  render() {
    return (
      <Grid container item justify='center' alignItems='center'><Typography align='center' style={{color:this.props.fontColor, fontFamily:this.props.font, overflow:'hidden', margin:12}} id="ClueDisplay" variant={this.props.preview?'h3':'h2'}>{this.props.clue}</Typography></Grid>
    );
  }
}

export default Timer;
