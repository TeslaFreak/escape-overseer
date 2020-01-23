import React, { Component } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PouchDataManager from '../PouchDataManager';
import DefaultReport from '../components/DefaultReport'
import ResetReport from '../components/ResetReport'
import Paper from '@material-ui/core/Paper';
import { Grid } from '@material-ui/core';
const electron = window.require('electron');


class ReportView extends Component {
  constructor(props) {
    super(props);
    this.state = {reportResetting: false,
                  answers: []};
    this.db = PouchDataManager.localDB;
  }

  updateAnswer = (index) => (e) => {
    let answers = this.state.answers;
    answers[index] = e.target.value;
    this.setState({answers: answers});
  }

  onSubmit = () => {
    let newReport = {
        datetime: Date().toLocaleString(),
        answers: this.state.answers
    }

    console.log(newReport);

    this.db.get(electron.remote.getGlobal('customerEmail') + '/reports').then(function (doc) {
      doc.reportsList.push(newReport)
      this.db.put(doc).catch(function (err) {
          console.log(err);
      });
    }.bind(this)).catch(function (err) {
        if(err.name=="not_found") {
            this.db.put({
                _id: 'reports',
                reportsList: [newReport],
              }).catch(function (err) {
                console.log(err);
              });
        }
    }.bind(this));

    this.setState({reportResetting: true});
  }

  startNewReport = () => {
    this.setState({reportResetting: false, answers: []})
  }
  
  render() {
    return (
        <Paper style={{padding:40, marginLeft:40, MarginRight:40}}>
          {this.state.reportResetting ? <ResetReport startNewReport={this.startNewReport} />
                                      : <DefaultReport answers={this.state.answers} updateAnswer={this.updateAnswer} onSubmit={this.onSubmit}/>
          }
        </Paper>
    );
  }
}

export default ReportView;
