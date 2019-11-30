import React, { Component } from 'react';
import Meter from 'grommet/components/Meter';
import TimeDisplay from '../components/TimeDisplay';
import ClueCountDisplay from '../components/ClueCountDisplay';
import ClueDisplay from '../components/ClueDisplay';
import classNames from 'classnames';
import { withStyles, withTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import FilledInput from '@material-ui/core/FilledInput';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import PouchDB from 'pouchdb';
const electron = window.require('electron')
var WebFont = window.require('webfontloader');


const styles = theme => ({
  background: {
    height: '100vh',
    width: '100%',
    outlineColor: 'transparent'
  },
  alwaysVisible: {
    paddingTop: '3%'
  },
  videoPlayer: {
    objectFit: 'contain',
    objectPosition: '50% 50%',
    height: '100vh',
    backgroundColor: 'black'
  },
  editingBackground: {
    backgroundColor: '#ededed',
    height: '100%',
    width: '100%'
},
});

class LiveScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { minutes: 60, seconds:0,
                    clue1Used: false, clue2Used: false, clue3Used: false,
                    clue: '',
                    playVideo: false,
                    selectedRoomId: null,
                    aspectWidth: `calc(${containerWidth} * ${aspectWidthRatio} )`, aspectHeight: `calc(${containerWidth} * ${aspectHeightRatio} )`,
                    aspectDominantDimension: 'width'};

    document.documentElement.style.overflow = 'hidden';
    this.db = new PouchDB('kittens');
  }

  componentDidMount() {
    
    
  }

  render() {
    const { classes } = this.props;
    electron.ipcRenderer.on('updateLiveViewTimeDisplay', (event, min, sec) => {
      this.setState({minutes: min, seconds: sec},
        this.timer.updateTimeDisplay(Number(min),(Number(sec))));
        this.canvas.requestRenderAll();
    });

    return (
      <React.Fragment>
          <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Username</InputLabel>
          <OutlinedInput
            id="outlined-adornment-username"
            value={values.password}
            onChange={handleChange('password')}
            labelWidth={70}
          />
        </FormControl>
        <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={values.showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleChange('password')}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            labelWidth={70}
          />
        </FormControl>
      </React.Fragment>
    )
  }

  componentWillUnmount() {
    
  }
}

export default withStyles(styles)(LiveScreen);
