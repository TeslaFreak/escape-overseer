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
import PouchDataManager from '../PouchDataManager';
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
      logo: 'overseer blue-01.png',
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

    this.db = PouchDataManager.localDB;
  }

  componentDidMount() {
    this.signIn.renderEl(
        { el: '#sign-in-widget' },
        function success(res) {
            // The properties in the response object depend on two factors:
            // 1. The type of authentication flow that has just completed, determined by res.status
            // 2. What type of token the widget is returning
        
            // The user has started the password recovery flow, and is on the confirmation
            // screen letting them know that an email is on the way.
            if (res.status === 'FORGOT_PASSWORD_EMAIL_SENT') {
              // Any followup action you want to take
              return;
            }
        
            // The user has started the unlock account flow, and is on the confirmation
            // screen letting them know that an email is on the way.
            if (res.status === 'UNLOCK_ACCOUNT_EMAIL_SENT') {
              // Any followup action you want to take
              return;
            }
        
            // The user has successfully completed the authentication flow
            if (res.status === 'SUCCESS') {
        
              // Handle success when the widget is not configured for OIDC
        
              if (res.type === 'SESSION_STEP_UP') {
                // Session step up response
                // If the widget is not configured for OIDC and the authentication type is SESSION_STEP_UP,
                // the response will contain user metadata and a stepUp object with the url of the resource
                // and a 'finish' function to navigate to that url
                console.log(res.user);
                console.log('Target resource url: ' + res.stepUp.url);
                res.stepUp.finish();
                return;
              } else {
                // If the widget is not configured for OIDC, the response will contain
                // user metadata and a sessionToken that can be converted to an Okta
                // session cookie:
                console.log(res.user);
                res.session.setCookieAndRedirect('https://acme.com/app');
                return;
              }
        
        
              // OIDC response
        
              // If the widget is configured for OIDC with a single responseType, the
              // response will be the token.
              // i.e. authParams.responseType = 'id_token':
              console.log(res.claims);
              this.signIn.tokenManager.add('my_id_token', res);
        
              // If the widget is configured for OIDC with multiple responseTypes, the
              // response will be an array of tokens:
              // i.e. authParams.responseType = ['id_token', 'token']
              this.signIn.tokenManager.add('my_id_token', res[0]);
              this.signIn.tokenManager.add('my_access_token', res[1]);
        
              return;
            }
        
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

  handleSignIn = () => {
    var accessToken = this.signIn.tokenManager.get('access_token');

    if (!accessToken) {
      console.log('This means that the user is not logged in')
      return;
    }

    console.log('This means that the user is logged in')
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
