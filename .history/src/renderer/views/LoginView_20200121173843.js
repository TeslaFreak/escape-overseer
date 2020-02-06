import React, { useState, useEffect } from 'react';
import Link from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ExternalLink from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import PouchDataManager from '../PouchDataManager';
const electron = window.require('electron')

//TODO: V1 Mandatory: have copyright link upon correct site in new window.
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit">
        Escape Overseer
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    width: theme.spacing(10),
    height: theme.spacing(10),
 },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  error: {
    color: '#cc0033',
    display: 'inline-block',
    fontSize: '12px',
    lineHeight: '15px',
    minHeight: '15px',
    margin: '5px 0 0',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

//cloudant api key 0cPWOUlNa7Mir3sxP8p7fSVKsZ4FhX-auyAtwxILPzgJ
export default function SignIn() {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('none');
  const [loading, setLoading] = useState(false);

  let db = PouchDataManager.localDB;

  useEffect(() => {
    // code to run on component mount
  }, [email])

  

  //TODO: try to turn this into an api call and look into ibm's user auth/storage, see if we can use that instead
  //api url: /verifyUserCredentials
  const handleLoginAttempt = async (e) => {
      console.log('handleLoginAttempt');
      console.log('email variable:' + email);
    //uncomment to skip login
    //electron.ipcRenderer.send("proceedToApp", email);

    setLoading(true);
    e.preventDefault();
    if(navigator.onLine) {
        console.log('network status: online')
        let response = await fetch('https://21731c69.us-south.apigw.appdomain.cloud/escapeoverseerAPI/verifyUserCredentials', {
                    method: 'POST',
                    headers: new Headers( {'Content-Type': 'application/json'}),
                    body: JSON.stringify({"credentials": {"email": email, "password": password}})
                });
        let data = await response.json()
        if (data.errors && data.errors.status == '200') {
            setError(data.errors.message)
            console.log(data);
        }
        else if (data.errors && data.errors.status != '200') {
            setError("An internal server error has occured. Please contact Escape Overseer if you continue to experience this problem")
            console.log(data);
        }
        else if (data.customerId == false) {
            setError('No subscription found')
        }
        else {
            console.log("id: ");
            console.log(data);
            electron.ipcRenderer.send("verifySubscription", data);
            return;
        }
        setLoading(false);
    }
    else {
        console.log('network status: offline')
        db.get(email + '//userProfile').then(function(credentialDoc) {
            if(credentialDoc.email == email && credentialDoc.password == password) {
                db.get('_local/' + email + '//authToken').then(function(doc) {
                    console.log(doc.token);
                    console.log(Math.floor(Date.now() / 1000));
                    if(doc.token.expirationTimestamp > Math.floor(Date.now() / 1000)) {
                        electron.ipcRenderer.send("proceedToApp", document.getElementById('email').value);
                    } else {
                        setError('Your current offline session has expired. Please connect to the internet to renew your authentication')
                    }
                }.bind(this)).catch(function(err) {
                    if(err.name == 'not_found') {
                        setError('An online connection is required to verify your account at this time. Please connect to the internet and try again')
                    }
                }.bind(this))
            }
            else{
                setError('Invalid email or password');
            }
          }.bind(this)).catch(function (err) {
            if(err.name == 'not_found') {
                setError('Invalid email or password. Please use the link below to create an account if you have not already')
            } else {
                console.log("database connection error")
                console.log(err);
                setError(err.reason);
            }
          }.bind(this))
    }
  }

  electron.ipcRenderer.once('verifySubscriptionResponse', (event, token, errorMessage) => {
    if(token) {
        console.log('prepping to store');
        console.log(token);
        console.log('sub approval status: ' + token ? 'true' : 'false');

        db.get('_local//' + email + '//authToken').then(function (doc) {
            db.remove(doc).then(function () {
                db.put({
                    _id: '_local//' + email + '//authToken',
                    token: token
                  }).then(() => {
                      console.log('token saved succeccfully');
                      electron.ipcRenderer.send("proceedToApp", document.getElementById('email').value);
                    }).catch((err) => {
                          console.log('token failed to save');
                          console.log(err);
                      });
            }.bind(this));
        }.bind(this)).catch(function(err) {
            if(err.name == 'not_found') {
                db.put({
                    _id: '_local//' + email + '//authToken',
                    token: token
                  }).then(() => {
                      console.log('token saved succeccfully');
                      electron.ipcRenderer.send("proceedToApp", document.getElementById('email').value);
                    }).catch((err) => {
                          console.log('token failed to save');
                          console.log(err);
                      });
            }
        }.bind(this));
        
    }
    else{
        setError(errorMessage);
    }
    setLoading(false);
  });


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar} src="\favicon.png" />
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
        <Typography className={classes.error} style={{visibility:error == 'none' ? 'hidden' : ''}}>
          {error}
        </Typography>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            className={classes.submit}
            onClick={handleLoginAttempt}
          >
            {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <RouterLink to='/signup' variant="body2">
                {"Don't have an account? Sign Up"}
              </RouterLink>
            </Grid>
          </Grid>
          </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}