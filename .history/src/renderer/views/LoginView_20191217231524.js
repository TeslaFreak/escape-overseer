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

  
  var dbapikey = {
	"username": "astoostratentreeregglats",
	"password": "a36ccca9742c97ae7eaafafd30cd5c8249f64872"
}
    let db = new PouchDB(userCredentials.host + '/es-cloudant-db-1',  {
        auth: dbapikey
    });

  const handleLoginAttempt = (e) => {
    //electron.ipcRenderer.send("proceedToApp");
    e.preventDefault();
    //if(navigator.onLine) {
        console.log('network status: online')
        //check online db for login credentials
        db.get('demouser:userCredentials').then(function(doc) {
            if(doc.username == username && doc.password == password) {
                electron.ipcRenderer.send("verifySubscription", doc.customerSubscriptionId);
            }
            else{
                setError('Invalid username or password');
            }
          }.bind(this)).catch(function (err) {
            console.log("database connection error")
            console.log(err);
            setError(err.reason);
          }.bind(this))
    //}
  }

  electron.ipcRenderer.on('verifySubscriptionResponse', (event, approved, errorMessage) => {
    if(approved) {
        electron.ipcRenderer.send("proceedToApp");
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