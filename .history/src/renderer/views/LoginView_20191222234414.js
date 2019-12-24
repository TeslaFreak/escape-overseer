import React, { useState } from 'react';
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
const PouchDB = require('pouchdb');

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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('none');

  var userCredentials = {
    "apikey": "PlBAe8WJdCegOw_-IK8uW4z7EIyjQFbz9lMTVL47RZ-0",
    "host": "https://d0bbef17-7084-4e8a-8e9f-fbca21cb076a-bluemix.cloudantnosqldb.appdomain.cloud",
    "iam_apikey_description": "Auto-generated for key e640a234-c2b2-44a5-8976-848c28553796",
    "iam_apikey_name": "EO-credentials-1",
    "iam_role_crn": "crn:v1:bluemix:public:iam::::serviceRole:Manager",
    "iam_serviceid_crn": "crn:v1:bluemix:public:iam-identity::a/be4505c39b6546968854990483294a9d::serviceid:ServiceId-4925cb6e-81e6-484b-baa8-7c7e7baa8623",
    "password": "f5d938cf6fd7518c297d084e9bf9898a4f36bd857fab032ab0ce25dcfc518e4d",
    "port": 443,
    "url": "https://d0bbef17-7084-4e8a-8e9f-fbca21cb076a-bluemix:f5d938cf6fd7518c297d084e9bf9898a4f36bd857fab032ab0ce25dcfc518e4d@d0bbef17-7084-4e8a-8e9f-fbca21cb076a-bluemix.cloudantnosqldb.appdomain.cloud",
    "username": "d0bbef17-7084-4e8a-8e9f-fbca21cb076a-bluemix"
  };
  var dbapikey = {
	"username": "astoostratentreeregglats",
	"password": "a36ccca9742c97ae7eaafafd30cd5c8249f64872"
}
  let db = PouchDataManager.localDB;

  const handleLoginAttempt = (e) => {
    //uncomment to skip login
    //electron.ipcRenderer.send("proceedToApp");
    e.preventDefault();
    if(navigator.onLine) {
        console.log('network status: online')
        db.get(username + ':userCredentials').then(function(doc) {
            if(doc.username == username && doc.password == password) {
                electron.ipcRenderer.send("verifySubscription", doc.customerSubscriptionId);
            }
            else{
                setError('Invalid username or password');
            }
          }.bind(this)).catch(function (err) {
            if(err.name == 'not_found') {
                setError('Invalid username or password. Please use the link below to create an account if you have not already')
            } else {
                console.log("database connection error")
                console.log(err);
                setError(err.reason);
            }
          }.bind(this))
    }
    else {
        console.log('network status: offline')
        db.get('_local/' + username + ':authToken').then(function(doc) {
            if(doc.token.expirationTimestamp > Date.now()) {
                electron.ipcRenderer.send("proceedToApp");
            } else {
                setError('Your current offline session has expired. Please connect to the internet to renew your authentication')
            }
        }.bind(this)).catch(function(err) {
            if(err.name == 'not_found') {
                setError('An online connection is required to verify your account at this time. Please connect to the internet and try again')
            }
        }.bind(this))
    }
  }

  electron.ipcRenderer.on('verifySubscriptionResponse', (event, approved, errorMessage) => {
    if(approved) {
        console.log('sub approval status: ' + approved);
        electron.ipcRenderer.send("proceedToApp");
    }
    else{
        setError(errorMessage);
    }
  });

  electron.ipcRenderer.on('storeAuthToken', (event, token) => {
    let db = PouchDataManager.localDB;
    db.put({
        _id: '_local/' + username + ':authToken',
        token: token,
      });
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
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
              <Link href="#" variant="body2">
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