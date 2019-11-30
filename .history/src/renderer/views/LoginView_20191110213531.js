import React, { Component } from 'react';
import OktaSignIn from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
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
import config from '../config';


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
    this.state = { username: '', password: '', showPassword: false, status: ''};
    const { pkce, issuer, clientId, redirectUri, scopes } = config.oidc;
    this.signIn = new OktaSignIn({
      /**
       * Note: when using the Sign-In Widget for an OIDC flow, it still
       * needs to be configured with the base URL for your Okta Org. Here
       * we derive it from the given issuer for convenience.
       */
      baseUrl: issuer.split('/oauth2')[0],
      clientId,
      redirectUri,
      logo: '/overseer blue-01.png',
      i18n: {
        en: {
          'primaryauth.title': 'Sign in to Escape Overseer',
        },
      },
      authParams: {
        pkce,
        issuer,
        display: 'page',
        scopes,
      },
    });

    this.db = new PouchDB('kittens');
  }

  componentDidMount() {
    this.signIn.renderEl(
        { el: '#sign-in-widget' },
        () => {
          /**
           * In this flow, the success handler will not be called beacuse we redirect
           * to the Okta org for the authentication workflow.
           */
        },
        (err) => {
          throw err;
        },
      );
    
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

  submitLogin = () => {
    electron.ipcRenderer.send("submitLogin", this.state.username, this.state.password);
  }

  render() {
    const { classes } = this.props;
    electron.ipcRenderer.on('loginFailure', (event, status) => {
      this.setState({status: status})
    });

    return (
      <React.Fragment>
          <div>
        <div id="sign-in-widget" />
      </div>
      </React.Fragment>
    )
  }

  componentWillUnmount() {
    
  }
}

export default withStyles(styles)(LiveScreen);
