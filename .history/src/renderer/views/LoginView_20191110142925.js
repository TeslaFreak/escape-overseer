import React, { Component } from 'react';
import Meter from 'grommet/components/Meter';
import TimeDisplay from '../components/TimeDisplay';
import ClueCountDisplay from '../components/ClueCountDisplay';
import ClueDisplay from '../components/ClueDisplay';
import classNames from 'classnames';
import { withStyles, withTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import PouchDB from 'pouchdb';
import { Grid, Button } from '@material-ui/core';
const electron = window.require('electron')
var WebFont = window.require('webfontloader');


const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      margin: {
        margin: theme.spacing(1),
      },
      withoutLabel: {
        marginTop: theme.spacing(3),
      },
      textField: {
        width: 200,
      },
});

class LiveScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { username: '', password: '', showPassword: false};

    document.documentElement.style.overflow = 'hidden';
    this.db = new PouchDB('kittens');
  }

  componentDidMount() {
    
    
  }

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  render() {
    const { classes } = this.props;
    electron.ipcRenderer.on('updateLiveViewTimeDisplay', (event, min, sec) => {
      this.setState({minutes: min, seconds: sec},
        this.timer.updateTimeDisplay(Number(min),(Number(sec))));
        this.canvas.requestRenderAll();
    });

    return (
      <React.Fragment>
          <Grid container justify='center' alignItems='center' direction='column'>
              <Grid item>
                <FormControl className={classNames(classes.margin, classes.textField)} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Username</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-username"
                    value={this.state.username}
                    onChange={this.handleChange('username')}
                    labelWidth={70}
                />
                </FormControl>
            </Grid>
            <Grid item>
                <FormControl className={classNames(classes.margin, classes.textField)} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-password"
                    type={this.state.showPassword ? 'text' : 'password'}
                    value={this.state.password}
                    onChange={this.handleChange('password')}
                    endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                        aria-label="toggle password visibility"
                        onClick={this.handleClickShowPassword}
                        onMouseDown={this.handleMouseDownPassword}
                        >
                        {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                    }
                    labelWidth={70}
                />
                </FormControl>
            </Grid>
            <Grid item>
                <Button variant="contained" color="primary">
                    Login
                </Button>
            </Grid>
        </Grid>
      </React.Fragment>
    )
  }

  componentWillUnmount() {
    
  }
}

export default withStyles(styles)(LiveScreen);
