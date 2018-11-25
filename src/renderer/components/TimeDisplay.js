import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import PouchDB from 'pouchdb';
const electron = window.require('electron')
var WebFont = window.require('webfontloader');

class Timer extends React.Component{
  constructor(props) {
    super(props);
    this.db = new PouchDB('kittens');
  }

  componentDidMount() {
    if(this.props.liveScreen == true) {
      this.setFont();
      this.setTextColor();
    }
  }

  timeIsUp() {
    return (this.props.minutes <=0 && this.props.seconds <= 0);
  }
  
  getTimeDisplay() {
    return this.timeIsUp() ?
      ("Game Over!") :
      (this.props.minutes.toString().padStart(2,0)+":"+this.props.seconds.toString().padStart(2,0));
  }

  setFont() {
    this.db.get('liveViewFont').then(function(doc) {
      WebFont.load({
        google: { 
               families: [doc.font] 
         } 
      });
      document.getElementById('Timedisplay').style.fontFamily = doc.font;
    }).catch(function (err) {
      console.log(err);
    })
  }

  setTextColor() {
    this.db.get('liveViewTextColor').then(function(doc) {
      document.getElementById('Timedisplay').style.color = doc.color;
    }).catch(function (err) {
      console.log(err);
    })
  }

  render() {
    return (
      <Grid><Typography id="Timedisplay" style={{color:this.props.fontColor, fontFamily:this.props.font}} variant={this.props.liveScreen?"h1":"h2"}>{this.getTimeDisplay()}</Typography></Grid>
    );
  }
}

export default Timer;
