import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import PouchDataManager from '../PouchDataManager';
const electron = window.require('electron')

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
    backgroundColor: theme.palette.secondary.main,
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
}));

//cloudant api key 0cPWOUlNa7Mir3sxP8p7fSVKsZ4FhX-auyAtwxILPzgJ
export default function SignIn() {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('none');

  let db = PouchDataManager.localDB;

  useEffect(() => {
    // code to run on component mount
    console.log('updating email:' + email)
  }, [email])

  

  //TODO: try to turn this into an api call and look into ibm's user auth/storage, see if we can use that instead
  //api url: /verifyUserCredentials
  const handleLoginAttempt = async (e) => {
      console.log('handleLoginAttempt');
      console.log('email variable:' + email);
    //uncomment to skip login
    //electron.ipcRenderer.send("proceedToApp", email);
    e.preventDefault();
    if(navigator.onLine) {
        console.log('network status: online')
        let response = await fetch('https://21731c69.us-south.apigw.appdomain.cloud/escapeoverseerAPI/verifyUserCredentials?email=' + email + '&password=' + password, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                      },
                    body: JSON.stringify({email: email, password: password})
                });
        console.log(response);
        return;




        
        db.get(email + '//userProfile').then(function(doc) {
            if(doc.email == email && doc.password == password) {
                db.get(email + '//chargebeeCredentials').then(function(doc) {
                    if(doc.email == email) {
                        electron.ipcRenderer.send("verifySubscription", doc.customerId, doc.customerSubscriptionId);
                    }
                    else{
                        setError('Invalid email');
                    }
                }.bind(this)).catch(function (err) {
                    if(err.name == 'not_found') {
                        setError('No subscription found')
                    } else {
                        console.log("database connection error")
                        console.log(err);
                        setError(err.reason);
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
  });


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
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
            className={classes.submit}
            onClick={handleLoginAttempt}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
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