import React from 'react';
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
      <Link color="inherit" href="https://material-ui.com/">
        Escape Overseer
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
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
    marginTop: theme.spacing(3),
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
        

export default function SignUp() {
    const classes = useStyles();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('none');
    
    let db = PouchDataManager.localDB;

  const handleSignUpAttempt = (e) => {
    console.log('handleSignUpAttempt');
    console.log('email variable:' + email);
  //uncomment to skip login
  //electron.ipcRenderer.send("proceedToApp", email);
  e.preventDefault();
  if(navigator.onLine) {
      console.log('network status: online')
      fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers : new Headers(),
                body:JSON.stringify({demouser:tittle, body:body})
            }).then((res) => res.json())
            .then((data) =>  console.log(data))
            .catch((err)=>console.log(err))
  }
  else {
      console.log('network status: offline')
      db.get(email + '//chargebeeCredentials').then(function(credentialDoc) {
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

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
        <Typography className={classes.error} style={{visibility:error == 'none' ? 'hidden' : ''}}>
          {error}
        </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="confirm-password"
                label="Confirm Password"
                type="password"
                id="confirm-password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}